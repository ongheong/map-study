import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd());

  return { 
  plugins: [react(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
        },
      },
    }),
  ],
  server: {
    // 로컬 네트워크의 다른 장치에서도 개발 서버 접근 가능
      host: '0.0.0.0',
    // 개발 서버가 사용할 고정 포트
      port: 3000,
    },
  }
})
