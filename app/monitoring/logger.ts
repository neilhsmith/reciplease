import * as Sentry from "@sentry/react-router";

export const {
  addBreadcrumb,
  captureEvent,
  captureException,
  captureMessage,
  flush,
  startSpan,
  wrapServerAction,
  wrapServerLoader,
} = Sentry;
