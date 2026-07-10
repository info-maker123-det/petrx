import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Auth is optional — guests can order supplements
    let user = null;
    try {
      user = await base44.auth.me();
    } catch {
      user = null;
    }

    const body = await req.json();
    const { items, shipping } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'No items in order' }, { status: 400 });
    }

    if (!shipping || !shipping.shipping_name || !shipping.shipping_address ||
        !shipping.shipping_city || !shipping.shipping_state || !shipping.shipping_zip || !shipping.shipping_phone) {
      return Response.json({ error: 'Missing shipping fields' }, { status: 400 });
    }

    // Fetch authoritative product data for each cart item — never trust client prices
    const verifiedItems = [];
    let subtotal = 0;
    let hasPrescriptionItems = false;

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return Response.json({ error: 'Invalid cart item' }, { status: 400 });
      }
      const product = await base44.asServiceRole.entities.Product.get(item.productId);
      if (!product) {
        return Response.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      const unitPrice = product.price;
      const autoship = !!item.autoship;
      const lineTotal = unitPrice * item.quantity * (autoship ? 0.95 : 1);
      subtotal += lineTotal;

      if (product.requires_prescription) hasPrescriptionItems = true;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        brand: product.brand || '',
        price: unitPrice,
        image_url: product.image_url || '',
        requires_prescription: !!product.requires_prescription,
        quantity: item.quantity,
        autoship,
      });
    }

    // Guests cannot purchase prescription items
    if (!user && hasPrescriptionItems) {
      return Response.json({ error: 'Prescription items require authentication' }, { status: 403 });
    }

    const shippingCost = subtotal >= 49 ? 0 : 5.95;
    const total = subtotal + shippingCost;

    const order_number = 'PRX-' + Date.now().toString().slice(-8);
    // Use service role for guest orders, user-scoped for authenticated users
    const orderClient = user ? base44.entities.Order : base44.asServiceRole.entities.Order;
    const order = await orderClient.create({
      order_number,
      items: verifiedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      shipping_cost: shippingCost,
      total: Math.round(total * 100) / 100,
      shipping_name: shipping.shipping_name,
      shipping_address: shipping.shipping_address,
      shipping_city: shipping.shipping_city,
      shipping_state: shipping.shipping_state,
      shipping_zip: shipping.shipping_zip,
      shipping_phone: shipping.shipping_phone,
      has_prescription_items: hasPrescriptionItems,
      status: 'pending',
      payment_status: 'pending',
    });

    return Response.json(order);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});