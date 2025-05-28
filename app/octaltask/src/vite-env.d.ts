/// <reference types="vite/client" />
export {};

declare global {
  interface Window {
    __ENV__?: {
      VITE_API_BASE?: string;
    };
  }
}
