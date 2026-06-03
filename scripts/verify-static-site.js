const fs = require("fs");
const path = require("path");

const publishDir = path.join(__dirname, "..", "src", "casefit");
const requiredFiles = [
  "index.html",
  "privacy-policy.html",
  "terms-of-use.html",
  "sitemap.html",
  "sitemap.xml",
  "robots.txt",
  "_redirects",
  "casefit-wordmark-white.png",
  "favicon.svg",
  "favicon.ico",
  "favicon-16.png",
  "favicon-32.png",
  "favicon-64.png",
  "apple-touch-icon.png",
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "site.webmanifest",
  "casefit-app-preview.mp4",
];
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
    { needle: 'href="/favicon.svg"', label: "SVG favicon reference" },
    { needle: 'href="/favicon-32.png?v=4"', label: "PNG favicon reference" },
    { needle: 'href="/site.webmanifest?v=4"', label: "web manifest reference" },
    { needle: 'href="/privacy-policy"', label: "privacy policy footer link" },
    { needle: 'href="/terms-of-use"', label: "terms of use footer link" },
    { needle: 'href="/sitemap"', label: "site map footer link" },
    { needle: 'id="for-clients"', label: "clients section" },
    { needle: 'id="for-lawyers"', label: "lawyers section" },
    { needle: 'id="registeredThanks"', label: "success state markup" },
    { needle: 'src="/casefit-app-preview.mp4"', label: "app preview video" },
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
