// netlify/functions/get-users.ts
import type { Context } from "@netlify/functions";
import { type VerifyAuth0TokenResult, verifyAuth0Token } from "./auth.js";

export default async (request: Request, context: Context) => {
  let authResult: VerifyAuth0TokenResult;
  try {
    authResult = await verifyAuth0Token(request);
  } catch {
    return new Response("Authorization required", { status: 401 });
  }

  return Response.json({
    users: [
      { id: "1", email: "jennym91@gmail.com" },
      { id: "2", email: "example-user-2@example.com" },
    ],
  });
};
