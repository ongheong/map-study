# 지도 테스트

경기도 지역화페 매장 공공데이터와 Google Maps/Places API를 활용하여, 실제 가맹점 위치와 구글 리뷰·별점 정보를 지도에 시각화하는 기능을 테스트하고자 만들었습니다.

---

## 🛠️ 기술스택
- React (TypeScript)
- Vite, Yarn
- ESLint, Prettier
- Google Maps JavaScript API
- Google Places API
- 경기도 지역화폐 사용 매장 Open API

---

## 🚀 사용법
1. 저장소 클론 및 의존성 설치
   ```bash
   git clone https://github.com/ongheong/map-study.git
   cd map-study
   yarn 
   ```
2. 환경변수 설정
   - 프로젝트 루트에 `.env` 파일 생성
   - 아래와 같이 API 키를 입력
     - DND 12기 7조 노션 > [6/29 개발 회의록](https://www.notion.so/6-29-221a96b88e978013aa0bda17229ee4e9?source=copy_link#221a96b88e97807c89a1c6ad6ea73d26)
3. 개발 서버 실행
   ```bash
   yarn dev
   ```
4. 브라우저에서 `http://localhost:3000` 접속

---

## ✨ 테스트한 기능
- 경기도 공공데이터 API에서 가맹점 위치 및 정보를 불러옵니다.
- Google Maps에 마커로 가맹점 위치를 시각화합니다.
- 공공데이터 API 데이터를 Google Places API에 검색하여, 각 가맹점의 별점, 리뷰, 연락처를 불러옵니다.

---

## 📁 프로젝트 구조
```
프로젝트/
├── public/
├── src/
│   ├── apis/               # 경기도 공공데이터 API, google Maps API 호출 코드
│   ├── assets/             # 이미지, 아이콘 등 정적 파일
│   ├── components/         # UI 컴포넌트 (GoogleMap, EnrichedPlaceCard 등)
│   ├── hooks/              # 커스텀 훅 (useGgApiData, usePlacesEnrichment 등)
│   ├── types/              # 각종 Interface, type 정의
│   ├── App.tsx             # 메인 앱 컴포넌트
│   ├── index.tsx           # 엔트리 포인트
│   └── ...
├── .env                    # 환경변수 파일
├── README.md
└── 기타 설정 파일
```

--

## 실행 화면
<img width="1426" alt="image1231241" src="https://github.com/user-attachments/assets/a3086e35-f5d5-4537-aecb-acf6d71b32b2" />

- 배포 주소: https://map-study-eight.vercel.app/