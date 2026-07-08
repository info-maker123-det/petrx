import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// In-memory geo cache: IP -> { city, state, country, ts }
const geoCache = new Map();
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// In-memory rate limiter: key -> ts
const recentVisits = new Map();
const RATE_LIMIT_WINDOW = 30 * 1000; // 30 seconds

function truncate(v, max) {
  return v ? String(v).slice(0, max) : '';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { page, visitor_id, session_id, referrer } = body;

    if (!page || !visitor_id) {
      return Response.json({ error: 'Missing page or visitor_id' }, { status: 400 });
    }

    // Input validation — limit lengths to prevent abuse
    const safePage = truncate(page, 500);
    const safeVisitorId = truncate(visitor_id, 100);
    const safeSessionId = truncate(session_id, 100);
    const safeReferrer = truncate(referrer, 2000);

    // Basic rate limiting — dedupe same visitor + page within window
    const rateKey = `${safeVisitorId}:${safePage}`;
    const now = Date.now();
    const lastSeen = recentVisits.get(rateKey);
    if (lastSeen && (now - lastSeen) < RATE_LIMIT_WINDOW) {
      return Response.json({ ok: true, deduped: true });
    }
    recentVisits.set(rateKey, now);

    // Cleanup old rate limit entries periodically
    if (recentVisits.size > 5000) {
      for (const [k, ts] of recentVisits) {
        if ((now - ts) > RATE_LIMIT_WINDOW) recentVisits.delete(k);
      }
    }

    // Extract IP from common proxy headers
    const cfIp = req.headers.get('cf-connecting-ip');
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = (cfIp || (forwarded ? forwarded.split(',')[0].trim() : realIp) || '').replace(/^::ffff:/, '');

    // Parse user agent for device, browser, OS
    const ua = req.headers.get('user-agent') || '';
    const isTablet = /iPad|Tablet|PlayBook|Silk/.test(ua);
    const isMobile = /Mobile|Android|iPhone|iPod/.test(ua) && !isTablet;
    const device_type = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';
    const browser = /Edg\//.test(ua) ? 'Edge'
      : /OPR\//.test(ua) ? 'Opera'
      : /Chrome\//.test(ua) && !/Chromium/.test(ua) ? 'Chrome'
      : /Firefox\//.test(ua) ? 'Firefox'
      : /Safari\//.test(ua) ? 'Safari'
      : 'Other';
    const os = /Windows NT/.test(ua) ? 'Windows'
      : /Mac OS X|Macintosh/.test(ua) ? 'macOS'
      : /iPhone|iPad|iPod/.test(ua) ? 'iOS'
      : /Android/.test(ua) ? 'Android'
      : /Linux/.test(ua) ? 'Linux'
      : 'Other';

    // Try to get user email if logged in
    let user_email = '';
    let is_logged_in = false;
    try {
      const user = await base44.auth.me();
      if (user) {
        user_email = user.email || '';
        is_logged_in = true;
      }
    } catch { /* anonymous visitor */ }

    // Geolocate IP with caching — skip private/local IPs
    let city = '', state = '', country = '';
    const isPrivate = !ip || ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.16.');
    if (!isPrivate) {
      const cached = geoCache.get(ip);
      if (cached && (now - cached.ts) < GEO_CACHE_TTL) {
        city = cached.city;
        state = cached.state;
        country = cached.country;
      } else {
        try {
          const geoRes = await fetch(`https://ipwho.is/${ip}`);
          if (geoRes.ok) {
            const geo = await geoRes.json();
            if (geo.success) {
              city = geo.city || '';
              state = geo.region || '';
              country = geo.country || '';
            }
          }
        } catch { /* geolocation failed — still record visit */ }
        geoCache.set(ip, { city, state, country, ts: now });
      }
    }

    await base44.asServiceRole.entities.SiteVisit.create({
      visitor_id: safeVisitorId,
      session_id: safeSessionId,
      page: safePage,
      ip_address: truncate(ip, 50),
      city, state, country,
      device_type,
      browser, os,
      referrer: safeReferrer,
      user_email,
      is_logged_in,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});