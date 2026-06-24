import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ mode: z.enum(["login", "register"]).optional() }),
   head: () => ({ meta: [{ title: "Sign in — AIT Shop" }] }),
  component: Login,
});

function Login() {
  const { t } = useTranslation();
  const { mode: initialMode } = Route.useSearch();
  const [mode, setMode] = useState<"login" | "register">(initialMode ?? "login");
  return (
    <div className="min-h-[80vh] grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-gradient-to-br from-[#3FBAEB] to-[#1B8FCB] overflow-hidden">
        <h2 className="absolute top-20 left-12 font-display text-white text-7xl">
          AIT
          <br />
          SHOP
        </h2>
        <p className="absolute bottom-12 left-12 right-12 text-white/80 max-w-sm">
          {t("login.memberPerks")}
        </p>
      </div>
      <div className="grid place-items-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex p-1 bg-muted rounded-full mb-8">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 h-10 rounded-full text-sm font-semibold transition ${mode === "login" ? "bg-background shadow" : "text-muted-foreground"}`}
            >
              {t("login.signIn")}
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 h-10 rounded-full text-sm font-semibold transition ${mode === "register" ? "bg-background shadow" : "text-muted-foreground"}`}
            >
              {t("login.register")}
            </button>
          </div>
          <h1 className="font-display text-3xl">
            {mode === "login" ? t("login.welcomeBack") : t("login.createAccount")}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {mode === "login" ? t("login.signInDesc") : t("login.registerDesc")}
          </p>

          <div className="mt-8">
            {mode === "login" ? (
              <SignIn
                signUpUrl="/login"
                fallbackRedirectUrl="/profile"
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition",
                    card: "shadow-none p-0",
                    formFieldInput:
                      "w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand",
                    footerActionText: "hidden",
                    formFieldLabel: "text-xs uppercase tracking-wider text-muted-foreground",
                  },
                }}
              />
            ) : (
              <SignUp
                signInUrl="/login"
                fallbackRedirectUrl="/profile"
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition",
                    card: "shadow-none p-0",
                    formFieldInput:
                      "w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand",
                    footerActionText: "hidden",
                    formFieldLabel: "text-xs uppercase tracking-wider text-muted-foreground",
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
