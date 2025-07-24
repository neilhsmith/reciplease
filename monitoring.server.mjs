import "dotenv/config";

import { nodeProfilingIntegration } from "@sentry/profiling-node";
import * as Sentry from "@sentry/react-router";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_APP_ENV ?? process.env.NODE_ENV,

  _experiments: { enableLogs: true },
  sendDefaultPii: true,

  integrations: [nodeProfilingIntegration(), Sentry.consoleLoggingIntegration()],

  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
});
