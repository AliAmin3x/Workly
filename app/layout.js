import "./globals.css";

export const metadata = {
  title: "Workly — Job Board",
  description: "Discover and track job listings",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
