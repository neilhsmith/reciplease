import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  [
    globalIgnores(["./certs", "./.react-router", "coverage/*"]),
    {
      files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      plugins: { js },
      extends: ["js/recommended"],
    },
    {
      files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat["jsx-runtime"],
    pluginReactHooks.configs["recommended-latest"],
    pluginJsxA11y.flatConfigs.recommended,
    {
      files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      settings: {
        react: {
          version: "detect",
        },
        "jsx-a11y": {
          components: {
            // Button: "button"
          },
        },
      },
    },
  ],
  eslintConfigPrettier,
);
