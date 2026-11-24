import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PodMotion — Kubernetes Pods Made Immortal: Live Migration & Cross-Platform Portability",
  description:
    "PodMotion is an experimental open-source Kubernetes project built primarily by Claude and other large language models with human direction and review. Its alpha checkpoint/restore engine explores live pod migration and pod IP preservation; Vethyam is a new CNI under design to help facilitate pod IP preservation. Production guarantees are not claimed.",
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
