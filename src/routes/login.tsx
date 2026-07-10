import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AuthPage } from "@/components/AuthPage";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ mode: z.enum(["login", "register"]).optional() }),
  head: () => ({ meta: [{ title: "Sign in — AIT Shop" }] }),
  component: Login,
});

function Login() {
  const { mode } = Route.useSearch();
  return <AuthPage initialMode={mode} />;
}
