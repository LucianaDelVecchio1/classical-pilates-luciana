import { notFound } from "next/navigation";

/** Cualquier ruta no reconocida dentro de un locale → 404 localizada. */
export default function CatchAllPage() {
  notFound();
}
