import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

createServer(async (request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  if (!['/', '/index.html', '/bask-demo/', '/bask-demo/index.html'].includes(path)) {
    response.writeHead(404).end('Not found');
    return;
  }
  try {
    const html = await readFile(new URL('../docs/index.html', import.meta.url));
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(html);
  } catch {
    response.writeHead(500).end('Run npm run encrypt to generate the preview.');
  }
}).listen(4173, '127.0.0.1', () => {
  console.log('Bask demo preview: http://localhost:4173');
});
