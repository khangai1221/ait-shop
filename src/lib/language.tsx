import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { i18n } from "./i18n-provider";

type Language = "mn" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "mn",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start with "mn" — i18n is initialized synchronously with "mn" via initImmediate:false,
  // so server and client first render both produce Mongolian. No hydration mismatch.
  const [language, setLanguageState] = useState<Language>("mn");

  useEffect(() => {
    // Ensure i18n is in sync after mount (handles any edge cases)
    if (i18n.language !== "mn") {
      i18n.changeLanguage("mn");
    }

    const handlePopState = () => {
      const path = window.location.pathname;
      const lang: Language = path.startsWith("/en") ? "en" : "mn";
      setLanguageState(lang);
      i18n.changeLanguage(lang);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    const currentPath = window.location.pathname;
    let newPath: string;

    if (lang === "mn") {
      newPath = currentPath.replace(/^\/en/, "/mn");
      if (!newPath.startsWith("/mn")) {
        newPath = "/mn" + currentPath;
      }
    } else {
      newPath = currentPath.replace(/^\/mn/, "/en");
      if (!newPath.startsWith("/en")) {
        newPath = "/en" + currentPath;
      }
    }

    window.history.pushState({}, "", newPath);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
