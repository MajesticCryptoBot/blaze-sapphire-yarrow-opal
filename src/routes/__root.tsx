import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SideBar, SiteNavProvider } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ThemeProvider } from "@/components/theme";
import { TickerBar } from "@/components/ticker-bar";
import { LanguageProvider } from "@/lib/language";
import appCss from "../styles.css?url";

const APP_NAME = "ASP News";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "ASP News — live market intelligence for crypto, macro, and AI.",
      },
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
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("asp-theme");if(t!=="light"&&t!=="dark")t="dark";var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t;if(t==="light"){r.style.backgroundColor="#f5f5f7";r.style.setProperty("--color-bg","#f5f5f7");r.style.setProperty("--color-surface","#ffffff");r.style.setProperty("--color-elevated","#f2f2f7");r.style.setProperty("--color-foreground","#1d1d1f");r.style.setProperty("--color-muted","#6e6e73");r.style.setProperty("--color-subtle","#86868b");r.style.setProperty("--color-border","#d2d2d7");r.style.setProperty("--color-primary","#1d1d1f");r.style.setProperty("--chrome-fill","rgba(255,255,255,0.72)");r.style.setProperty("--chrome-drawer","rgba(255,255,255,0.86)");r.style.setProperty("--chrome-line","rgba(0,0,0,0.08)");r.style.setProperty("--search-fill","rgba(0,0,0,0.05)");r.style.setProperty("--color-azure","#0071e3");}else{r.style.backgroundColor="#0b0b0d";}function meta(n,c){var m=document.querySelector('meta[name="'+n+'"]');if(!m){m=document.createElement("meta");m.setAttribute("name",n);document.head.appendChild(m);}m.setAttribute("content",c);}meta("theme-color",t==="light"?"#f5f5f7":"#0b0b0d");meta("color-scheme",t);meta("apple-mobile-web-app-status-bar-style",t==="light"?"default":"black-translucent");}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-bg text-foreground">
        <PreviewHostBridge />
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
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
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
