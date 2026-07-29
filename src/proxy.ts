import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Excluir API, assets internos y ficheros estáticos.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
