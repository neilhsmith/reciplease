import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { type MockInstance, afterEach, beforeEach, expect, vi } from "vitest";

expect.extend(matchers);

afterEach(() => cleanup());

export let consoleError: MockInstance<(typeof console)["error"]>;
export let consoleWarn: MockInstance<(typeof console)["warn"]>;

beforeEach(() => {
  const originalConsoleError = console.error;
  consoleError = vi.spyOn(console, "error");
  consoleError.mockImplementation((...args: Parameters<typeof console.error>) => {
    originalConsoleError(...args);
    throw new Error(
      "Console error was called. Call consoleError.mockImplementation(() => {}) if this was expected.",
    );
  });

  const originalConsoleWarn = console.warn;
  consoleWarn = vi.spyOn(console, "warn");
  consoleWarn.mockImplementation((...args: Parameters<typeof console.warn>) => {
    originalConsoleWarn(...args);
    throw new Error(
      "Console warn was called. Call consoleWarn.mockImplementation(() => {}) if this was expected.",
    );
  });
});
