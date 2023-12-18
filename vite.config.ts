import { defineConfig } from "vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [externalizeDeps()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "jigsaw-solver",
      fileName: () => `main.mjs`,
      formats: ["es"],
    },
    outDir: resolve(__dirname, "dist"),
  },
});
