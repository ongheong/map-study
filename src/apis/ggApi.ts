import type { FacilityData } from "../types";

export interface ApiResponse {
  RegionMnyFacltStus: [{
    head: any[];
  }, {
    row: FacilityData[];
  }];
}

export async function getGgFacilities() {
  const response = await fetch(
    `https://openapi.gg.go.kr/RegionMnyFacltStus?KEY=${import.meta.env.VITE_GG_OPEN_API_KEY}&Type=json&pIndex=1&pSize=10`
  );
  if (!response.ok) {
    throw new Error('API 요청 실패');
  }
  const data: ApiResponse = await response.json();
  return data.RegionMnyFacltStus[1].row;
} 