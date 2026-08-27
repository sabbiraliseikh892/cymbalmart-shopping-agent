import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy/safe initialization for Gemini
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY' || apiKey.startsWith('MY_')) {
    return null;
  }
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
      return null;
    }
  }
  return aiClient;
}

// Fallback intelligent customer assistant response generator
function generateAssistantFallbackReply(userQuery: string, currentPlan: any): string {
  const q = (userQuery || '').toLowerCase();

  // Store Hours & Curbside Pickup
  if (q.includes('hour') || q.includes('open') || q.includes('time') || q.includes('close') || q.includes('pickup') || q.includes('curbside') || q.includes('delivery')) {
    return `🏪 **CymbalMart Store Hours & Fulfillment Options:**\n\n` +
      `• **Store Hours:** Open Daily from **6:00 AM – 11:00 PM**\n` +
      `• **Pharmacy Hours:** Monday – Saturday 8:00 AM – 8:00 PM (Sunday 10:00 AM – 6:00 PM)\n` +
      `• **Curbside Pickup:** FREE on all orders $35+! Reserved pickup bays 1–12 are located on the North side of the parking lot. Express 1-hour rush pickup is also available at checkout.\n` +
      `• **Same-Day Delivery:** We offer 2-hour scheduled delivery windows straight to your door with temperature-controlled chill packaging.\n\n` +
      `Would you like me to help you stage a pickup order for your current shopping list?`;
  }

  // Aisle Finder & Item Locations
  if (q.includes('aisle') || q.includes('where') || q.includes('locate') || q.includes('find') || q.includes('department')) {
    return `📍 **CymbalMart Supercenter Aisle Directory:**\n\n` +
      `• **Aisle 1–2 (Fresh Produce & Herbs):** Organic limes, lemons, avocados, salad greens, fresh salsa ingredients, and fruit platters.\n` +
      `• **Aisle 3–4 (Artisan Bakery & Gourmet Deli):** Party slider buns, baguettes, pretzel bites, charcuterie cheeses, and deli sandwich trays.\n` +
      `• **Aisle 5 (Cymbal Choice Meats & Seafood):** USDA Choice burgers, hot dogs, marinated carnitas, chicken wings, and shrimp rings.\n` +
      `• **Aisle 6–7 (Party Pantry & Chips):** Tortilla chips, potato crisps, gourmet dips, salsa, and bulk pretzels.\n` +
      `• **Aisle 8–9 (Beverages, Seltzers & Bar):** Craft sodas, sparkling seltzers, cocktail mixers, juices, and wine/beer.\n` +
      `• **Aisle 10 (Dairy & Chilled Specialties):** Artisan cheese blocks, sour cream, guacamole, shredded cheddar, and butter.\n` +
      `• **Aisle 11–12 (Party Supplies & Tableware):** Eco-friendly compostable plates, party cups, cutlery, festive napkins, and balloons.\n` +
      `• **Aisle 13–14 (Cleanup, Essentials & Ice):** Heavy-duty trash bags, paper towels, and 10 lb party ice bags.\n\n` +
      `Which item would you like me to look up for you?`;
  }

  // Cymbal Brand Swaps & Savings
  if (q.includes('brand') || q.includes('save') || q.includes('swap') || q.includes('discount') || q.includes('deal') || q.includes('value')) {
    return `💰 **Cymbal Everyday Value Brand Deals & Swaps:**\n\n` +
      `Switching from national brands to **Cymbal Everyday Value** guarantees **20% to 30% savings** with the exact same premium quality:\n\n` +
      `1. **Cymbal Cantina Tortilla Chips (18 oz)**: $2.89 *(vs $4.99 national brand)* — **Save $2.10/bag**\n` +
      `2. **Cymbal Sparkling Citrus Seltzers (12-pack)**: $3.99 *(vs $6.49 national brand)* — **Save $2.50/pack**\n` +
      `3. **Cymbal Choice Boneless Pork & Poultry (Family Pack)**: $3.49/lb *(vs $5.29/lb premium cut)* — **Save ~35%**\n` +
      `4. **Cymbal Eco-Fiber Heavy Duty Plates (50 ct)**: $4.99 *(vs $7.99 name brand)* — **Save $3.00**\n\n` +
      `💡 *Tip: You can click "Swap All to Cymbal Brand" in your shopping list to instantly apply these discounts!*`;
  }

  // Dietary, Vegan & Allergy
  if (q.includes('vegan') || q.includes('gluten') || q.includes('diet') || q.includes('allergy') || q.includes('vegetarian') || q.includes('dairy')) {
    return `🥑 **Allergen & Dietary Recommendations at CymbalMart:**\n\n` +
      `• **Gluten-Free:** Look for our certified yellow-tagged items in Aisle 1 (Corn Tortillas, Fresh Crudités) and Aisle 6 (Gluten-Free Rice Crisps).\n` +
      `• **Plant-Based / Vegan:** Fresh house-made Guacamole (Aisle 1), Organic Hummus Trio (Aisle 4 Deli), and Cymbal Plant-Based Burger Patties (Aisle 5).\n` +
      `• **Dairy-Free:** Almond & Oat milk creamers (Aisle 10) and Vegan Cashew Queso (Aisle 4 Deli).\n` +
      `• **Nut-Free:** Our Artisan Bakery in Aisle 3 has dedicated nut-free cupcake and cookie packs labeled with green seals.\n\n` +
      `Would you like me to tag your current list items with these dietary filters?`;
  }

  // Budget Optimization
  if (q.includes('budget') || q.includes('cost') || q.includes('align') || q.includes('cheap') || q.includes('price')) {
    const budget = currentPlan?.budget || 350;
    return `📊 **Party Budget Optimization Strategy:**\n\n` +
      `For your target budget of **$${budget}**:\n\n` +
      `1. **Focus on bulk base ingredients** (e.g. Carnitas, Taco Bar, Burger Sliders) located in Aisle 5.\n` +
      `2. **Batch signature drinks**: Instead of individual craft cans, make a 2-gallon punch dispenser with Cymbal Sparkling Citrus + Fruit Juices from Aisle 8.\n` +
      `3. **Swap to Cymbal Store Brand**: Save an instant ~22% on snacks, paper plates, and napkins.\n` +
      `4. **Ice & Chill**: Buy 10 lb ice bags from Aisle 14 ($2.49 each) rather than high-markup party coolers.\n\n` +
      `I can also run the **Auto-Align Budget** tool for you directly on your shopping list!`;
  }

  // Contextual party plan query
  if (currentPlan) {
    return `🎉 **CymbalMart Assistant here to help with "${currentPlan.title}"!**\n\n` +
      `• **Budget Status:** Target budget is **$${currentPlan.budget}** for **${currentPlan.totalGuests} guests** (${currentPlan.adultCount} adults, ${currentPlan.kidCount} kids).\n` +
      `• **Current List:** You have ${currentPlan.shoppingList?.length || 0} items organized across CymbalMart departments.\n\n` +
      `I can assist you with:\n` +
      `1. Finding exact aisle locations for your ingredients (Produce, Deli, Meats, Bar, Tableware)\n` +
      `2. Finding Cymbal Everyday Value store brand swaps to save 20-30%\n` +
      `3. Calculating beverage and ice volumes (${Math.round(currentPlan.totalGuests * 1.5)} lbs of ice recommended)\n` +
      `4. Setting up express Curbside Pickup or Delivery for your party date!\n\n` +
      `What would you like to explore?`;
  }

  // Default friendly greeting
  return `👋 **Hello! Welcome to CymbalMart.**\n\n` +
    `I'm your **CymbalMart Assistant**, here to make your grocery shopping and event planning seamless.\n\n` +
    `Here's what I can do for you today:\n` +
    `• 📍 **Aisle Locator:** Ask where any item is in the store (Aisles 1–14)\n` +
    `• 💰 **Store Brand Savings:** Find Cymbal Everyday Value alternatives to trim 20–30% off your cart\n` +
    `• 🥗 **Specialty Diet Guidance:** Vegan, gluten-free, and allergen-safe recommendations\n` +
    `• 📦 **Store Services:** Information on Curbside Pickup bays, Same-Day Delivery, and Hassle-free Returns\n` +
    `• 🎉 **Party & Catering Planning:** Tailored grocery lists and portion calculations for any guest count\n\n` +
    `How may I assist your shopping trip today?`;
}

// Fallback auto align budget algorithm
function autoAlignBudgetFallback(shoppingList: any[], targetBudget: number): any {
  const currentTotal = shoppingList.reduce((sum: number, item: any) => sum + (Number(item.estimatedCost) || 0), 0);
  const diff = currentTotal - targetBudget;

  let runningTotal = 0;
  const alignedShoppingList = shoppingList.map((item: any) => {
    let cost = Number(item.estimatedCost) || 0;
    let isStoreBrand = item.isStoreBrand;
    let notes = item.notes || '';

    if (diff > 0) {
      if (!isStoreBrand) {
        isStoreBrand = true;
        const orig = item.originalEstimatedCost || cost;
        cost = Math.max(1, Math.round(orig * 0.78));
        notes = (notes ? notes + ' • ' : '') + 'Swapped to Cymbal Everyday Value (22% savings)';
      } else if (item.priority === 'nice_to_have' || item.priority === 'optional') {
        cost = Math.max(1, Math.round(cost * 0.85));
        notes = (notes ? notes + ' • ' : '') + 'Optimized quantity';
      }
    }
    runningTotal += cost;
    return {
      ...item,
      estimatedCost: cost,
      isStoreBrand,
      notes,
    };
  });

  return {
    summaryOfChanges: diff > 0
      ? `Applied Cymbal Everyday Value store brand substitutions and portion optimization to save $${Math.max(0, currentTotal - runningTotal)} and align with your $${targetBudget} budget.`
      : 'Your shopping list is already within your target budget! Recommending standard CymbalMart store brands for maximum value.',
    newTotalEstimatedCost: runningTotal,
    alignedShoppingList,
  };
}

// Fallback shopping optimization tips
function optimizeShoppingFallback(shoppingList: any[], budget: number, goal: string): string {
  return `🛒 **CymbalMart Smart Shopping Recommendations:**\n\n` +
    `1. **Cymbal Everyday Value Brand Conversions:** Swapping brand-name snacks, beverages, and paper supplies to CymbalMart store brands saves an estimated 20–30% with no loss in freshness or taste.\n` +
    `2. **Batch Beverage Stations in Aisle 8:** Dispenser-batched punches using Cymbal Seltzers and 100% fruit juices are 40% cheaper per serving than individual single-serve cans.\n` +
    `3. **Deli & Bakery Family Trays in Aisle 3–4:** Prepared slider buns and artisan charcuterie trays reduce host kitchen prep time from 2 hours down to 15 minutes.\n` +
    `4. **Curbside Pickup Bay Scheduling:** Reserve Curbside Pickup Bay 1–12 24 hours in advance to have our store team chill and pack your items for immediate loading.`;
}

// Fallback party plan generator
function generateFallbackPartyPlan(body: any): any {
  const {
    occasion = 'Celebration Gathering',
    theme = 'Festive Party',
    adultCount = 15,
    kidCount = 0,
    durationHours = 3.5,
    budget = 300,
    venueType = 'home',
    dietaryRestrictions = [],
    vibe = 'casual & lively',
    customNotes = '',
  } = body;

  const totalGuests = (Number(adultCount) || 0) + (Number(kidCount) || 0);
  const planId = 'party-' + Date.now();

  const shoppingList = [
    {
      id: `item-${Date.now()}-1`,
      name: 'Cymbal Choice Seasoned Meats & Slider Buns Combo',
      category: 'food',
      department: 'Meat & Seafood',
      aisle: 'Aisle 5 - Cymbal Choice Meats',
      quantity: Math.max(4, Math.round(totalGuests * 0.4)),
      unit: 'lbs',
      estimatedCost: Math.round(budget * 0.28),
      isPurchased: false,
      storeRecommendation: 'CymbalMart Supercenter',
      isStoreBrand: true,
      priority: 'must_have',
      notes: 'Freshly seasoned, great for crowd-pleasing mains',
    },
    {
      id: `item-${Date.now()}-2`,
      name: 'Cymbal Cantina Tortilla Chips & Gourmet Dips Trio',
      category: 'food',
      department: 'Produce',
      aisle: 'Aisle 1 - Fresh Produce & Salsa Bar',
      quantity: Math.max(3, Math.round(totalGuests * 0.25)),
      unit: 'packs',
      estimatedCost: Math.round(budget * 0.14),
      isPurchased: false,
      storeRecommendation: 'CymbalMart Supercenter',
      isStoreBrand: true,
      priority: 'must_have',
      notes: 'Fresh avocado guacamole, pico de gallo, and salsa verde',
    },
    {
      id: `item-${Date.now()}-3`,
      name: 'Cymbal Gourmet Deli Artisan Cheese & Charcuterie Platter',
      category: 'food',
      department: 'Bakery & Deli',
      aisle: 'Aisle 4 - Gourmet Deli',
      quantity: Math.max(2, Math.round(totalGuests * 0.15)),
      unit: 'platters',
      estimatedCost: Math.round(budget * 0.18),
      isPurchased: false,
      storeRecommendation: 'CymbalMart Supercenter',
      isStoreBrand: false,
      priority: 'nice_to_have',
      notes: 'Ready-to-serve cured meats, aged cheddar, grapes, and crackers',
    },
    {
      id: `item-${Date.now()}-4`,
      name: 'Cymbal Sparkling Seltzers & Craft Sodas (Variety 24-pk)',
      category: 'drinks',
      department: 'Beverages & Bar',
      aisle: 'Aisle 8 - Craft Beverages & Seltzers',
      quantity: Math.max(2, Math.round(totalGuests * 0.2)),
      unit: 'packs',
      estimatedCost: Math.round(budget * 0.12),
      isPurchased: false,
      storeRecommendation: 'CymbalMart Supercenter',
      isStoreBrand: true,
      priority: 'must_have',
      notes: 'Zero sugar sparkling citrus, berry, and classic lime',
    },
    {
      id: `item-${Date.now()}-5`,
      name: 'CymbalMart Party Ice (10 lb bags)',
      category: 'drinks',
      department: 'Cleanup & Essentials',
      aisle: 'Aisle 14 - Party Ice Cooler',
      quantity: Math.max(2, Math.round((totalGuests * 1.5) / 10)),
      unit: 'bags',
      estimatedCost: Math.max(5, Math.round(totalGuests * 0.3)),
      isPurchased: false,
      storeRecommendation: 'CymbalMart Supercenter',
      isStoreBrand: true,
      priority: 'must_have',
      notes: 'For drink chilling tubs and serving dispensers',
    },
    {
      id: `item-${Date.now()}-6`,
      name: 'Cymbal Eco-Fiber Compostable Plates, Cups & Cutlery Pack',
      category: 'tableware',
      department: 'Party Supplies & Tableware',
      aisle: 'Aisle 11 - Eco Tableware & Napkins',
      quantity: Math.max(1, Math.round(totalGuests / 15)),
      unit: 'bundle',
      estimatedCost: Math.round(budget * 0.08),
      isPurchased: false,
      storeRecommendation: 'CymbalMart Supercenter',
      isStoreBrand: true,
      priority: 'must_have',
      notes: '100% biodegradable heavy-duty tableware',
    },
    {
      id: `item-${Date.now()}-7`,
      name: 'Festive Balloon Garland & Theme Banner Set',
      category: 'decor',
      department: 'Party Supplies & Tableware',
      aisle: 'Aisle 12 - Party Decor & Balloons',
      quantity: 1,
      unit: 'kit',
      estimatedCost: Math.round(budget * 0.09),
      isPurchased: false,
      storeRecommendation: 'CymbalMart Supercenter',
      isStoreBrand: false,
      priority: 'nice_to_have',
      notes: `Vibrant decor accents matching ${theme} theme`,
    },
  ];

  return {
    id: planId,
    title: `${occasion} (${theme})`,
    theme,
    occasion,
    adultCount: Number(adultCount) || 0,
    kidCount: Number(kidCount) || 0,
    totalGuests,
    durationHours: Number(durationHours) || 3.5,
    budget: Number(budget) || 300,
    venueType,
    dietaryRestrictions,
    vibe,
    specialRequests: customNotes,
    drinkFoodCalculations: {
      drinksTotal: Math.round(totalGuests * (Number(durationHours) || 3.5) * 1.3),
      icePounds: Math.round(totalGuests * 1.5),
      mainServings: Math.round(totalGuests * 1.2),
      appetizerPieces: totalGuests * 4,
      dessertServings: totalGuests,
      platesCupsCount: Math.round(totalGuests * 2.2),
    },
    tips: [
      'Order party goods and dry pantry goods 3 days prior via CymbalMart Curbside Pickup to avoid weekend lines.',
      'Batch-prepare signature mocktails or punch in 2-gallon drink dispensers with fresh fruit slices from Aisle 1.',
      'Set up food in two identical buffet stations to prevent guest bottlenecks during peak dining.',
      'Keep 2 bags of ice reserved in a secondary insulated cooler strictly for drink glassware, keeping the beverage tub separate.',
    ],
    recipesOrCocktails: [
      {
        name: `Cymbal Signature ${theme} Spritz`,
        description: 'Refreshing sparkling beverage with citrus, mint, and craft soda.',
        ingredients: [
          'Cymbal Sparkling Lime Seltzer (2 packs)',
          'Fresh Lime Juice & Mint Leaves (Aisle 1)',
          'Organic Agave Nectar',
          'Fresh Cranberry or Pomegranate Splash',
        ],
      },
      {
        name: 'Gourmet Grazing & Slider Buffet',
        description: 'Tender seasoned sliders served with artisan cheeses and crisp toppings.',
        ingredients: [
          'Cymbal Choice Slider Patties (Aisle 5)',
          'Brioche Slider Buns (Aisle 3 Bakery)',
          'Aged Cheddar & Swiss Slices (Aisle 10)',
          'House Gourmet Dip & Pickle Relish',
        ],
      },
    ],
    timeline: [
      {
        id: `t-${Date.now()}-1`,
        timeframe: '1_week_prior',
        task: 'Confirm RSVP guest count and reserve CymbalMart party decor and tableware in Aisle 11',
        completed: true,
        category: 'shopping',
      },
      {
        id: `t-${Date.now()}-2`,
        timeframe: '3_days_prior',
        task: 'Place CymbalMart Curbside Pickup order for non-perishables, chips, sodas, and paper goods',
        completed: false,
        category: 'shopping',
      },
      {
        id: `t-${Date.now()}-3`,
        timeframe: '1_day_prior',
        task: 'Pick up fresh meats, bakery buns, and produce; prep veggies and chill beverages',
        completed: false,
        category: 'prep',
      },
      {
        id: `t-${Date.now()}-4`,
        timeframe: 'day_of_morning',
        task: 'Pick up 2 bags of party ice from CymbalMart Aisle 14, assemble snack platters, and hang decorations',
        completed: false,
        category: 'setup',
      },
      {
        id: `t-${Date.now()}-5`,
        timeframe: '2_hours_prior',
        task: 'Start heating sliders, mix signature spritz drinks in dispensers, and turn on party playlist',
        completed: false,
        category: 'cooking',
      },
    ],
    shoppingList,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Generate Full Party Plan Endpoint
app.post('/api/party/generate-plan', async (req, res) => {
  try {
    const {
      occasion = 'Birthday Celebration',
      theme = 'Festive & Fun',
      adultCount = 15,
      kidCount = 0,
      durationHours = 3.5,
      budget = 300,
      venueType = 'home',
      dietaryRestrictions = [],
      vibe = 'casual',
      customNotes = '',
    } = req.body;

    const totalGuests = (Number(adultCount) || 0) + (Number(kidCount) || 0);
    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemPrompt = `You are the official CymbalMart Party Planning and Shopping Agent for busy hosts.
Your task is to convert event intent into a comprehensive, realistic, and curated budget-conscious shopping list and event plan.
Always assign items to real CymbalMart departments & store aisles:
- Produce (e.g. Aisle 1 - Fresh Produce & Herbs)
- Bakery & Deli (e.g. Aisle 3 - Artisan Bakery & Pastries, Aisle 4 - Gourmet Deli & Charcuterie)
- Meat & Seafood (e.g. Aisle 5 - Cymbal Choice Meats & Seafood)
- Beverages & Bar (e.g. Aisle 8 - Sparkling & Craft Beverages, Aisle 9 - Wine & Spirits)
- Snacks & Pantry (e.g. Aisle 6 - Chips, Dips & Party Pantry)
- Party Supplies & Tableware (e.g. Aisle 11 - Party Supplies, Tableware & Decor)
- Cleanup & Essentials (e.g. Aisle 14 - Paper Towels, Trash Bags & Chilling Ice)

Portion math & Catering Benchmarks:
- Drinks: ~1.5 drinks per adult per hour; kids ~1 drink/hr (juice/water/punch).
- Ice: 1.5 - 2 lbs per guest (drinks + chilling coolers).
- Main Courses: ~1/2 lb meat/protein per person, or 2 hearty portions.
- Appetizers / Finger foods: 4-6 pieces per person for grazing/cocktail, or 2-3 before meal.
- Dessert: 1 generous slice/piece per guest + 10% buffer.
- Tableware: 1.5x plates, 2x cups, 2.5x napkins per guest.

Item Details:
- Set storeRecommendation to 'CymbalMart Supercenter' (or specialized department/club pack).
- Provide isStoreBrand (true for CymbalMart Everyday Value / Cymbal Select items).
- Provide priority ('must_have', 'nice_to_have', 'optional').
- Provide dietaryTags (e.g., 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Vegan', 'Nut-Free', 'Non-Alcoholic').
- Keep total estimated cost strictly aligned with or under the user's budget ($${budget}).`;

        const userPrompt = `Generate a complete CymbalMart Party Plan and Shopping List for:
Occasion: ${occasion}
Theme: ${theme}
Adults: ${adultCount}, Kids: ${kidCount} (Total Guests: ${totalGuests})
Duration: ${durationHours} hours
Budget: $${budget} USD
Venue: ${venueType}
Dietary Restrictions: ${dietaryRestrictions.length > 0 ? dietaryRestrictions.join(', ') : 'None'}
Vibe / Style: ${vibe}
Special Requests: ${customNotes || 'None'}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Creative name for the party' },
                theme: { type: Type.STRING },
                occasion: { type: Type.STRING },
                vibe: { type: Type.STRING },
                specialRequests: { type: Type.STRING },
                drinkFoodCalculations: {
                  type: Type.OBJECT,
                  properties: {
                    drinksTotal: { type: Type.NUMBER, description: 'Total recommended drink servings' },
                    icePounds: { type: Type.NUMBER, description: 'Estimated lbs of ice needed' },
                    mainServings: { type: Type.NUMBER, description: 'Total main food portions' },
                    appetizerPieces: { type: Type.NUMBER, description: 'Total appetizer pieces' },
                    dessertServings: { type: Type.NUMBER, description: 'Dessert portions' },
                    platesCupsCount: { type: Type.NUMBER, description: 'Plates/cups bundle count' },
                  },
                  required: ['drinksTotal', 'icePounds', 'mainServings', 'appetizerPieces', 'dessertServings', 'platesCupsCount'],
                },
                tips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 to 5 practical host tips and CymbalMart shopping hacks',
                },
                recipesOrCocktails: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      ingredients: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ['name', 'description', 'ingredients'],
                  },
                },
                timeline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      timeframe: {
                        type: Type.STRING,
                        description: 'One of: 2_weeks_prior, 1_week_prior, 3_days_prior, 1_day_prior, day_of_morning, 2_hours_prior',
                      },
                      task: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        description: 'One of: shopping, prep, decor, setup, cooking',
                      },
                    },
                    required: ['timeframe', 'task', 'category'],
                  },
                },
                shoppingList: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        description: 'One of: food, drinks, decor, tableware, favors_games, essentials_cleanup',
                      },
                      department: {
                        type: Type.STRING,
                        description: 'One of: Produce, Bakery & Deli, Meat & Seafood, Beverages & Bar, Snacks & Pantry, Party Supplies & Tableware, Cleanup & Essentials',
                      },
                      aisle: { type: Type.STRING, description: 'e.g. Aisle 1 - Fresh Produce, Aisle 8 - Beverages' },
                      quantity: { type: Type.NUMBER },
                      unit: { type: Type.STRING, description: 'e.g. lbs, bottles, packs, cans, boxes, units' },
                      estimatedCost: { type: Type.NUMBER },
                      originalEstimatedCost: { type: Type.NUMBER },
                      storeRecommendation: { type: Type.STRING },
                      isStoreBrand: { type: Type.BOOLEAN },
                      priority: {
                        type: Type.STRING,
                        description: 'must_have, nice_to_have, or optional',
                      },
                      notes: { type: Type.STRING },
                      dietaryTags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ['name', 'category', 'quantity', 'unit', 'estimatedCost', 'priority'],
                  },
                },
              },
              required: ['title', 'theme', 'occasion', 'vibe', 'drinkFoodCalculations', 'tips', 'timeline', 'shoppingList'],
            },
          },
        });

        const text = response.text || '{}';
        const parsedData = JSON.parse(text);

        // Format IDs and defaults
        const planId = 'party-' + Date.now();
        const formattedShoppingList = (parsedData.shoppingList || []).map((item: any, idx: number) => ({
          ...item,
          id: `item-${Date.now()}-${idx}`,
          isPurchased: false,
          estimatedCost: Number(item.estimatedCost) || 0,
          quantity: Number(item.quantity) || 1,
        }));

        const formattedTimeline = (parsedData.timeline || []).map((t: any, idx: number) => ({
          ...t,
          id: `timeline-${Date.now()}-${idx}`,
          completed: false,
        }));

        const fullPlan = {
          id: planId,
          title: parsedData.title || `${occasion} (${theme})`,
          theme: parsedData.theme || theme,
          occasion: parsedData.occasion || occasion,
          adultCount: Number(adultCount) || 0,
          kidCount: Number(kidCount) || 0,
          totalGuests: totalGuests,
          durationHours: Number(durationHours) || 3,
          budget: Number(budget) || 300,
          venueType,
          dietaryRestrictions,
          vibe: parsedData.vibe || vibe,
          drinkFoodCalculations: parsedData.drinkFoodCalculations || {
            drinksTotal: Math.round(totalGuests * (Number(durationHours) || 3) * 1.2),
            icePounds: Math.round(totalGuests * 1.5),
            mainServings: totalGuests,
            appetizerPieces: totalGuests * 4,
            dessertServings: totalGuests,
            platesCupsCount: totalGuests * 2,
          },
          tips: parsedData.tips || [],
          recipesOrCocktails: parsedData.recipesOrCocktails || [],
          timeline: formattedTimeline,
          shoppingList: formattedShoppingList,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return res.json({ success: true, plan: fullPlan });
      } catch (geminiErr) {
        console.warn('Gemini generate-plan failed, using curated plan generator:', geminiErr);
      }
    }

    // Fallback response if Gemini is unavailable or errors
    const fallbackPlan = generateFallbackPartyPlan(req.body);
    res.json({ success: true, plan: fallbackPlan });
  } catch (error: any) {
    console.error('Error generating party plan:', error);
    const fallbackPlan = generateFallbackPartyPlan(req.body);
    res.json({ success: true, plan: fallbackPlan });
  }
});

// Interactive CymbalMart Assistant Chat Endpoint
app.post(['/api/party/chat', '/api/assistant/chat'], async (req, res) => {
  try {
    const { messages = [], currentPlan, userQuery } = req.body;
    const ai = getGeminiClient();

    let assistantReply = '';

    if (ai) {
      try {
        const systemPrompt = `You are "CymbalMart Assistant", the friendly, knowledgeable, and proactive AI customer assistant for CymbalMart.
Your goal is to provide exceptional customer service, help shoppers navigate store departments & aisles, discover weekly deals & Cymbal Everyday Value brand savings, answer customer service questions, and help hosts plan parties and build budget-aligned grocery lists.

CymbalMart Store Knowledge:
- Operating Hours: Daily 6:00 AM – 11:00 PM (Pharmacy: 8:00 AM – 8:00 PM).
- Curbside Pickup: Free on orders $35+ in designated pickup bays (Bay 1-12). Express 1-hour pickup available.
- Same-Day Delivery: Delivered within a 2-hour window directly to customer doors.
- Cymbal Everyday Value Brand: Guaranteed 20-30% savings vs national brands across dairy, snacks, bakery, and pantry essentials.
- Return Policy: 90-day hassle-free returns on non-perishables; 100% freshness guarantee on fresh produce and meats with receipt or digital account.

Department & Aisle Directory:
- Aisle 1-2: Fresh Produce & Organic Herbs
- Aisle 3-4: Artisan Bakery & Gourmet Deli / Charcuterie
- Aisle 5: Cymbal Choice Meats & Fresh Seafood
- Aisle 6-7: Chips, Pretzels, Salsa & Party Pantry
- Aisle 8-9: Craft Sodas, Sparkling Seltzers, Juices & Spirits
- Aisle 10: Dairy, Artisan Cheeses & Chilled Dips
- Aisle 11-12: Party Supplies, Eco-Tableware, Balloons & Decor
- Aisle 13-14: Cleaning Essentials, Paper Towels & Party Ice Cooler Bags

Current Active Party Plan Context (if any):
${currentPlan ? JSON.stringify(currentPlan, null, 2) : 'Customer is browsing general store offerings.'}

Interaction Guidelines:
1. Warmly identify yourself as "CymbalMart Assistant" when asked or greeting customers.
2. Provide clear, direct answers with specific store department/aisle references and practical price-saving tips.
3. If recommending items, format them clearly with estimated prices and department/aisle tags.
4. Keep the tone courteous, retail-savvy, and helpful.`;

        const chatContents = messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        // Append latest query if not in messages
        if (userQuery && (!messages.length || messages[messages.length - 1].content !== userQuery)) {
          chatContents.push({
            role: 'user',
            parts: [{ text: userQuery }],
          });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: chatContents as any,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        assistantReply = response.text || '';
      } catch (geminiErr: any) {
        console.warn('Gemini chat API call error, falling back to local CymbalMart assistant:', geminiErr?.message || geminiErr);
      }
    }

    if (!assistantReply) {
      const lastQuery = userQuery || (messages.length > 0 ? messages[messages.length - 1].content : '');
      assistantReply = generateAssistantFallbackReply(lastQuery, currentPlan);
    }

    res.json({
      success: true,
      message: assistantReply,
    });
  } catch (error: any) {
    console.error('Error in CymbalMart Assistant chat:', error);
    const lastQuery = req.body?.userQuery || '';
    const fallbackReply = generateAssistantFallbackReply(lastQuery, req.body?.currentPlan);
    res.json({
      success: true,
      message: fallbackReply,
    });
  }
});

// Auto-Align Shopping List to Budget Endpoint
app.post('/api/party/auto-align-budget', async (req, res) => {
  try {
    const { shoppingList = [] } = req.body;
    const targetBudget = Number(req.body.targetBudget || req.body.budget) || 300;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `You are CymbalMart's AI Budget Optimizer.
The host has a strict target budget of $${targetBudget}.
Here is their current shopping list:
${JSON.stringify(shoppingList, null, 2)}

Your goal:
1. Align the total estimated cost of this shopping list to be under or exactly equal to $${targetBudget}.
2. Recommend specific item cost adjustments, store brand swaps (e.g. swapping brand name with CymbalMart Everyday Value), scaling non-essential quantities, or marking non-critical items as optional.
3. Return the modified shopping list where each modified item has updated estimatedCost, isStoreBrand flag, and notes explaining the optimization.

Return structured JSON.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an expert retail merchandiser and budget alignment algorithm for CymbalMart.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summaryOfChanges: { type: Type.STRING, description: 'Summary of budget savings and swaps applied' },
                newTotalEstimatedCost: { type: Type.NUMBER },
                alignedShoppingList: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      department: { type: Type.STRING },
                      aisle: { type: Type.STRING },
                      quantity: { type: Type.NUMBER },
                      unit: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER },
                      originalEstimatedCost: { type: Type.NUMBER },
                      storeRecommendation: { type: Type.STRING },
                      priority: { type: Type.STRING },
                      isStoreBrand: { type: Type.BOOLEAN },
                      notes: { type: Type.STRING },
                    },
                    required: ['name', 'category', 'quantity', 'unit', 'estimatedCost', 'priority'],
                  },
                },
              },
              required: ['summaryOfChanges', 'newTotalEstimatedCost', 'alignedShoppingList'],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.alignedShoppingList && Array.isArray(parsed.alignedShoppingList)) {
          const explanation = parsed.summaryOfChanges || 'List aligned to target budget.';
          return res.json({
            success: true,
            summary: explanation,
            explanation,
            newTotal: parsed.newTotalEstimatedCost || targetBudget,
            items: parsed.alignedShoppingList,
            alignedShoppingList: parsed.alignedShoppingList,
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini auto-align-budget failed, using algorithmic optimizer:', geminiErr);
      }
    }

    const fallbackResult = autoAlignBudgetFallback(shoppingList, targetBudget);
    res.json({
      success: true,
      summary: fallbackResult.summaryOfChanges,
      explanation: fallbackResult.summaryOfChanges,
      newTotal: fallbackResult.newTotalEstimatedCost,
      items: fallbackResult.alignedShoppingList,
      alignedShoppingList: fallbackResult.alignedShoppingList,
    });
  } catch (error: any) {
    console.error('Error in auto-align-budget:', error);
    const targetBudget = Number(req.body?.targetBudget || req.body?.budget) || 300;
    const fallbackResult = autoAlignBudgetFallback(req.body?.shoppingList || [], targetBudget);
    res.json({
      success: true,
      summary: fallbackResult.summaryOfChanges,
      explanation: fallbackResult.summaryOfChanges,
      newTotal: fallbackResult.newTotalEstimatedCost,
      items: fallbackResult.alignedShoppingList,
      alignedShoppingList: fallbackResult.alignedShoppingList,
    });
  }
});

// Quick AI Shopping Swaps & Cost Optimizer
app.post('/api/party/optimize-shopping', async (req, res) => {
  try {
    const { shoppingList = [], budget = 300, goal = 'save_money' } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Review this CymbalMart party shopping list with a budget of $${budget}:
${JSON.stringify(shoppingList, null, 2)}

Goal: ${goal === 'save_money' ? 'Reduce total cost by 15-25% through CymbalMart store brand swaps and bulk packaging without sacrificing freshness or guest experience' : 'Elevate party presentation and save host prep time using CymbalMart Deli & Bakery ready-to-serve selections'}

Provide 3 to 5 specific, high-impact CymbalMart shopping optimization tips, department routing, and item swaps.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are the official CymbalMart party shopping consultant and bulk catering expert.',
          },
        });

        if (response.text) {
          return res.json({
            success: true,
            optimizationTips: response.text,
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini optimize-shopping failed, using retail fallback:', geminiErr);
      }
    }

    res.json({
      success: true,
      optimizationTips: optimizeShoppingFallback(shoppingList, Number(budget) || 300, goal),
    });
  } catch (error: any) {
    console.error('Error in shopping optimization:', error);
    res.json({
      success: true,
      optimizationTips: optimizeShoppingFallback(req.body?.shoppingList || [], Number(req.body?.budget) || 300, req.body?.goal || 'save_money'),
    });
  }
});

// Vite Middleware for Development / Production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Party Planner Shopping Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
