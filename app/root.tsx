import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import sharedStyles from "~/styles/shared.css?url";
import Error from "./components/util/Error";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const message = error.data ? error.data.message : "Data not Found";
    return (
      <main>
        <Error title={error.statusText}>
          <span>{error.status}</span>
          <p>{message}</p>
          <p>
            Back to <Link to={"/"}>Safety</Link>
          </p>
        </Error>
      </main>
    );
  }
  return (
    <main>
      <Error title={error.statusText}>
        <p>{error.data?.message}</p>
        <p>
          Back to <Link to={"/"}>Safety</Link>
        </p>
      </Error>
    </main>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: sharedStyles }];
}
