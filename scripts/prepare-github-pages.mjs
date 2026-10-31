import { access, copyFile, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("dist/client");
const indexPath = path.join(outDir, "index.html");

try {
  await access(indexPath);
} catch {
  const listing = await readdir(outDir).catch(() => []);
  throw new Error(
    `GitHub Pages build did not write ${indexPath}. Found: ${listing.join(", ") || "(directory missing)"}`,
  );
}

const html = await readFile(indexPath, "utf8");
if (!html.includes("/bembel/")) {
  throw new Error("index.html has no /bembel/ asset URLs. The Pages base path was not applied.");
}

await copyFile(indexPath, path.join(outDir, "404.html"));
await writeFile(path.join(outDir, ".nojekyll"), "");
console.log("Prepared dist/client for GitHub Pages (404.html, .nojekyll).");
