export const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });

export const errorJson = (message: string, status = 400, details?: unknown) =>
  json(
    {
      error: message,
      details,
    },
    status,
  );
