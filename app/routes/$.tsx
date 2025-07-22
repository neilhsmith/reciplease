import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useMatch, useNavigate } from "react-router";

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
  const location = useLocation();
  const navigate = useNavigate();

  // Compute the parent path
  const path = location.pathname;
  let parentPath = "/";
  if (path !== "/") {
    // Remove trailing slash if present
    const trimmed = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
    const segments = trimmed.split("/");
    if (segments.length > 2) {
      parentPath = segments.slice(0, -1).join("/") || "/";
    }
  }

  // Use useMatch to check if the parent path is a valid route (not home)
  // If parentPath is not "/" and matches a route, show Go Back, else Go Home
  const parentMatch = useMatch(parentPath);

  const canGoBack = path !== "/" && parentPath !== "/" && parentPath !== path && parentMatch;

  return (
    <main>
      <section>
        <h1>Oops!</h1>
        <p>We couldn&apos;t find the page you were looking for.</p>
        {canGoBack ? (
          <Button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft /> Go Back
          </Button>
        ) : (
          <Button asChild>
            <Link to="/">
              <ArrowLeft /> Go Home
            </Link>
          </Button>
        )}
      </section>
    </main>
  );
}
