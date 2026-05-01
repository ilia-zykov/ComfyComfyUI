/**
 * Кастомный HTTP-сервер для Next.js. Нужен ради WebSocket-проксирования
 * на ComfyUI: его DNS-rebinding защита блокирует Origin, отличающийся от
 * собственного host:port. Поэтому WS идёт через тот же порт, что и фронт,
 * а server.js делает upgrade-проксирование с подменой Origin.
 */
const { createServer } = require('node:http');
const { parse } = require('node:url');
const next = require('next');
const httpProxy = require('http-proxy');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const COMFY_HTTP = process.env.COMFY_BASE_URL || 'http://127.0.0.1:8188';
const COMFY_WS = COMFY_HTTP.replace(/^http/, 'ws');

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const wsProxy = httpProxy.createProxyServer({
  target: COMFY_WS,
  ws: true,
  changeOrigin: true,
  ignorePath: false,
});

wsProxy.on('proxyReqWs', (proxyReq) => {
  // Подменяем Origin на host самого Comfy — обходим его проверку.
  try {
    proxyReq.setHeader('Origin', COMFY_HTTP);
  } catch {
    /* setHeader недоступен после отправки */
  }
});

wsProxy.on('error', (err, _req, socket) => {
  console.error('[ws-proxy]', err.message);
  if (socket && typeof socket.destroy === 'function') socket.destroy();
});

app.prepare().then(() => {
  const upgradeHandler =
    typeof app.getUpgradeHandler === 'function' ? app.getUpgradeHandler() : null;

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.on('upgrade', (req, socket, head) => {
    const { pathname } = parse(req.url || '/');
    if (pathname && pathname.startsWith('/api/comfy/ws')) {
      // Перепишем path на ComfyUI'шный /ws, сохраняя query (clientId).
      const search = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
      req.url = '/ws' + search;
      wsProxy.ws(req, socket, head, { target: COMFY_WS });
      return;
    }
    // Всё остальное (включая /_next/webpack-hmr) — внутренние WS Next.js.
    if (upgradeHandler) {
      upgradeHandler(req, socket, head);
    } else {
      // У Next.js нет getUpgradeHandler — оставим открытым, не разрываем.
      // (HMR в этом случае не сработает, но dev переживёт.)
    }
  });

  server.listen(port, hostname, () => {
    console.log(`> Comfy Panel ready on http://localhost:${port}`);
    console.log(`> Proxying WS  /api/comfy/ws  →  ${COMFY_WS}/ws`);
    console.log(`> Proxying REST /api/comfy/*  →  ${COMFY_HTTP}/*`);
  });
});
