export type CUJStep = 'define' | 'review' | 'refine_checkout';

export type CategoryType =
  | 'food'
  | 'drinks'
  | 'decor'
  | 'tableware'
  | 'favors_games'
  | 'essentials_cleanup';

export type CymbalDepartment =
  | 'Produce'
  | 'Bakery & Deli'
  | 'Meat & Seafood'
  | 'Beverages & Bar'
  | 'Snacks & Pantry'
  | 'Party Supplies & Tableware'
  | 'Cleanup & Essentials';

export type PriorityType = 'must_have' | 'nice_to_have' | 'optional';

export interface ShoppingItem {
  id: string;
  name: string;
  category: CategoryType;
  department?: CymbalDepartment;
  aisle?: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  originalEstimatedCost?: number;
  actualCost?: number;
  isPurchased: boolean;
  storeRecommendation: string;
  priority: PriorityType;
  isStoreBrand?: boolean;
  notes?: string;
  dietaryTags?: string[];
  substitutionOption?: {
    name: string;
    estimatedCost: number;
    savings: number;
    reason: string;
  };
}

export interface TimelineEvent {
  id: string;
  timeframe:
    | '2_weeks_prior'
    | '1_week_prior'
    | '3_days_prior'
    | '1_day_prior'
    | 'day_of_morning'
    | '2_hours_prior';
  task: string;
  completed: boolean;
  category: 'shopping' | 'prep' | 'decor' | 'setup' | 'cooking';
}

export interface PortionCalculations {
  drinksTotal: number;
  icePounds: number;
  mainServings: number;
  appetizerPieces: number;
  dessertServings: number;
  platesCupsCount: number;
}

export interface PartyPlan {
  id: string;
  title: string;
  theme: string;
  occasion: string;
  adultCount: number;
  kidCount: number;
  totalGuests: number;
  durationHours: number;
  budget: number;
  venueType: 'indoor' | 'outdoor' | 'backyard' | 'hall' | 'park' | 'home';
  dietaryRestrictions: string[];
  vibe: string;
  specialRequests?: string;
  drinkFoodCalculations: PortionCalculations;
  shoppingList: ShoppingItem[];
  timeline: TimelineEvent[];
  tips: string[];
  recipesOrCocktails?: {
    name: string;
    description: string;
    ingredients: string[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface FulfillmentDetails {
  method: 'curbside_pickup' | 'express_delivery' | 'instore_route';
  storeLocation: string;
  timeSlot: string;
  deliveryAddress?: string;
  contactPhone?: string;
  substitutionsAllowed: boolean;
  appliedPromoCode?: string;
  promoDiscount: number;
  isFinalized: boolean;
  orderConfirmationId?: string;
  finalizedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionType: 'add_items' | 'adjust_budget' | 'apply_swap' | 'scale_guests' | 'custom';
    payload?: any;
  }[];
  updatedPlanDelta?: Partial<PartyPlan>;
}

