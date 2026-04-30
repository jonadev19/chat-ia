const server = Bun.serve({
  port: Number(process.env.PORT ?? 3333),
  fetch(req) {
    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/health") {
      return Response.json({
        status: "ok",
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`API corriendo en http://localhost:${server.port}`);