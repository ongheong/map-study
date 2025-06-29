import { useState, useEffect } from 'react';

interface PlaceDetails {
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

interface EnrichedMarkerData {
  position: { lat: number; lng: number };
  title: string;
  content: string;
  placeDetails?: PlaceDetails;
  isLoading?: boolean;
}

declare global {
  interface Window {
    google: any;
  }
}

const usePlacesEnrichment = (originalMarkers: Array<{
  position: { lat: number; lng: number };
  title: string;
  content: string;
}>) => {
  const [enrichedMarkers, setEnrichedMarkers] = useState<EnrichedMarkerData[]>([]);

  useEffect(() => {
    if (!originalMarkers.length || !window.google) return;

    const enrichMarkers = async () => {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      const enrichedData: EnrichedMarkerData[] = [];

      for (const marker of originalMarkers) {
        const enrichedMarker: EnrichedMarkerData = {
          ...marker,
          isLoading: true
        };
        
        enrichedData.push(enrichedMarker);

        // Places API로 검색
        const request = {
          query: marker.title,
          location: new window.google.maps.LatLng(
            marker.position.lat, 
            marker.position.lng
          ),
          radius: 500, // 500m 반경 내에서 검색
          fields: [
            'place_id', 
            'name', 
            'rating', 
            'user_ratings_total',
            'formatted_phone_number',
            'website',
            'opening_hours',
            'photos',
            'reviews'
          ]
        };

        service.textSearch(request, (results: any[], status: any) => {
          const index = enrichedData.findIndex(em => 
            em.position.lat === marker.position.lat && 
            em.position.lng === marker.position.lng
          );

          if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.[0]) {
            const place = results[0];
            
            // Place Details 요청
            service.getDetails({
              placeId: place.place_id,
              fields: [
                'place_id',
                'rating',
                'user_ratings_total',
                'formatted_phone_number',
                'website',
                'opening_hours',
                'photos',
                'reviews'
              ]
            }, (placeDetails: any, detailsStatus: any) => {
              if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK) {
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
                    reviews: placeDetails.reviews?.slice(0, 3) // 최근 리뷰 3개만
                  },
                  isLoading: false
                };
              } else {
                enrichedData[index] = {
                  ...enrichedData[index],
                  isLoading: false
                };
              }
              
              setEnrichedMarkers([...enrichedData]);
            });
          } else {
            enrichedData[index] = {
              ...enrichedData[index],
              isLoading: false
            };
            setEnrichedMarkers([...enrichedData]);
          }
        });
      }

      setEnrichedMarkers([...enrichedData]);
    };

    // Google Maps API가 로드된 후 실행
    if (window.google?.maps?.places) {
      enrichMarkers();
    } else {
      // Places 라이브러리가 로드되기를 기다림
      const checkPlaces = setInterval(() => {
        if (window.google?.maps?.places) {
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