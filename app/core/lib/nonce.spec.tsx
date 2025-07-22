import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NonceProvider, useNonce } from "./nonce";

function NonceConsumer() {
  const nonce = useNonce();
  return <span data-testid="nonce-value">{nonce}</span>;
}

describe("nonce context and useNonce hook", () => {
  it("provides the nonce value to consumers", () => {
    render(
      <NonceProvider value="test-nonce">
        <NonceConsumer />
      </NonceProvider>,
    );
    expect(screen.getByTestId("nonce-value").textContent).toBe("test-nonce");
  });

  it("does not throw if useNonce is used outside of provider", () => {
    expect(() => render(<NonceConsumer />)).not.toThrow();
  });

  it("updates nonce value when provider value changes", () => {
    const { rerender } = render(
      <NonceProvider value="first-nonce">
        <NonceConsumer />
      </NonceProvider>,
    );
    expect(screen.getByTestId("nonce-value").textContent).toBe("first-nonce");
    rerender(
      <NonceProvider value="second-nonce">
        <NonceConsumer />
      </NonceProvider>,
    );
    expect(screen.getByTestId("nonce-value").textContent).toBe("second-nonce");
  });
});
