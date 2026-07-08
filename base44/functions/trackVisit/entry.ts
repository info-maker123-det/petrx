import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { page, visitor_id, session_id, referrer } = body;

    if (!page || !visitor_id) {
      return Response.json({ error: 'Missing page or visitor_id' }, { status: 400 });
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

    // Geolocate IP (skip private/local IPs)
    let city = '', state = '', country = '';
    const isPrivate = !ip || ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.16.');
    if (!isPrivate) {
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
    }

    await base44.asServiceRole.entities.SiteVisit.create({
      visitor_id,
      session_id: session_id || '',
      page,
      ip_address: ip,
      city, state, country,
      device_type,
      browser, os,
      referrer: referrer || '',
      user_email,
      is_logged_in,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});