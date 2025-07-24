import { reactRouter } from "@react-router/dev/vite";
import { type SentryReactRouterBuildOptions, sentryReactRouter } from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "neil-smith",
  project: "reciplease",
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

const baseConfig = {
  plugins: [tailwindcss(), tsconfigPaths()],
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
};

export default defineConfig((config) => {
  if (process.env.VITEST) {
    return baseConfig;
  }

  return {
    ...baseConfig,
    plugins: [...baseConfig.plugins, reactRouter(), sentryReactRouter(sentryConfig, config)],
  };
});
