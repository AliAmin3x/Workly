import "./globals.css";

export const metadata = {
  title: "Workly",
  description: "Job tracking and discovery app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
