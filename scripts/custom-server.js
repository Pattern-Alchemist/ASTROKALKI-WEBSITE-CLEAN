// Custom server that keeps alive between requests
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, "0.0.0.0", () => {
    console.log("> Server listening on http://0.0.0.0:3000");
  });

  // Keep process alive
  setInterval(() => {}, 60000);
});
