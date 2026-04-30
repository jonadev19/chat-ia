import { errorJson, json } from "./responses";
import { handleChatRoute } from "../routes/chat";

export const appFetch = async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/health") {
    return json({ status: "ok" });
  }

  if (req.method === "POST" && url.pathname === "/chat") {
    try {
      return await handleChatRoute(req);
    } catch (error) {
      return errorJson("Error interno", 500, {
        message: error instanceof Error ? error.message : "unknown_error",
      });
    }
  }

  return errorJson("Not Found", 404);
};
