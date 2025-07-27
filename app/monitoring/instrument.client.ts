import * as Sentry from "@sentry/react-router";

console.log("APP_ENV", import.meta.env.VITE_APP_ENV);
export function init() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE,

    _experiments: { enableLogs: true },
    sendDefaultPii: true,

    beforeSend(event) {
      if (event.request?.url) {
        const url = new URL(event.request.url);
        if (url.protocol === "chrome-extension:" || url.protocol === "moz-extension:") {
          return null;
        }
      }
      return event;
    },

    integrations: [
      Sentry.reactRouterTracingIntegration(),
      Sentry.browserProfilingIntegration(),
      Sentry.replayIntegration(),
      Sentry.consoleLoggingIntegration({
        levels: ["info", "warn", "error"],
      }),
    ],

    profilesSampleRate: 1.0,

    tracesSampleRate: 1.0,
    tracePropagationTargets: ["localhost", /^\//],

    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
