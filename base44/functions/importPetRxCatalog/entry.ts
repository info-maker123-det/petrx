import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const asStr = (v) => (Array.isArray(v) ? v.join(', ') : v == null ? '' : String(v));

function stripHtml(html) {
  if (html == null) return '';
  return String(html)
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function deriveCategory(tags, title) {
  const t = asStr(tags).toLowerCase();
  const ttl = asStr(title).toLowerCase();
  if (t.includes('flea') || t.includes('tick')) {
    return t.includes('heartworm') ? 'Flea, Tick & Heartworm' : 'Flea & Tick';
  }
  if (t.includes('heartworm')) return 'Flea, Tick & Heartworm';
  if (t.includes('heart') || ttl.includes('heart')) return 'Heart Health';
  if (t.includes('allergy') || t.includes('itch') || ttl.includes('apoquel')) return 'Allergy Relief';
  if (t.includes('joint') || t.includes('hip') || ttl.includes('joint')) return 'Joint & Pain';
  if (t.includes('pain') || t.includes('nsaid') || ttl.includes('carprofen') || ttl.includes('galliprant')) return 'Pain & Inflammation';
  if (t.includes('dental') || t.includes('teeth')) return 'Dental';
  if (t.includes('eye') || t.includes('ophthalm') || ttl.includes('eye')) return 'Eye & Ear';
  if (t.includes('ear') || ttl.includes('ear')) return 'Eye & Ear';
  if (t.includes('behavior') || t.includes('anxiety') || t.includes('calm') || t.includes('separation')) return 'Behavioral';
  if (t.includes('skin') || t.includes('coat') || t.includes('derm')) return 'Skin & Coat';
  if (t.includes('cleaning') || t.includes('odor')) return 'Cleaning & Odor';
  if (t.includes('thyroid') || t.includes('hormone') || ttl.includes('thyroid') || ttl.includes('insulin')) return 'Thyroid & Hormone';
  if (t.includes('antibiotic') || t.includes('infection')) return 'Antibiotics';
  if (t.includes('stomach') || t.includes('digest') || t.includes('gastro')) return 'Digestive Health';
  if (t.includes('vitamin') || t.includes('supplement') || t.includes('hip-joint')) return 'Supplements';
  if (t.includes('rxmed') || t.includes('pharmacy')) return 'Prescription';
  return 'Supplements';
}

function derivePetType(tags) {
  const t = asStr(tags).toLowerCase();
  const hasDog = t.includes('dog');
  const hasCat = t.includes('cat');
  const hasHorse = t.includes('horse');
  if (hasDog && hasCat) return 'all';
  if (hasDog) return 'dog';
  if (hasCat) return 'cat';
  if (hasHorse) return 'horse';
  return 'all';
}

const FEATURED_KEYS = ['vetmedin', 'apoquel', 'nexgard', 'carprofen', 'galliprant', 'simparica-trio', 'trifexis', 'simparica-chewable', 'dasuquin', 'clavamox', 'gabapentin'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

    // Fetch all pages from petrx.com Shopify catalog
    let allProducts = [];
    let debug = '';
    for (let page = 1; page <= 5; page++) {
      const res = await fetch(`https://petrx.com/products.json?limit=250&page=${page}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
      });
      if (!res.ok) {
        debug += `page ${page} status ${res.status}; `;
        break;
      }
      const data = await res.json();
      const products = data.products || [];
      if (products.length === 0) {
        debug += `page ${page} empty; `;
        break;
      }
      allProducts = allProducts.concat(products);
      debug += `page ${page}: ${products.length}; `;
    }

    // Skip non-medication products (food, treats, cleaning supplies, lint rollers, area sprays)
    const isNonMedication = (p) => {
      const tags = asStr(p.tags).toLowerCase();
      const title = asStr(p.title).toLowerCase();
      const vendor = asStr(p.vendor).toLowerCase();
      if (vendor.includes('blue natural') && vendor.includes('diet')) return true;
      if (tags.includes('cleaning') || tags.includes('odor')) return true;
      if (title.includes('treats') || title.includes('easy treat') || title.includes('pro-treat') || title.includes('rewards')) return true;
      if (title.includes('area treatment') || title.includes('area spray')) return true;
      if (title.includes('lint roller') || title.includes('hair roller')) return true;
      if (title.includes('stain remover') || title.includes('odor eliminator') || title.includes('disinfectant')) return true;
      if (title.includes('food') && (title.includes('dry') || title.includes('canned'))) return true;
      return false;
    };

    // Map to Product entity schema
    const mapped = allProducts
      .filter((p) => !isNonMedication(p))
      .map((p) => {
        const tags = asStr(p.tags);
        const variants = p.variants || [];
        const prices = variants
          .map((v) => parseFloat(v.price))
          .filter((pr) => !isNaN(pr) && pr > 0);
        const minPrice = prices.length ? Math.min(...prices) : 0;
        const maxPrice = prices.length ? Math.max(...prices) : 0;
        if (minPrice === 0) return null;

        const priceRange =
          minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`;

        const desc = stripHtml(p.body_html).slice(0, 800);
        const imageUrl = p.images && p.images.length > 0 ? p.images[0].src : '';
        const requiresRx = tags.toLowerCase().includes('rxmed') || tags.toLowerCase().includes('petrx pharmacy');
        const handleLower = asStr(p.handle).toLowerCase();
        const featured = FEATURED_KEYS.some((k) => handleLower.includes(k));

        return {
          name: asStr(p.title).slice(0, 200),
          slug: asStr(p.handle),
          brand: asStr(p.vendor),
          description: desc,
          category: deriveCategory(tags, p.title),
          pet_type: derivePetType(tags),
          price: minPrice,
          price_range: priceRange,
          requires_prescription: requiresRx,
          active_ingredient: '',
          dosage_type: '',
          weight_class: '',
          image_url: imageUrl,
          rating: 4.5,
          review_count: 0,
          in_stock: variants[0] ? variants[0].available !== false : true,
          autoship_eligible: true,
          featured,
        };
      })
      .filter(Boolean);

    // Clear existing products
    await base44.asServiceRole.entities.Product.deleteMany({});

    // Bulk create in batches of 100
    let created = 0;
    for (let i = 0; i < mapped.length; i += 100) {
      const batch = mapped.slice(i, i + 100);
      const result = await base44.asServiceRole.entities.Product.bulkCreate(batch);
      created += Array.isArray(result) ? result.length : 0;
    }

    return Response.json({
      status: 'success',
      fetched: allProducts.length,
      imported: created,
      featured: mapped.filter((m) => m.featured).length,
      debug,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});