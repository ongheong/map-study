import React from 'react';

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

interface EnrichedPlaceCardProps {
  title: string;
  content: string;
  placeDetails?: PlaceDetails;
  isLoading?: boolean;
}

const StarRating: React.FC<{ rating: number; total?: number }> = ({ rating, total }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i} style={{ color: '#ffd700' }}>★</span>);
  }
  
  if (hasHalfStar) {
    stars.push(<span key="half" style={{ color: '#ffd700' }}>☆</span>);
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} style={{ color: '#ddd' }}>★</span>);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div>{stars}</div>
      <span style={{ fontSize: '14px', color: '#666' }}>
        {rating.toFixed(1)} {total && `(${total}개 리뷰)`}
      </span>
    </div>
  );
};

const EnrichedPlaceCard: React.FC<EnrichedPlaceCardProps> = ({ 
  title, 
  content, 
  placeDetails, 
  isLoading 
}) => {
  return (
    <div style={{ 
      padding: '16px', 
      border: '1px solid #ddd', 
      borderRadius: '12px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <h4 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>
        {title}
      </h4>
      
      <div dangerouslySetInnerHTML={{ __html: content }} style={{ marginBottom: '12px' }} />
      
      {isLoading && (
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          구글 정보를 불러오는 중...
        </div>
      )}
      
      {placeDetails && (
        <div style={{ 
          borderTop: '1px solid #eee', 
          paddingTop: '12px',
          marginTop: '12px'
        }}>
          <h5 style={{ margin: '0 0 8px 0', color: '#4285f4' }}>📍 구글 정보</h5>
          
          {placeDetails.rating && (
            <div style={{ marginBottom: '8px' }}>
              <StarRating 
                rating={placeDetails.rating} 
                total={placeDetails.user_ratings_total} 
              />
            </div>
          )}
          
          {placeDetails.opening_hours && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ 
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: placeDetails.opening_hours.open_now ? '#4caf50' : '#f44336',
                color: 'white'
              }}>
                {placeDetails.opening_hours.open_now ? '영업 중' : '영업 종료'}
              </span>
            </div>
          )}
          
          {placeDetails.formatted_phone_number && (
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>
              📞 <a href={`tel:${placeDetails.formatted_phone_number}`} style={{ color: '#4285f4', textDecoration: 'none' }}>
                {placeDetails.formatted_phone_number}
              </a>
            </div>
          )}
          
          {placeDetails.website && (
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>
              🌐 <a href={placeDetails.website} target="_blank" rel="noopener noreferrer" style={{ color: '#4285f4', textDecoration: 'none' }}>
                웹사이트 방문
              </a>
            </div>
          )}
          
          {placeDetails.reviews && placeDetails.reviews.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <h6 style={{ margin: '0 0 8px 0', color: '#666' }}>최근 리뷰</h6>
              {placeDetails.reviews.slice(0, 2).map((review, index) => (
                <div key={index} style={{ 
                  marginBottom: '8px', 
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong>{review.author_name}</strong>
                    <StarRating rating={review.rating} />
                  </div>
                  <p style={{ margin: 0, color: '#666', lineHeight: 1.4 }}>
                    {review.text.length > 100 ? `${review.text.substring(0, 100)}...` : review.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnrichedPlaceCard; 