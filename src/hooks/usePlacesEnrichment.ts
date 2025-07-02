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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!originalMarkers.length || !window.google?.maps?.places) return;

    /** google Places API 호출하여 매장 정보 조회 */
    const enrichMarkers = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    enrichMarkers();
  }, [originalMarkers]);

  return { enrichedMarkers, isLoading };
};

export default usePlacesEnrichment;
