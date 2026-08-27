import { PartyPlan } from '../types';

export const PRESET_PARTIES: PartyPlan[] = [
  {
    id: 'preset-taco-fiesta',
    title: 'CymbalMart Fiesta Taco & Margarita Bar',
    theme: 'Authentic Street Taco Bar & Margaritas',
    occasion: 'Birthday / Weekend Gathering',
    adultCount: 18,
    kidCount: 2,
    totalGuests: 20,
    durationHours: 4,
    budget: 350,
    venueType: 'backyard',
    dietaryRestrictions: ['Vegetarian Option', 'Gluten-Free Friendly'],
    vibe: 'Festive & Lively',
    specialRequests: 'Include fresh guacamole bar, spicy salsa options, and non-alcoholic lime sodas for drivers and kids.',
    drinkFoodCalculations: {
      drinksTotal: 100,
      icePounds: 35,
      mainServings: 24,
      appetizerPieces: 80,
      dessertServings: 22,
      platesCupsCount: 45,
    },
    tips: [
      'Slow-cook Cymbal Choice pork carnitas in a slow cooker 4 hours before guests arrive to keep meat juicy and hot.',
      'Set up a dual tortilla warmer station: yellow corn for gluten-free guests, flour tortillas for classic burritos.',
      'Batch-prepare a large 2-gallon drink dispenser with freshly squeezed lime margarita mix; let guests add Blanco Tequila or sparkling water.',
      'Order party pack tableware from CymbalMart Aisle 11 in advance for easy post-event cleanup.'
    ],
    recipesOrCocktails: [
      {
        name: 'Cymbal Cantina Batch Margarita & Citrus Spritz',
        description: 'Fresh-squeezed lime juice, organic agave nectar, fresh orange splash, with optional Blanco Tequila.',
        ingredients: ['CymbalMart Fresh Limes (2 bags)', 'Organic Blue Agave Nectar', 'Cymbal Sparkling Lime Water', '100% Blue Agave Tequila Blanco (2 bottles)', 'Coarse Margarita Rim Salt']
      },
      {
        name: 'Slow-Cooker Citrus Carnitas & Black Beans',
        description: 'Tender seasoned pork shoulder crisped under the broiler, paired with cumin-infused black beans.',
        ingredients: ['Cymbal Choice Boneless Pork Shoulder (7 lbs)', 'Fresh Navel Oranges & Garlic', 'Cymbal Organic Black Beans (4 cans)', 'Cotija Cheese & Fresh Cilantro']
      }
    ],
    timeline: [
      {
        id: 't1',
        timeframe: '1_week_prior',
        task: 'Finalize guest RSVP count and order bulk CymbalMart party paper goods and festive banner decorations',
        completed: true,
        category: 'shopping'
      },
      {
        id: 't2',
        timeframe: '3_days_prior',
        task: 'CymbalMart Curbside Pickup run for pork shoulder, tortilla chips, drinks, and bulk salsa',
        completed: true,
        category: 'shopping'
      },
      {
        id: 't3',
        timeframe: '1_day_prior',
        task: 'Chop red onions, cilantro, limes, and marinate pork shoulder in refrigerator',
        completed: false,
        category: 'prep'
      },
      {
        id: 't4',
        timeframe: 'day_of_morning',
        task: 'Start slow cooker carnitas on low (6 hrs), pick up 2 bags of ice at CymbalMart, set up beverage cooler',
        completed: false,
        category: 'cooking'
      },
      {
        id: 't5',
        timeframe: '2_hours_prior',
        task: 'Warm taco shells, arrange buffet dishes, play fiesta playlist, rim cocktail glasses with salt',
        completed: false,
        category: 'setup'
      }
    ],
    shoppingList: [
      {
        id: 's1',
        name: 'Cymbal Choice Boneless Pork Shoulder',
        category: 'food',
        department: 'Meat & Seafood',
        aisle: 'Aisle 5 - Cymbal Choice Meats',
        quantity: 7,
        unit: 'lbs',
        estimatedCost: 28,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have',
        isStoreBrand: true,
        notes: 'Cymbal Select bulk value pack, tender for slow cooking'
      },
      {
        id: 's2',
        name: 'CymbalMart Corn & Flour Tortillas (Combo Pack)',
        category: 'food',
        department: 'Bakery & Deli',
        aisle: 'Aisle 3 - Artisan Bakery & Tortillas',
        quantity: 3,
        unit: 'packs (75 total)',
        estimatedCost: 9,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have',
        isStoreBrand: true,
        notes: 'Includes yellow corn for gluten-free guests'
      },
      {
        id: 's3',
        name: 'Cymbal Everyday Value Restaurant Style Tortilla Chips',
        category: 'food',
        department: 'Snacks & Pantry',
        aisle: 'Aisle 6 - Chips & Party Pantry',
        quantity: 3,
        unit: 'large bags',
        estimatedCost: 11,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have',
        isStoreBrand: true
      },
      {
        id: 's4',
        name: 'Cymbal Fresh Hass Avocados (Bulk 5-Pack)',
        category: 'food',
        department: 'Produce',
        aisle: 'Aisle 1 - Fresh Produce & Herbs',
        quantity: 2,
        unit: 'bags (10 avocados)',
        estimatedCost: 11,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have',
        dietaryTags: ['Vegan', 'Gluten-Free']
      },
      {
        id: 's5',
        name: 'Cymbal Shredded Mexican 4-Cheese & Cotija Wheel',
        category: 'food',
        department: 'Bakery & Deli',
        aisle: 'Aisle 4 - Gourmet Deli & Cheeses',
        quantity: 2,
        unit: 'lbs',
        estimatedCost: 10,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have',
        isStoreBrand: true
      },
      {
        id: 's6',
        name: 'Fresh Limes & Organic Cilantro Bunches',
        category: 'food',
        department: 'Produce',
        aisle: 'Aisle 1 - Fresh Produce & Herbs',
        quantity: 15,
        unit: 'limes + 3 cilantro',
        estimatedCost: 8,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have'
      },
      {
        id: 's7',
        name: 'Cymbal Select Tequila Blanco (100% Blue Agave, 750ml)',
        category: 'drinks',
        department: 'Beverages & Bar',
        aisle: 'Aisle 9 - Wine & Premium Spirits',
        quantity: 2,
        unit: 'bottles',
        estimatedCost: 44,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Beverage Dept',
        priority: 'must_have'
      },
      {
        id: 's8',
        name: 'Corona Extra & Modelo Especial Variety 24-Pack',
        category: 'drinks',
        department: 'Beverages & Bar',
        aisle: 'Aisle 8 - Cold Beer & Craft Seltzers',
        quantity: 1,
        unit: '24-pack',
        estimatedCost: 29,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'nice_to_have'
      },
      {
        id: 's9',
        name: 'Cymbal Sparkle Mexican Soda & Lime Seltzers',
        category: 'drinks',
        department: 'Beverages & Bar',
        aisle: 'Aisle 8 - Sparkling & Craft Beverages',
        quantity: 2,
        unit: '12-packs',
        estimatedCost: 12,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have',
        isStoreBrand: true,
        dietaryTags: ['Non-Alcoholic']
      },
      {
        id: 's10',
        name: 'Cymbal Pure Crystal Party Ice',
        category: 'drinks',
        department: 'Cleanup & Essentials',
        aisle: 'Aisle 14 - Party Ice & Coolers',
        quantity: 2,
        unit: '20lb bags',
        estimatedCost: 8,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have',
        isStoreBrand: true
      },
      {
        id: 's11',
        name: 'Cymbal Celebration Festive Banner & Centerpiece Set',
        category: 'decor',
        department: 'Party Supplies & Tableware',
        aisle: 'Aisle 11 - Party Decor & Balloons',
        quantity: 1,
        unit: 'party pack',
        estimatedCost: 16,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Party Dept',
        priority: 'nice_to_have',
        isStoreBrand: true
      },
      {
        id: 's12',
        name: 'Cymbal Eco-Green Compostable Plates, Cups & Napkins',
        category: 'tableware',
        department: 'Party Supplies & Tableware',
        aisle: 'Aisle 11 - Tableware & Paper Goods',
        quantity: 1,
        unit: '60-count party bundle',
        estimatedCost: 14,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have',
        isStoreBrand: true
      },
      {
        id: 's13',
        name: 'CymbalMart Bakery Cinnamon Churro Bites',
        category: 'food',
        department: 'Bakery & Deli',
        aisle: 'Aisle 3 - Artisan Bakery',
        quantity: 24,
        unit: 'pieces (2 platters)',
        estimatedCost: 14,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Bakery',
        priority: 'nice_to_have',
        isStoreBrand: true
      },
      {
        id: 's14',
        name: 'Cymbal Heavy-Duty Drawstring Trash Bags & Surface Wipes',
        category: 'essentials_cleanup',
        department: 'Cleanup & Essentials',
        aisle: 'Aisle 14 - Paper & Cleaning',
        quantity: 1,
        unit: 'combo pack',
        estimatedCost: 8,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have',
        isStoreBrand: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'preset-garden-cocktail',
    title: 'CymbalMart Sunset Grazing & Spritz Soirée',
    theme: 'Artisan Charcuterie & Botanical Spritz',
    occasion: 'Milestone Birthday / Celebration',
    adultCount: 15,
    kidCount: 0,
    totalGuests: 15,
    durationHours: 3.5,
    budget: 380,
    venueType: 'outdoor',
    dietaryRestrictions: ['Vegetarian Friendly', 'Nut Allergy Aware'],
    vibe: 'Chic & Relaxed',
    specialRequests: 'Premium cheeses, gluten-free crackers, non-alcoholic botanical spritz option.',
    drinkFoodCalculations: {
      drinksTotal: 65,
      icePounds: 25,
      mainServings: 18,
      appetizerPieces: 90,
      dessertServings: 18,
      platesCupsCount: 35,
    },
    tips: [
      'Assemble the grand wooden grazing board 1 hour before party; cheeses taste richest when allowed to reach room temperature.',
      'Prepare an Aperol & Elderflower Spritz station with chilled prosecco, soda water, and fresh orange slices.',
      'Pick up fresh eucalyptus and floral bouquets from CymbalMart Floral Department for simple table elevation.'
    ],
    recipesOrCocktails: [
      {
        name: 'Cymbal St-Germain Botanical Elderflower Spritz',
        description: 'Chilled prosecco, elderflower liqueur, sparkling mineral water, with English cucumber ribbon and lemon twist.',
        ingredients: ['Prosecco DOC (4 bottles)', 'Elderflower Liqueur', 'Cymbal Sparkling Mineral Water', 'Fresh Cucumbers & Meyer Lemons']
      },
      {
        name: 'Grand CymbalMart Deli Charcuterie Board',
        description: 'Double cream brie, aged gouda, prosciutto di Parma, fig jam, marinated olives, and artisan rosemary crisps.',
        ingredients: ['Cymbal Deli Prosciutto & Salami Trio', 'Double Cream Brie & Aged Gouda', 'Kalamata Olives & Fig Preserves', 'Gourmet Water Crackers']
      }
    ],
    timeline: [
      {
        id: 'g1',
        timeframe: '1_week_prior',
        task: 'Confirm glassware and garden string lights setup',
        completed: true,
        category: 'prep'
      },
      {
        id: 'g2',
        timeframe: '3_days_prior',
        task: 'CymbalMart Curbside Pickup for specialty cheeses, cured meats, artisan crackers, and floral bunches',
        completed: true,
        category: 'shopping'
      },
      {
        id: 'g3',
        timeframe: '1_day_prior',
        task: 'Pre-chill all prosecco, wine, and mineral water bottles in refrigerator',
        completed: false,
        category: 'prep'
      },
      {
        id: 'g4',
        timeframe: '2_hours_prior',
        task: 'Assemble the grand wooden charcuterie board, slice citrus garnishes, light outdoor candles',
        completed: false,
        category: 'setup'
      }
    ],
    shoppingList: [
      {
        id: 'sg1',
        name: 'Cymbal Select Prosecco Superiore DOC',
        category: 'drinks',
        department: 'Beverages & Bar',
        aisle: 'Aisle 9 - Wine & Champagne',
        quantity: 5,
        unit: 'bottles',
        estimatedCost: 60,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Beverage Dept',
        priority: 'must_have',
        isStoreBrand: true
      },
      {
        id: 'sg2',
        name: 'Aperol Aperitivo & Elderflower Liqueur Set',
        category: 'drinks',
        department: 'Beverages & Bar',
        aisle: 'Aisle 9 - Spirits & Liqueurs',
        quantity: 2,
        unit: 'bottles (1 of each)',
        estimatedCost: 54,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Beverage Dept',
        priority: 'must_have'
      },
      {
        id: 'sg3',
        name: 'Cymbal Gourmet Cheese Platter (Brie, Manchego, Aged Cheddar)',
        category: 'food',
        department: 'Bakery & Deli',
        aisle: 'Aisle 4 - Gourmet Deli & Cheeses',
        quantity: 4,
        unit: 'wedges (2.5 lbs total)',
        estimatedCost: 32,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Deli',
        priority: 'must_have',
        isStoreBrand: true
      },
      {
        id: 'sg4',
        name: 'Cymbal Deli Prosciutto di Parma & Italian Salumi Trio',
        category: 'food',
        department: 'Bakery & Deli',
        aisle: 'Aisle 4 - Gourmet Deli',
        quantity: 3,
        unit: 'variety packs',
        estimatedCost: 26,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Deli',
        priority: 'must_have',
        isStoreBrand: true
      },
      {
        id: 'sg5',
        name: 'Fresh Eucalyptus & Sunset Wildflower Bouquets',
        category: 'decor',
        department: 'Produce',
        aisle: 'Aisle 1 - Floral & Plants',
        quantity: 3,
        unit: 'bunches',
        estimatedCost: 22,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Floral Dept',
        priority: 'nice_to_have'
      },
      {
        id: 'sg6',
        name: 'Cymbal Artisan Rosemary Sourdough & Gluten-Free Crackers',
        category: 'food',
        department: 'Bakery & Deli',
        aisle: 'Aisle 3 - Artisan Bakery',
        quantity: 4,
        unit: 'boxes',
        estimatedCost: 15,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have',
        isStoreBrand: true
      },
      {
        id: 'sg7',
        name: 'CymbalMart Bakery French Macarons & Berry Tartlets',
        category: 'food',
        department: 'Bakery & Deli',
        aisle: 'Aisle 3 - Pastry & Desserts',
        quantity: 20,
        unit: 'pieces',
        estimatedCost: 20,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Bakery',
        priority: 'nice_to_have',
        isStoreBrand: true
      },
      {
        id: 'sg8',
        name: 'Gold-Trimmed Cocktail Napkins & Acrylic Wine Tumblers',
        category: 'tableware',
        department: 'Party Supplies & Tableware',
        aisle: 'Aisle 11 - Tableware & Bar Accessories',
        quantity: 1,
        unit: 'set (40 count)',
        estimatedCost: 15,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Party Dept',
        priority: 'must_have'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'preset-kids-birthday',
    title: 'CymbalMart Kids Birthday Carnival & Pizza Fun',
    theme: 'Dinosaur Adventure & Pizza Carnival',
    occasion: 'Kids 7th Birthday Party',
    adultCount: 6,
    kidCount: 10,
    totalGuests: 16,
    durationHours: 3,
    budget: 220,
    venueType: 'home',
    dietaryRestrictions: ['Nut-Free (Strict)'],
    vibe: 'High-Energy & Playful',
    specialRequests: 'CymbalMart customized bakery cake, juice boxes for kids, cold brew coffee for parents, party favor bags.',
    drinkFoodCalculations: {
      drinksTotal: 50,
      icePounds: 20,
      mainServings: 18,
      appetizerPieces: 60,
      dessertServings: 18,
      platesCupsCount: 36,
    },
    tips: [
      'Order the custom Dino-themed sheet cake from CymbalMart Bakery 48 hours in advance for pickup morning of party.',
      'Pre-pack snack cups with grapes and cheddar crackers to eliminate bottlenecking at the food table.',
      'Set a 15-minute icebreaker craft before serving pizza to keep all kids engaged.'
    ],
    recipesOrCocktails: [
      {
        name: 'Jurassic Green Apple Punch',
        description: 'Sparkling lemon-lime cider, 100% white grape juice, with lime sherbet scoops and gummy dinos.',
        ingredients: ['Cymbal 100% White Grape Juice (2 bottles)', 'Cymbal Lemon-Lime Soda (2 2L)', 'Lime Sherbet (1 tub)', 'Gummy Dino Candies']
      }
    ],
    timeline: [
      {
        id: 'kb1',
        timeframe: '1_week_prior',
        task: 'Confirm CymbalMart Bakery custom dinosaur sheet cake order & party bags',
        completed: true,
        category: 'shopping'
      },
      {
        id: 'kb2',
        timeframe: '3_days_prior',
        task: 'Pick up juice boxes, frozen pizza packs, dinosaur balloons, and paper goods',
        completed: true,
        category: 'shopping'
      },
      {
        id: 'kb3',
        timeframe: 'day_of_morning',
        task: 'Pick up fresh cake & ice from CymbalMart, inflate dinosaur balloon arch',
        completed: false,
        category: 'setup'
      }
    ],
    shoppingList: [
      {
        id: 'kb-s1',
        name: 'CymbalMart Bakery 1/4 Sheet Custom Birthday Cake (Nut-Free)',
        category: 'food',
        department: 'Bakery & Deli',
        aisle: 'Aisle 3 - Custom Cake Order Dept',
        quantity: 1,
        unit: 'sheet cake (serves 20)',
        estimatedCost: 26,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Bakery',
        priority: 'must_have',
        isStoreBrand: true,
        dietaryTags: ['Nut-Free']
      },
      {
        id: 'kb-s2',
        name: 'Cymbal Choice Stone-Fired Cheese & Pepperoni Pizzas (4-Pack)',
        category: 'food',
        department: 'Snacks & Pantry',
        aisle: 'Aisle 7 - Frozen Party Foods',
        quantity: 4,
        unit: 'pizzas',
        estimatedCost: 28,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have',
        isStoreBrand: true
      },
      {
        id: 'kb-s3',
        name: 'Cymbal 100% Organic Juice Boxes (Apple & Berry 32-Pack)',
        category: 'drinks',
        department: 'Beverages & Bar',
        aisle: 'Aisle 8 - Juices & Kids Drinks',
        quantity: 1,
        unit: '32-pack',
        estimatedCost: 13,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'must_have',
        isStoreBrand: true,
        dietaryTags: ['Non-Alcoholic', 'Nut-Free']
      },
      {
        id: 'kb-s4',
        name: 'Cymbal Celebration Dinosaur Balloon Arch & Themed Banner Kit',
        category: 'decor',
        department: 'Party Supplies & Tableware',
        aisle: 'Aisle 11 - Balloons & Party Decor',
        quantity: 1,
        unit: 'party decor kit',
        estimatedCost: 19,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Party Dept',
        priority: 'must_have',
        isStoreBrand: true
      },
      {
        id: 'kb-s5',
        name: 'Dino Theme Plates, Cups, Napkins & Cutlery Pack',
        category: 'tableware',
        department: 'Party Supplies & Tableware',
        aisle: 'Aisle 11 - Tableware',
        quantity: 1,
        unit: '24-guest pack',
        estimatedCost: 14,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Party Dept',
        priority: 'must_have'
      },
      {
        id: 'kb-s6',
        name: 'Cymbal Cold Brew Coffee Jug for Parents (64 oz)',
        category: 'drinks',
        department: 'Beverages & Bar',
        aisle: 'Aisle 8 - Chilled Coffee & Dairy',
        quantity: 1,
        unit: 'jug',
        estimatedCost: 9,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Supercenter',
        priority: 'nice_to_have',
        isStoreBrand: true
      },
      {
        id: 'kb-s7',
        name: 'Pre-Packaged Dino Favor Bags & Temporary Tattoos',
        category: 'favors_games',
        department: 'Party Supplies & Tableware',
        aisle: 'Aisle 11 - Favors & Games',
        quantity: 10,
        unit: 'gift bags',
        estimatedCost: 15,
        isPurchased: false,
        storeRecommendation: 'CymbalMart Party Dept',
        priority: 'must_have'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

