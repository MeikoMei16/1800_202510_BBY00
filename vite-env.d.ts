
interface ImportMetaEnv {
    readonly VITE_FIREBASE_API: string;
    // Add more as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}