import fs from "fs";
const version = process.env.NEXT_PUBLIC_VESIGN || Date.now().toString();
const sha = process.env.VERCEL_GIT_COMMIT_SHA || "dev";

fs.writeFileSync(
  "public/version.json",
  JSON.stringify({ version, sha_version: sha }, null, 2)
);
console.log("Generated public/version.json:", { version, sha_version: sha });