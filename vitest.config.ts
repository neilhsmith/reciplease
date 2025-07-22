import { defineConfig, mergeConfig } from "vite";

import viteConfigFn from "./vite.config";

process.env.VITEST = "true";

const viteConfig = viteConfigFn({ command: "serve", mode: "test" });

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      include: ["app/**/*.{spec,test,tests}.{ts,tsx}"],
      setupFiles: ["tests/setup/setup-test-env.ts"],
      globalSetup: [],
      restoreMocks: true,
      clearMocks: true,
      coverage: {
        all: true,
        enabled: true,
        include: ["app/**/*.{ts,tsx}"],
        reporter: ["text", "json", "html"],
      },
    },
  }),
);
