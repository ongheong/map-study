import { useEffect, useRef } from 'react';

interface MarkerData {
  position: { lat: number; lng: number };
  title: string;
  content?: string;
}

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers?: MarkerData[];
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  center, 
  zoom, 
  markers = [],
  style = { width: '100%', height: '400px' } 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const initializeMap = () => {
      if (window.google && mapRef.current && !mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        });
      }
    };

    // Google Maps API가 이미 로드되었는지 확인
    if (window.google) {
      initializeMap();
    } else {
      // API 로드를 기다림
      window.initMap = initializeMap;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  // 마커 업데이트
  useEffect(() => {
    if (mapInstanceRef.current && window.google) {
      // 기존 마커들 제거
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // 새 마커들 추가
      markers.forEach((markerData) => {
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          map: mapInstanceRef.current,
          title: markerData.title,
        });

        // 정보창 추가 (선택사항)
        if (markerData.content) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div><h3>${markerData.title}</h3><p>${markerData.content}</p></div>`,
          });

          marker.addListener('click', () => {
            infoWindow.open(mapInstanceRef.current, marker);
          });
        }

        markersRef.current.push(marker);
      });

      // 모든 마커가 보이도록 지도 범위 조정
      if (markers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.position));
        mapInstanceRef.current.fitBounds(bounds);
      }
    }
  }, [markers]);

  return <div ref={mapRef} style={style} />;
};

export default GoogleMap; 