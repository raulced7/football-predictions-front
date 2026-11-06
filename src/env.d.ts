/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />
declare global {
    interface ImportMetaEnv {
        readonly VITE_API_URL?: string;
    }
}

export {};
