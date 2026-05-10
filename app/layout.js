import "./globals.css";

export const metadata = {
  title: "Workly",
  description: "Job board application - find and manage jobs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
