import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, useRouteError } from "react-router";

import { Button } from "@/core/components/ui/button";

export function loader() {
  throw new Response("Not Found", { status: 404 });
}

export function action() {
  throw new Response("Not Found", { status: 404 });
}

export default function NotFoundRoute() {
  // due to the loader, this component will never be rendered, but we'll render the error boundary just in case
  return <ErrorBoundary />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.error("Route error:", error);
    }
  }, [error]);

  return (
    <main>
      <section>
        <h1>Oops!</h1>
        <p>We couldn&apos;t find the page you were looking for.</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft /> Go Home
          </Link>
        </Button>
      </section>
    </main>
  );
}
