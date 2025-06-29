import './App.css'
import GoogleMap from './components/GoogleMap'
import EnrichedPlaceCard from './components/EnrichedPlaceCard'
import useGgApiData from './hooks/useGgApiData'
import usePlacesEnrichment from './hooks/usePlacesEnrichment'

function App() {
  // 경기도 중심 좌표 (대략적)
  const center = { lat: 37.4138, lng: 127.5183 };
  
  const { markers: originalMarkers, loading, error } = useGgApiData();
  const enrichedMarkers = usePlacesEnrichment(originalMarkers);

  if (loading) {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', margin: '0', padding: '20px', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>지도 데이터를 불러오는 중...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', margin: '0', padding: '20px', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>오류: {error}</h2>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: '0', padding: '20px', boxSizing: 'border-box' }}>
      <h1>경기도 지역화폐 가맹점 지도 + 구글 리뷰</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        경기도 공공데이터와 구글 플레이스 정보를 결합하여 별점, 리뷰, 연락처 등을 확인하세요!
      </p>
      
      <div style={{ margin: '20px 0', width: '100%' }}>
        <GoogleMap 
          center={center}
          zoom={10}
          markers={enrichedMarkers.length > 0 ? enrichedMarkers : originalMarkers}
          style={{ width: '100%', height: '500px', border: '1px solid #ccc', borderRadius: '8px' }}
        />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>
          가맹점 정보 ({originalMarkers.length}개)
          {enrichedMarkers.length > 0 && (
            <span style={{ color: '#4285f4', fontSize: '14px', fontWeight: 'normal' }}>
              {' '}• 구글 정보 연동 중...
            </span>
          )}
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '16px', 
          marginTop: '16px' 
        }}>
          {(enrichedMarkers.length > 0 ? enrichedMarkers : originalMarkers).map((marker, index) => {
            const enrichedMarker = marker as any;
            return (
              <EnrichedPlaceCard
                key={index}
                title={marker.title}
                content={marker.content}
                placeDetails={enrichedMarker.placeDetails}
                isLoading={enrichedMarker.isLoading}
              />
            );
          })}
        </div>
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>ℹ️ 데이터 출처</h4>
        <p style={{ margin: '4px 0' }}>• 가맹점 기본 정보: 경기도 공공데이터 포털</p>
        <p style={{ margin: '4px 0' }}>• 별점, 리뷰, 연락처: Google Places API</p>
        <p style={{ margin: '4px 0' }}>• 실시간 업데이트되는 정보입니다</p>
      </div>
    </div>
  )
}

export default App
