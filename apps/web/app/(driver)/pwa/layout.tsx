import "@/app/globals.css";

export default function PWALayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100">
        <div className="pwa-container">{children}</div>
      </body>
    </html>
  );
}
