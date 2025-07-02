export interface FacilityData {
  CMPNM_NM: string;
  INDUTYPE_NM: string;
  REFINE_LOTNO_ADDR: string;
  REFINE_ROADNM_ADDR: string;
  REFINE_WGS84_LOGT: string;
  REFINE_WGS84_LAT: string;
  SIGUN_NM: string;
}

export interface MarkerData {
  position: { lat: number; lng: number };
  title: string;
  content: string;
}

export interface EnrichedMarkerData {
  position: { lat: number; lng: number };
  title: string;
  content: string;
  placeDetails?: PlaceDetails;
  isLoading?: boolean;
}

export interface PlaceDetails {
  place_id?: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  photos?: any[];
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}