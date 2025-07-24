import * as Sentry from "@sentry/react-router";

export const {
  logger,
  addBreadcrumb,
  captureEvent,
  captureException,
  captureMessage,
  flush,
  startSpan,
  wrapServerAction,
  wrapServerLoader,
} = Sentry;
