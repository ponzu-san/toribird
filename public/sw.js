self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// fetch ハンドラの登録自体が、ブラウザの「インストール可能」判定条件になるため設置している
self.addEventListener("fetch", () => {});
