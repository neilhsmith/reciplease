import {
  addBreadcrumb,
  captureMessage,
  wrapServerAction,
  wrapServerLoader,
} from "@/monitoring/logger";
import { Welcome } from "@/welcome/welcome";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader = wrapServerLoader(
  {
    name: "home-loader",
  },
  async ({ context }) => {
    //throw new Error("testing thrown error from loader ppp");
    console.log("context", context);
    captureMessage("testing captureMessage from loader bbbb");
    return {};
  },
);

export const action = wrapServerAction(
  {
    name: "home-action",
  },
  async () => {
    return {};
  },
);

// export const loader = () => {
//   Sentry.captureMessage("testing captureMessage from loader 2");
// };

export default function Home() {
  return (
    <>
      <Welcome />
      <button
        onClick={() => {
          //captureMessage("testing captureMessage from onClick event bbbb");
          addBreadcrumb({
            category: "test",
            message: "test breadcrumb",
            level: "info",
          });
        }}
      >
        asdfasdf
      </button>
      <button
        onClick={() => {
          throw new Error("some error");
        }}
      >
        gggg
      </button>
    </>
  );
}
