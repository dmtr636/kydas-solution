import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [svgr(), react()],
    define: {
        global: {},
    },
    server: {
        port: 3000,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    "lottie-react": ["lottie-react"],
                },
            },
        },
    },
    resolve: {
        alias: {
            src: "/src",
        },
    },
});
