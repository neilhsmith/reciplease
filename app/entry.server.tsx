import { createReadableStreamFromReadable } from "@react-router/node";
import { getMetaTagTransformer, wrapSentryHandleRequest } from "@sentry/react-router";
import * as Sentry from "@sentry/react-router";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { type AppLoadContext, type EntryContext, ServerRouter } from "react-router";
import { type HandleErrorFunction } from "react-router";

const botRegex =
  /bot|crawler|spider|crawling|facebookexternalhit|slurp|bingpreview|python-requests|wget|curl|scrapy|feedfetcher|google|yahoo|pinterest|discordbot|twitterbot|mediapartners-google/i;

export const streamTimeout = 5000;

const handleRequest = function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");

    const isBot = typeof userAgent === "string" && botRegex.test(userAgent);
    const isSpaMode = !!(routerContext as { isSpaMode?: boolean }).isSpaMode;

    const readyOption = isBot || isSpaMode ? "onAllReady" : "onShellReady";

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          if (process.env.SENTRY_DSN) {
            responseHeaders.append("Document-Policy", "js-profiling");
          }

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          // this enables distributed tracing between client and server
          pipe(getMetaTagTransformer(body));
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          // eslint-disable-next-line no-param-reassign
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        },
      },
    );

    // Abort the rendering stream after the `streamTimeout`
    setTimeout(abort, streamTimeout);
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
