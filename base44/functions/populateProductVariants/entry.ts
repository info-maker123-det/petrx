import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const limit = body.limit || 50;
    const skip = body.skip || 0;
    const force = body.force === true;

    const allProducts = await base44.asServiceRole.entities.Product.list('-created_date', 1000);

    const toProcess = allProducts
      .filter((p) => p.slug && (force || !p.variants || p.variants.length === 0))
      .slice(skip, skip + limit);

    let updated = 0;
    let skipped = 0;
    const errors = [];

    const updates = [];

    for (const product of toProcess) {
      try {
        const url = `https://petrx.com/products/${product.slug}.json`;
        const resp = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; PetRxAdmin/1.0)',
            'Accept': 'application/json',
          },
        });

        if (!resp.ok) {
          errors.push({ product: product.name, error: `HTTP ${resp.status}` });
          skipped++;
          await new Promise((r) => setTimeout(r, 200));
          continue;
        }

        const data = await resp.json();
        const shopifyVariants = data?.product?.variants || [];

        if (shopifyVariants.length === 0) {
          skipped++;
          continue;
        }

        const variants = shopifyVariants.map((v) => {
          const title = v.title || '';
          const option1 = v.option1 || '';
          const option2 = v.option2 || '';

          let weight_band = 'All weights';
          let supply_months = 0;

          // Weight band: option1 usually contains the weight range
          if (option1 && /lb|kg|weight/i.test(option1)) {
            weight_band = option1;
          } else if (option1 && option1.toLowerCase() !== 'default title') {
            weight_band = option1;
          }

          // Supply months: parse from option2 or title
          const supplyText = `${option2} ${title}`;
          const monthMatch = supplyText.match(/(\d+)\s*month/i);
          if (monthMatch) {
            supply_months = parseInt(monthMatch[1]);
          }

          return {
            weight_band,
            supply_months,
            price: parseFloat(v.price) || 0,
            label: title.replace(/\s*\/\s*/g, ', '),
          };
        });

        // Set base price to the minimum variant price, and build price_range
        const prices = variants.map((v) => v.price).filter((p) => p > 0);
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
        const priceRange = minPrice && maxPrice && minPrice !== maxPrice
          ? `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`
          : minPrice ? `$${minPrice.toFixed(2)}` : null;

        const updateObj = {
          id: product.id,
          variants,
        };
        if (minPrice) updateObj.price = minPrice;
        if (priceRange) updateObj.price_range = priceRange;

        updates.push(updateObj);
        updated++;

        await new Promise((r) => setTimeout(r, 250));
      } catch (e) {
        errors.push({ product: product.name, error: e.message });
        skipped++;
      }
    }

    if (updates.length > 0) {
      await base44.asServiceRole.entities.Product.bulkUpdate(updates);
    }

    const totalWithSlug = allProducts.filter((p) => p.slug && (force || !p.variants || p.variants.length === 0)).length;

    return Response.json({
      status: 'success',
      totalProducts: allProducts.length,
      totalWithSlug,
      skip,
      processed: toProcess.length,
      updated,
      skipped,
      remaining: Math.max(0, totalWithSlug - skip - toProcess.length),
      errors: errors.slice(0, 10),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});