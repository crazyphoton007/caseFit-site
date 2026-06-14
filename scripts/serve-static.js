const fs = require("fs");
const http = require("http");
const path = require("path");

const host = "127.0.0.1";
const port = Number(process.env.PORT) || 3000;
const publishDir = path.join(__dirname, "..", "src", "casefit");
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

function resolvePath(urlPath) {
  const normalized = decodeURIComponent(urlPath.split("?")[0]);
  const requested = normalized === "/" ? "/index.html" : normalized;
  const safePath = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publishDir, safePath);

  if (!filePath.startsWith(publishDir)) {
    return path.join(publishDir, "index.html");
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }

  const htmlPath = `${filePath}.html`;
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    return htmlPath;
  }

  return path.join(publishDir, "index.html");
}

const server = http.createServer((req, res) => {
    const filePath = resolvePath(req.url || "/");
    const ext = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[ext] || "application/octet-stream";

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Internal server error");
        return;
      }

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });

server.on("error", (error) => {
  if (error && typeof error === "object" && "code" in error) {
    console.error(`Unable to start local server on http://${host}:${port} (${error.code}).`);
    process.exit(1);
  }

  console.error("Unable to start local server.");
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`caseFit static site available at http://${host}:${port}`);
});
