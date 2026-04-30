import { appFetch } from "./src/http/router";

const server = Bun.serve({
  port: Number(process.env.PORT ?? 3333),
  fetch: appFetch,
});

console.log(`API corriendo en http://localhost:${server.port}`);