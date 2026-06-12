import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";

export const metadata: Metadata = {
  title: {
    default: "éxodotech — escuela de programación",
    template: "%s | éxodotech",
  },
  description:
    "Escuela de programación y productividad con IA para el Austro ecuatoriano. Rutas claras, comunidad real.",
  metadataBase: new URL("https://exodotech.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
