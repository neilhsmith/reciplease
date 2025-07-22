import * as Sentry from "@sentry/react-router";

export function init() {
  Sentry.init({
    dsn: import.meta.env.SENTRY_DSN,
    environment: import.meta.env.MODE,

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
      Sentry.browserTracingIntegration(),
      Sentry.browserProfilingIntegration(),
      Sentry.replayIntegration(),
    ],

    // Set profilesSampleRate to 1.0 to profile every transaction.
    // Since profilesSampleRate is relative to tracesSampleRate,
    // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
    // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
    // result in 25% of transactions being profiled (0.5*0.5=0.25)
    profilesSampleRate: 1.0,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
