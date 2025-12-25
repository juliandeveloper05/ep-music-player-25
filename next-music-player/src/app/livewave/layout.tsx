import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LIVEWAVE | DJ Sessions en Vivo",
  description:
    "La plataforma donde todos somos iguales. Escucha sesiones de DJ en vivo, conecta con la comunidad, y descubre música experimental y electrónica de todo el mundo.",
  keywords: [
    "DJ",
    "música en vivo",
    "sesiones",
    "electrónica",
    "experimental",
    "streaming musical",
  ],
};

export default function LiveWaveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
