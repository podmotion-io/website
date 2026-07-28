import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PodMotion — Kubernetes Pods Made Immortal: Live Migration & Cross-Platform Portability",
  description:
    "PodMotion is one checkpoint/restore engine built for two goals: live-migrate a running Kubernetes pod between nodes with its TCP connections intact, and move containers between hosting platforms (AWS ECS ↔ EC2/Docker, EKS ↔ EC2) or restore from a full backup. Live migration is proven on a real multi-node cluster (single held connection, byte-exact seq_delta=0); cross-platform portability and backup/restore are architected but not yet implemented. v0.1.0-alpha, CRD-only.",
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
