const fs = require("fs");
const path = require("path");

const publishDir = path.join(__dirname, "..", "src", "casefit");
const requiredFiles = ["index.html", "_redirects", "casefit-wordmark-white.png", "favicon.ico"];
const htmlPath = path.join(publishDir, "index.html");

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

for (const file of requiredFiles) {
  const filePath = path.join(publishDir, file);
  if (!fs.existsSync(filePath)) {
    fail(`Missing required publish asset: ${path.relative(process.cwd(), filePath)}`);
  }
}

if (fs.existsSync(htmlPath)) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const checks = [
    { needle: 'name="form-name" value="register"', label: "Netlify form marker" },
    { needle: 'href="/favicon.ico"', label: "favicon reference" },
    { needle: 'id="registeredThanks"', label: "success state markup" },
  ];

  for (const check of checks) {
    if (!html.includes(check.needle)) {
      fail(`Missing ${check.label} in ${path.relative(process.cwd(), htmlPath)}`);
    }
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("Static site verification passed.");
