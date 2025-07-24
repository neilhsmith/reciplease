import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

if (import.meta.env.VITE_SENTRY_DSN) {
  void import("./monitoring/monitoring.client").then(({ init }) => init());
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
