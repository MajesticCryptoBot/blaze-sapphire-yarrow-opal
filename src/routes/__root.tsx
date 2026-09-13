import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SideBar, SiteNavProvider } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ThemeProvider } from "@/components/theme";
import { TickerBar } from "@/components/ticker-bar";
import appCss from "../styles.css?url";

const APP_NAME = "ASP News";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "ASP News — live market intelligence for crypto, macro, and AI.",
      },
      { name: "theme-color", content: "#09090b" },
      { name: "color-scheme", content: "dark light" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" data-theme="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("asp-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t;}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-bg text-foreground">
        <PreviewHostBridge />
        <AuthProvider>
          <ThemeProvider>
            <SiteNavProvider>
              <div className="flex min-h-dvh flex-col">
                <SiteHeader />
                <TickerBar />
                <div className="flex min-h-0 flex-1">
                  <SideBar />
                  <div className="min-w-0 flex-1">
                    <Outlet />
                    <SiteFooter />
                    <ScrollToTop />
                  </div>
                </div>
              </div>
            </SiteNavProvider>
          </ThemeProvider>
        </AuthProvider>
        <Scripts />
        <Analytics />
      </body>
    </html>
  ),
});
