import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const CITIES = [
  "Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno",
  "Sacramento", "Long Beach", "Oakland", "Bakersfield", "Anaheim",
  "Santa Ana", "Riverside", "Stockton", "Irvine", "Chula Vista",
  "Fremont", "San Bernardino", "Modesto", "Oxnard", "Fontana",
  "Moreno Valley", "Huntington Beach", "Glendale", "Santa Clarita",
  "Garden Grove", "Oceanside", "Rancho Cucamonga", "Ontario", "Santa Rosa",
  "Elk Grove", "Corona", "Lancaster", "Palmdale", "Salinas",
  "Pasadena", "Hayward", "Pomona", "Escondido", "Torrance",
  "Sunnyvale", "Orange", "Fullerton", "Pasadena", "Thousand Oaks",
  "Vallejo", "Concord", "Simi Valley", "Berkeley", "Downey",
  "Costa Mesa", "Inglewood", "Ventura", "Carlsbad", "Fairfield",
  "West Covina", "Murrieta", "Richmond", "Norwalk", "Antioch",
  "Daly City", "Temecula", "Clovis", "Roseville", "Santa Maria",
  "San Mateo", "Walnut Creek", "Pleasanton", "Mountain View", "Alameda",
  "Redwood City", "Napa", "San Luis Obispo", "Monterey", "Redding",
  "Eureka", "Santa Barbara", "Burbank", "Culver City", "Glendale",
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

    const batchSize = 4;
    let totalAdded = 0;
    let citiesDone = 0;
    const errors = [];

    for (let i = 0; i < CITIES.length; i += batchSize) {
      const batch = CITIES.slice(i, i + batchSize);

      const prompt = `You are a veterinary directory expert. For each California city listed below, search the web and return a comprehensive list of veterinary clinics located in or near that city. For each clinic, provide accurate, real contact information.

Cities: ${batch.join(", ")}

For EACH clinic, return:
- clinic_name: The full name of the veterinary clinic/hospital (e.g. "Blue Pearl Pet Hospital")
- vet_name: The name of a primary veterinarian at the clinic if known, otherwise "Not listed"
- address: The full street address
- city: The city (must be one of the cities listed above or a neighboring city)
- state: "CA"
- zip: The 5-digit zip code
- phone: The phone number in format (XXX) XXX-XXXX
- email: The clinic's email if publicly available, otherwise ""
- website: The clinic's website URL if available, otherwise ""

Rules:
- Return ONLY real veterinary clinics with real addresses. Do not invent or fabricate clinics.
- Aim for 8-15 clinics per city depending on availability.
- Each clinic must have at least a clinic_name, address, city, and phone.
- Return results as a flat array of clinics across all cities in this batch.`;

      try {
        const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt,
          add_context_from_internet: true,
          model: "gemini_3_flash",
          response_json_schema: {
            type: 'object',
            properties: {
              clinics: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    clinic_name: { type: 'string' },
                    vet_name: { type: 'string' },
                    address: { type: 'string' },
                    city: { type: 'string' },
                    state: { type: 'string' },
                    zip: { type: 'string' },
                    phone: { type: 'string' },
                    email: { type: 'string' },
                    website: { type: 'string' },
                  },
                  required: ['clinic_name', 'address', 'city', 'state', 'phone'],
                },
              },
            },
            required: ['clinics'],
          },
        });

        const clinics = (llmRes?.clinics || []).filter(
          (c) => c.clinic_name && c.address && c.city
        );

        if (clinics.length > 0) {
          const records = clinics.map((c) => ({
            clinic_name: String(c.clinic_name).slice(0, 200),
            vet_name: c.vet_name ? String(c.vet_name).slice(0, 200) : "",
            address: String(c.address).slice(0, 300),
            city: String(c.city).slice(0, 100),
            state: "CA",
            zip: c.zip ? String(c.zip).slice(0, 10) : "",
            phone: c.phone ? String(c.phone).slice(0, 30) : "",
            email: c.email ? String(c.email).slice(0, 200) : "",
            website: c.website ? String(c.website).slice(0, 300) : "",
          }));
          await base44.asServiceRole.entities.Vet.bulkCreate(records);
          totalAdded += records.length;
        }
        citiesDone += batch.length;
      } catch (err) {
        errors.push({ batch, error: err.message });
      }
    }

    return Response.json({
      status: 'success',
      citiesProcessed: citiesDone,
      totalVetsAdded: totalAdded,
      errors,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});