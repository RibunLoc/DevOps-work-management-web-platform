import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function bootstrap() {
  // Đảm bảo env.js đã được tải xong trước khi render
  await new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = '/env.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });


  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap();
