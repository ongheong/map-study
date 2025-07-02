import type { PlaceDetails } from '../types';

interface searchPlacesProps {
  service: any;
  name: string;
  lat: number;
  lng: number;
  radius: number;
}

interface getPlaceDetailsProps {
  service: any;
  placeId: string;
}

export function searchPlacesByNameAndLocation({
  service,
  name,
  lat,
  lng,
  radius = 500,
}: searchPlacesProps): Promise<any | null> {
  return new Promise((resolve, reject) => {
    const request = {
      query: name,
      location: new window.google.maps.LatLng(lat, lng),
      radius,
      fields: [
        'place_id',
        'name',
        'rating',
        'user_ratings_total',
        'formatted_phone_number',
        'website',
        'opening_hours',
        'photos',
        'reviews',
      ],
    };

    service.textSearch(request, (results: any[], status: any) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results?.[0]
      ) {
        resolve(results[0]);
      } else {
        resolve(null);
        reject(new Error('Places에 등록된 매장이 아닙니다'));
      }
    });
  });
}

export function getPlaceDetails({
  service,
  placeId,
}: getPlaceDetailsProps): Promise<PlaceDetails | null> {
  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: [
          'place_id',
          'rating',
          'user_ratings_total',
          'formatted_phone_number',
          'website',
          'opening_hours',
          'photos',
          'reviews',
        ],
      },
      (placeDetails: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(placeDetails);
        } else {
          resolve(null);
          reject(new Error('해당 placeId에 상세정보가 없습니다.'));
        }
      }
    );
  });
}
