import { nodeProfilingIntegration } from "@sentry/profiling-node";
import * as Sentry from "@sentry/react-router";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  _experiments: { enableLogs: true },
  sendDefaultPii: true,

  denyUrls: [
    /\/resources\/healthcheck/,
    /\/build\//,
    /\/favicons\//,
    /\/img\//,
    /\/fonts\//,
    /\/favicon.ico/,
    /\/site\.webmanifest/,
  ],

  integrations: [Sentry.httpIntegration(), nodeProfilingIntegration()],

  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
});
