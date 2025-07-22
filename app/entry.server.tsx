import { contentSecurity } from "@nichtsam/helmet/content";
import { createReadableStreamFromReadable } from "@react-router/node";
import { getMetaTagTransformer, wrapSentryHandleRequest } from "@sentry/react-router";
import * as Sentry from "@sentry/react-router";
import { isbot } from "isbot";
import crypto from "node:crypto";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { type AppLoadContext, type EntryContext, ServerRouter } from "react-router";
import { type HandleErrorFunction } from "react-router";

import { NonceProvider } from "@/core/lib/nonce";

export const streamTimeout = 5000;

const MODE = process.env.NODE_ENV ?? "development";

const handleRequest = function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
): Promise<Response> {
  const callbackName = isbot(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady";
  const nonce = crypto.randomBytes(16).toString("hex");

  return new Promise((resolve, reject) => {
    let didError = false;
    // NOTE: this timing will only include things that are rendered in the shell
    // and will not include suspended components and deferred loaders
    // const timings = makeTimings('render', 'renderToPipeableStream')

    const { pipe, abort } = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <ServerRouter nonce={nonce} context={reactRouterContext} url={request.url} />
      </NonceProvider>,
      {
        [callbackName]: () => {
          const body = new PassThrough();
          responseHeaders.set("Content-Type", "text/html");
          //responseHeaders.append('Server-Timing', timings.toString())

          if (process.env.SENTRY_DSN) {
            responseHeaders.append("Document-Policy", "js-profiling");
          }

          contentSecurity(responseHeaders, {
            crossOriginEmbedderPolicy: false,
            contentSecurityPolicy: {
              // NOTE: Remove reportOnly when you're ready to enforce this CSP
              reportOnly: true,
              directives: {
                fetch: {
                  "connect-src": [
                    MODE === "development" ? "ws:" : undefined,
                    process.env.SENTRY_DSN ? "*.sentry.io" : undefined,
                    "'self'",
                  ],
                  "font-src": ["'self'", "https://fonts.gstatic.com"],
                  "frame-src": ["'self'"],
                  "img-src": ["'self'", "data:"],
                  "script-src": ["'strict-dynamic'", "'self'", `'nonce-${nonce}'`],
                  "script-src-attr": [`'nonce-${nonce}'`],
                },
              },
            },
          });

          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(getMetaTagTransformer(body));
        },
        onShellError: (err: unknown) => {
          reject(err);
        },
        onError: () => {
          didError = true;
        },
        nonce,
      },
    );

    setTimeout(abort, streamTimeout + 5000);
  });
};

// wrap the default export
export default wrapSentryHandleRequest(handleRequest);

export const handleError: HandleErrorFunction = (error, { request }) => {
  // React Router may abort some interrupted requests, don't log those
  if (!request.signal.aborted) {
    Sentry.captureException(error);
    // optionally log the error so you can see it
    console.error(error);
  }
};
