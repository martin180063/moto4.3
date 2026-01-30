export enum Tab {
  CHECK = '機車檢查',
  PREP = '行前準備',
  DAY1 = '第一天',
  DAY2 = '第二天',
  DAY3 = '第三天',
  DAY4 = '第四天',
}

export interface ItineraryItem {
  time: string;
  activity: string;
  note?: string;
  icon?: string;
  mapQuery?: string; // Search query for Google Maps
  tag?: string;      // e.g., "💰 求財戰區"
  tagColor?: string; // e.g., "#ffd700"
  tagTextColor?: string; // e.g., "#856404"
  backgroundColor?: string; // e.g., "#f3e5f5"
  lat?: number;
  lng?: number;
}

export interface DayItinerary {
  title: string;
  description: string;
  items: ItineraryItem[];
  weatherLoc?: {
    lat: number;
    lng: number;
    name: string;
  };
}