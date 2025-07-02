import { useState, useEffect } from 'react';
import type { EnrichedMarkerData, PlaceDetails } from '../types';
import {
  getPlaceDetails,
  searchPlacesByNameAndLocation,
} from '../apis/placesApi';

declare global {
  interface Window {
    google: any;
  }
}

const usePlacesEnrichment = (
  originalMarkers: Array<{
    position: { lat: number; lng: number };
    title: string;
    content: string;
  }>
) => {
  const [enrichedMarkers, setEnrichedMarkers] = useState<EnrichedMarkerData[]>(
    []
  );

  useEffect(() => {
    if (!originalMarkers.length || !window.google) return;

    /** google Places API 호출하여 매장 정보 조회 */
    const enrichMarkers = async () => {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      const enrichedData: EnrichedMarkerData[] = [];

      for (const marker of originalMarkers) {
        const enrichedMarker: EnrichedMarkerData = {
          ...marker,
          isLoading: true,
        };

        enrichedData.push(enrichedMarker);

        // Places API로 장소 id 검색
        const place = await searchPlacesByNameAndLocation({
          service,
          name: marker.title,
          lat: marker.position.lat,
          lng: marker.position.lng,
          radius: 500,
        });

        const index = enrichedData.findIndex(
          (em) =>
            em.position.lat === marker.position.lat &&
            em.position.lng === marker.position.lng
        );

        if (place) {
          const placeDetails: PlaceDetails | null = await getPlaceDetails({
            service,
            placeId: place.place_id,
          });
          if (placeDetails) {
            enrichedData[index] = {
              ...enrichedData[index],
              placeDetails: {
                place_id: placeDetails.place_id,
                rating: placeDetails.rating,
                user_ratings_total: placeDetails.user_ratings_total,
                formatted_phone_number: placeDetails.formatted_phone_number,
                website: placeDetails.website,
                opening_hours: placeDetails.opening_hours,
                photos: placeDetails.photos,
                reviews: placeDetails.reviews?.slice(0, 3),
              },
              isLoading: false,
            };
          } else {
            enrichedData[index] = {
              ...enrichedData[index],
              isLoading: false,
            };
          }
        } else {
          enrichedData[index] = {
            ...enrichedData[index],
            isLoading: false,
          };
        }
        setEnrichedMarkers([...enrichedData]);
      }
    };

    // Google Maps API가 로드된 후 실행
    if (window.google?.maps?.places) {
      enrichMarkers();
    } else {
      // Places 라이브러리가 로드되기를 기다림
      const checkPlaces = setInterval(() => {
        if (window.google?.maps?.places) {
          // 실시간으로 로드되는 것을 확인하기 위해 100ms 마다 확인
          clearInterval(checkPlaces);
          enrichMarkers();
        }
      }, 100);

      return () => clearInterval(checkPlaces);
    }
  }, [originalMarkers]);

  return enrichedMarkers;
};

export default usePlacesEnrichment;
