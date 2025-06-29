import { useState, useEffect } from 'react';

interface FacilityData {
  CMPNM_NM: string;
  INDUTYPE_NM: string;
  REFINE_LOTNO_ADDR: string;
  REFINE_ROADNM_ADDR: string;
  REFINE_WGS84_LOGT: string;
  REFINE_WGS84_LAT: string;
  SIGUN_NM: string;
}

interface ApiResponse {
  RegionMnyFacltStus: [{
    head: any[];
  }, {
    row: FacilityData[];
  }];
}

interface MarkerData {
  position: { lat: number; lng: number };
  title: string;
  content: string;
}

const useGgApiData = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://openapi.gg.go.kr/RegionMnyFacltStus?KEY=${import.meta.env.VITE_GG_OPEN_API_KEY}&Type=json&pIndex=1&pSize=10`
        );
        
        if (!response.ok) {
          throw new Error('API 요청 실패');
        }

        const data: ApiResponse = await response.json();
        const facilities = data.RegionMnyFacltStus[1].row;

        const markersData: MarkerData[] = facilities
          .filter(facility => facility.REFINE_WGS84_LAT && facility.REFINE_WGS84_LOGT)
          .map(facility => ({
            position: {
              lat: parseFloat(facility.REFINE_WGS84_LAT),
              lng: parseFloat(facility.REFINE_WGS84_LOGT)
            },
            title: facility.CMPNM_NM,
            content: `
              <strong>업종:</strong> ${facility.INDUTYPE_NM}<br/>
              <strong>주소:</strong> ${facility.REFINE_ROADNM_ADDR || facility.REFINE_LOTNO_ADDR}<br/>
              <strong>지역:</strong> ${facility.SIGUN_NM}
            `
          }));

        setMarkers(markersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { markers, loading, error };
};

export default useGgApiData; 

function loadEnv(mode: any, arg1: string) {
  throw new Error('Function not implemented.');
}
