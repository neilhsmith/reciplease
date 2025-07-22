import { describe, expect, it } from "vitest";

import { cn } from "./ui";

describe("cn", () => {
  // Mock tailwind-merge and clsx for isolated testing if needed, but here we test integration

  it("returns a single class as is", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("merges multiple classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles falsy values", () => {
    expect(cn("foo", false, null, undefined, "", 0)).toBe("foo");
  });

  it("merges tailwind classes correctly", () => {
    // tailwind-merge should resolve conflicts, e.g. bg-red-500 vs bg-blue-500
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("handles objects and arrays (clsx features)", () => {
    expect(cn(["foo", { bar: true, baz: false }])).toBe("foo bar");
  });

  it("returns an empty string if no valid classes", () => {
    expect(cn()).toBe("");
    expect(cn(null, undefined, false, 0, "")).toBe("");
  });
});
