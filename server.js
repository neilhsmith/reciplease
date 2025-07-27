import * as Sentry from "@sentry/react-router";
import { ip as ipAddress } from "address";
import closeWithGrace from "close-with-grace";
import compression from "compression";
import express from "express";
import getPort, { portNumbers } from "get-port";
import { styleText } from "node:util";

const MODE = process.env.NODE_ENV ?? "development";
const IS_DEV = MODE === "development";
const BUILD_PATH = "./build/server/index.js";
const PORT = Number.parseInt(process.env.PORT || "3000");
const SENTRY_ENABLED = !!process.env.VITE_SENTRY_DSN;

const app = express();

app.use(compression());
app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const log = `${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs.toFixed(2)} ms`;

    console.log(log);
  });

  next();
});
app.disable("x-powered-by");

// app.get("*", (req, res, next) => {
//   if (req.path.endsWith("/") && req.path.length > 1) {
//     const query = req.url.slice(req.path.length);
//     const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
//     res.redirect(302, safepath + query);
//   } else {
//     next();
//   }
// });

if (IS_DEV) {
  console.log("Starting development server");
  const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    }),
  );
  app.use(viteDevServer.middlewares);
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule("./server/app.ts");
      return await source.app(req, res, next);
    } catch (error) {
      if (typeof error === "object" && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
} else {
  console.log("Starting production server");
  app.use("/assets", express.static("build/client/assets", { immutable: true, maxAge: "1y" }));
  app.use(express.static("build/client", { maxAge: "1h" }));
  app.use(await import(BUILD_PATH).then((mod) => mod.app));
}

const portToUse = await getPort({
  port: portNumbers(PORT, PORT + 100),
});
const portAvailable = PORT === portToUse;
if (!portAvailable && !IS_DEV) {
  console.log(`⚠️ Port ${PORT} is not available.`);
  process.exit(1);
}

const server = app.listen(portToUse, () => {
  if (!portAvailable) {
    console.warn(
      styleText("yellow", `⚠️  Port ${PORT} is not available, using ${portToUse} instead.`),
    );
  }

  console.log(`🚀  We have liftoff!`);
  const localUrl = `http://localhost:${portToUse}`;
  let lanUrl = null;
  const localIp = ipAddress() ?? "Unknown";
  // Check if the address is a private ip
  // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
  // https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/WebpackDevServerUtils.js#LL48C9-L54C10
  if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
    lanUrl = `http://${localIp}:${portToUse}`;
  }

  console.log(
    `
${styleText("bold", "Local:")}            ${styleText("cyan", localUrl)}
${lanUrl ? `${styleText("bold", "On Your Network:")}  ${styleText("cyan", lanUrl)}` : ""}
${styleText("bold", "Press Ctrl+C to stop")}
		`.trim(),
  );
});

closeWithGrace(async ({ err }) => {
  await new Promise((resolve, reject) => {
    server.close((e) => (e ? reject(e) : resolve("ok")));
  });
  if (err) {
    console.error(styleText("red", String(err)));
    console.error(styleText("red", String(err.stack)));
    if (SENTRY_ENABLED) {
      Sentry.captureException(err);
      await Sentry.flush(500);
    }
  }
});
