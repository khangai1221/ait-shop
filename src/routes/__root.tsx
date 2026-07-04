import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useMatch,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { StoreProvider } from "../lib/store";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SafeClerkProvider } from "@/lib/auth.tsx";
import { I18nProvider } from "@/lib/i18n-provider";
import { LanguageProvider } from "@/lib/language";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-deep transition"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try again or head home.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-deep"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AIT Shop — Premium Sneakers & Athletic Footwear" },
      {
        name: "description",
        content:
          "Discover AIT Shop — modern sneakers for running, basketball, training and everyday style.",
      },
      { property: "og:title", content: "AIT Shop — Premium Sneakers & Athletic Footwear" },
      {
        property: "og:description",
        content:
          "Discover AIT Shop — modern sneakers for running, basketball, training and everyday style.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AIT Shop — Premium Sneakers & Athletic Footwear" },
      {
        name: "twitter:description",
        content:
          "Discover AIT Shop — modern sneakers for running, basketball, training and everyday style.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/64e1daea-d0fd-42e3-b2c9-fa9e6573937b/id-preview-7294e352--44d45575-7524-4df7-abfa-3a2a700bfa88.lovable.app-1781093633268.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/64e1daea-d0fd-42e3-b2c9-fa9e6573937b/id-preview-7294e352--44d45575-7524-4df7-abfa-3a2a700bfa88.lovable.app-1781093633268.png",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%230EA5E9'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial Black,sans-serif' font-size='18' font-weight='900' fill='white'>A</text></svg>",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LanguageProvider>
        <html lang="en">
          <head>
            <HeadContent />
          </head>
          <body>
            {children}
            <Scripts />
          </body>
        </html>
      </LanguageProvider>
    </I18nProvider>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isAdmin = useMatch({ from: "/admin", shouldThrow: false });
  return (
    <QueryClientProvider client={queryClient}>
      <SafeClerkProvider>
        <StoreProvider>
          <Toaster richColors position="top-right" />
          {isAdmin ? (
            <Outlet />
          ) : (
            <div className="min-h-screen flex flex-col overflow-x-clip w-full">
              <Navbar />
              <main className="flex-1">
                <Outlet />
              </main>
              <Footer />
            </div>
          )}
        </StoreProvider>
      </SafeClerkProvider>
    </QueryClientProvider>
  );
}
