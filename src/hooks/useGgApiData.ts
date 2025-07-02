import { useState, useEffect } from 'react';
import { getGgFacilities } from '../apis/ggApi';
import type { FacilityData, MarkerData } from '../types';

const useGgApiData = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const facilities: FacilityData[] = await getGgFacilities();

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

