import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const port = 4321;
const webRoot = join(process.cwd(), "web");

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

const server = createServer((request, response) => {
  const requestedPath = request.url === "/" ? "/index.html" : request.url ?? "/index.html";
  const filePath = normalize(join(webRoot, requestedPath));

  if (!filePath.startsWith(webRoot) || !existsSync(filePath)) {
    response.writeHead(404);
    response.end("Archivo no encontrado");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypes[extname(filePath)] ?? "text/plain; charset=utf-8"
  });

  createReadStream(filePath).pipe(response);
});

server.listen(port, () => {
  console.log(`Frontend disponible en http://localhost:${port}`);
});
