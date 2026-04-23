import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-blood glow-blood">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Case file not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This evidence has been moved or never existed.</p>
        <div className="mt-6">
          <a href="/" className="inline-flex items-center justify-center rounded-md bg-gradient-blood px-4 py-2 text-sm font-medium text-primary-foreground shadow-blood">
            Return to HQ
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Code of Crime — Interactive Forensic Learning" },
      { name: "description", content: "Solve simulated crime cases. Learn forensics through interactive investigation. By Annexra Pvt. Ltd." },
      { property: "og:title", content: "Code of Crime — Interactive Forensic Learning" },
      { property: "og:description", content: "LeetCode for forensics. Solve cases, analyze evidence, master the science." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
