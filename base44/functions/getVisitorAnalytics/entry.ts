import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const visits = await base44.asServiceRole.entities.SiteVisit.list('-created_date', 1000);
    const list = visits || [];

    const now = Date.now();
    const fiveMinAgo = now - 5 * 60 * 1000;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayMs = todayStart.getTime();

    const activeVisits = list.filter(v => v.created_date && new Date(v.created_date).getTime() >= fiveMinAgo);
    const todayVisits = list.filter(v => v.created_date && new Date(v.created_date).getTime() >= todayMs);

    const activeIds = new Set(activeVisits.map(v => v.visitor_id));
    const allIds = new Set(list.map(v => v.visitor_id));
    const loggedInIds = new Set(list.filter(v => v.is_logged_in).map(v => v.visitor_id));

    // Top locations
    const locMap = {};
    list.forEach(v => {
      const parts = [v.city, v.state || v.country].filter(Boolean);
      if (parts.length > 0) {
        const key = parts.join(', ');
        locMap[key] = (locMap[key] || 0) + 1;
      }
    });
    const topLocations = Object.entries(locMap)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Device breakdown
    const devMap = {};
    list.forEach(v => { const d = v.device_type || 'unknown'; devMap[d] = (devMap[d] || 0) + 1; });

    // Browser breakdown
    const brMap = {};
    list.forEach(v => { const b = v.browser || 'Other'; brMap[b] = (brMap[b] || 0) + 1; });

    // Recent visitors (last 8)
    const recentVisitors = list.slice(0, 8).map(v => ({
      city: v.city || '',
      state: v.state || '',
      country: v.country || '',
      device_type: v.device_type || 'desktop',
      browser: v.browser || '',
      page: v.page || '',
      is_logged_in: !!v.is_logged_in,
      user_email: v.user_email || '',
      created_date: v.created_date || '',
    }));

    return Response.json({
      activeNow: activeIds.size,
      visitsToday: todayVisits.length,
      totalVisitors: allIds.size,
      loggedInVisitors: loggedInIds.size,
      topLocations,
      deviceBreakdown: devMap,
      browserBreakdown: brMap,
      recentVisitors,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});