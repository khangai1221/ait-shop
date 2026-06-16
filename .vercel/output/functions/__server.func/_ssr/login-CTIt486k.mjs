import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as SignIn, c as SignUp } from "../_libs/clerk__clerk-react.mjs";
import { d as Route$d } from "./router-DToCCjPL.mjs";
import "../_libs/sonner.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
function Login() {
  const {
    t
  } = useTranslation();
  const {
    mode: initialMode
  } = Route$d.useSearch();
  const [mode, setMode] = reactExports.useState(initialMode ?? "login");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[80vh] grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:block relative bg-gradient-to-br from-[#3FBAEB] to-[#1B8FCB] overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "absolute top-20 left-12 font-display text-white text-7xl", children: [
        "JOIN",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "AIRSTEP"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "absolute bottom-12 left-12 right-12 text-white/80 max-w-sm", children: t("login.memberPerks") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center p-6 lg:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex p-1 bg-muted rounded-full mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode("login"), className: `flex-1 h-10 rounded-full text-sm font-semibold transition ${mode === "login" ? "bg-background shadow" : "text-muted-foreground"}`, children: t("login.signIn") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode("register"), className: `flex-1 h-10 rounded-full text-sm font-semibold transition ${mode === "register" ? "bg-background shadow" : "text-muted-foreground"}`, children: t("login.register") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl", children: mode === "login" ? t("login.welcomeBack") : t("login.createAccount") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 text-sm", children: mode === "login" ? t("login.signInDesc") : t("login.registerDesc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: mode === "login" ? /* @__PURE__ */ jsxRuntimeExports.jsx(SignIn, { signUpUrl: "/login", fallbackRedirectUrl: "/profile", appearance: {
        elements: {
          formButtonPrimary: "w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition",
          card: "shadow-none p-0",
          formFieldInput: "w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand",
          footerActionText: "hidden",
          formFieldLabel: "text-xs uppercase tracking-wider text-muted-foreground"
        }
      } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SignUp, { signInUrl: "/login", fallbackRedirectUrl: "/profile", appearance: {
        elements: {
          formButtonPrimary: "w-full h-12 rounded-full bg-brand text-brand-foreground font-semibold hover:bg-brand-deep transition",
          card: "shadow-none p-0",
          formFieldInput: "w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand",
          footerActionText: "hidden",
          formFieldLabel: "text-xs uppercase tracking-wider text-muted-foreground"
        }
      } }) })
    ] }) })
  ] });
}
export {
  Login as component
};
