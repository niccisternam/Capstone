import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const installationMarker = "node_modules/.package-lock.json";

if (!existsSync(installationMarker)) {
  console.log("Dependencias no encontradas. Ejecutando npm install antes de iniciar...");

  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npmCommand, ["install"], { stdio: "inherit" });

  if (result.error) {
    console.error("No fue posible iniciar npm install:", result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
