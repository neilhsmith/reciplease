# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm dev
```

Your application will be available at `http://localhost:3000`.

## Building for Production

Create a production build:

```bash
pnpm build
```

## Logging / Monitoring

Import the logging utils from `@/monitoring/logger`:

```
import {
  logger,
  addBreadcrumb,
  captureEvent,
  captureException,
  captureMessage,
  flush,
  startSpan,
  wrapServerAction,
  wrapServerLoader
} from "@/monitoring/logger";
```

Thrown exceptions, client and server side, will be captured. Console logs will also be captured following these rules - server (all console output), client (info, warn, error).

Forward caught exceptions with `captureException`.

```
try {
  throw new Exception("some error");
} catch (error) {
  // ...
  captureException(error);
}
```

Wrap server actions and loaders to assign a span to the action or loader.

```
export const loader = wrapServerLoader({ name: "some-loader" },
  async () => {
    return {};
  }
);

export const action = wrapServerAction({ name: "some-action" },
  async () => {
    return {};
  }
);

```

Use `addBreadcrumb` to add information about steps that happened prior to an event.

```

addBreadcrumb({
  category: "auth",
  message: "User clicked login link",
  level: "info"
})

```

`captureMessage` sends a custom message to Sentry as an informational log or warning. Messages show up as issues on your issue stream.

```

captureMessage("Something went wrong");
captureMessage("Something went very wrong", "fatal");

```

`startSpan` to manually start a span for actions you wish to record:

```
const result = await startSpan({ name: "Important Function" },
  async () => {
    const res = await doSomethingAsync();
    return updateRes(res);
  }
);

```

A typical logger is available:

```
logger.debug("some message...", { foo: bar });
logger.error("some message...", { foo: bar });
logger.fatal("some message...", { foo: bar });
logger.fmt("some message...", { foo: bar });
logger.info("some message...", { foo: bar });
logger.trace("some message...", { foo: bar });
logger.warn("some message...", { foo: bar });
```
