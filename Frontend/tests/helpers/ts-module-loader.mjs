import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

// Permite importar módulos .ts del frontend desde pruebas node:test sin dependencias extra.
// Requiere Node.js con type stripping nativo (22.18+ o 24+).
// Los imports relativos del código fuente no llevan extensión, así que se resuelven a .ts.

const PROJECT_ROOT = fileURLToPath(new URL("../../", import.meta.url));
let registered = false;

function isRelativeSpecifier(specifier) {
  return specifier.startsWith("./") || specifier.startsWith("../");
}

function ensureRegistered() {
  if (registered) return;
  registered = true;
  registerHooks({
    resolve(specifier, context, nextResolve) {
      try {
        return nextResolve(specifier, context);
      } catch (error) {
        const notFound = error?.code === "ERR_MODULE_NOT_FOUND" || error?.code === "MODULE_NOT_FOUND";
        if (!notFound || !isRelativeSpecifier(specifier) || !context.parentURL) throw error;
        const candidate = new URL(`${specifier}.ts`, context.parentURL);
        if (!existsSync(fileURLToPath(candidate))) throw error;
        return nextResolve(candidate.href, context);
      }
    },
  });
}

export async function loadTsModule(relativePath) {
  ensureRegistered();
  const absolutePath = path.resolve(PROJECT_ROOT, relativePath);
  return import(pathToFileURL(absolutePath).href);
}
