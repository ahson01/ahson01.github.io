"use client";

import "./globals.css";
import "./stars.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Ahson's portfolio</title>
      </head>
      <body>
        <div className="absolute top-[-100vh]">
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
