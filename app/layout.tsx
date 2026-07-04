import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PodMotion — Kubernetes Pods Made Immortal",
  description:
    "Live-migrate running Kubernetes pods with memory, open files, and active TCP connections intact. No application changes. Proven on live PostgreSQL — zero failed transactions observed across 10 proof runs.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-pm-navy-950 min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
