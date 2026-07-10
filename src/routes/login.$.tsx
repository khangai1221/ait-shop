import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/AuthPage";

export const Route = createFileRoute("/login/$")({
  head: () => ({ meta: [{ title: "Sign in — AIT Shop" }] }),
  component: () => <AuthPage />,
});
