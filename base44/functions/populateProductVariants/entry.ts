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

    const needsUpdate = (p) => {
      if (!p.slug) return false;
      if (force) return true;
      if (!p.variants || p.variants.length === 0) return true;
      // Re-process products not yet migrated to the new option-based format
      return !p.option1_name;
    };

    const toProcess = allProducts
      .filter(needsUpdate)
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
        const shopifyProduct = data?.product || {};
        const shopifyVariants = shopifyProduct.variants || [];
        const shopifyOptions = shopifyProduct.options || [];

        if (shopifyVariants.length === 0) {
          skipped++;
          continue;
        }

        // Read option names directly from Shopify's options array
        const option1Name = shopifyOptions[0]?.name || 'Size';
        const option2Name = shopifyOptions.length > 1 ? shopifyOptions[1]?.name : null;

        // Map variants using raw Shopify option values — no assumptions about weight vs strength
        const variants = shopifyVariants.map((v) => {
          const title = v.title || '';
          const rawOpt1 = v.option1 || '';
          const rawOpt2 = v.option2 || '';

          // Filter out Shopify's "Default Title" placeholder for single-option products
          const option1 = rawOpt1 && rawOpt1.toLowerCase() !== 'default title' ? rawOpt1 : '';
          const option2 = rawOpt2 && rawOpt2.toLowerCase() !== 'default title' ? rawOpt2 : '';

          return {
            option1,
            option2,
            price: parseFloat(v.price) || 0,
            label: title.replace(/\s*\/\s*/g, ', '),
          };
        });

        const prices = variants.map((v) => v.price).filter((p) => p > 0);
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
        const priceRange = minPrice && maxPrice && minPrice !== maxPrice
          ? `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`
          : minPrice ? `$${minPrice.toFixed(2)}` : null;

        const updateObj = {
          id: product.id,
          variants,
          option1_name: option1Name,
          option2_name: option2Name,
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

    const totalWithSlug = allProducts.filter(needsUpdate).length;

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