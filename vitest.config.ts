import { defineConfig, mergeConfig } from "vite";

import viteConfig from "./vite.config";

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
