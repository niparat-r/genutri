export enum MealCategory {
  MAIN_COURSE = 'Main Course',
  SNACK = 'Snack',
  BEVERAGE = 'Beverage',
}

export enum CuisineType {
  THAI = 'Thai',
  INTERNATIONAL = 'International',
  FUSION = 'Fusion',
}

export interface MenuItem {
  id: number;
  name_th: string;
  name_en: string;
  category: MealCategory;
  cuisine: CuisineType;
  is_healthy_option: boolean;
  calories_approx: number;
}

export interface AiHealthAnalysis {
  nutriScore: string;
  healthTip: string;
}

export enum AppState {
  IDLE = 'IDLE',
  SPINNING = 'SPINNING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
}