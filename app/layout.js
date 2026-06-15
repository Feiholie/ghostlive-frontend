export const metadata = {
  title: "GhostLive AI",
  description: "GhostLive AI Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
