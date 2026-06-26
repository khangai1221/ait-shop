import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, Menu, X, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { SignedInWrapper, SignedOutWrapper, UserButton } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/language";

export function Navbar() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { cartCount, wishlist } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const links = [
    { to: "/", label: t("common.home") },
    { to: "/shop", label: t("common.shop") },
    { to: "/new-arrivals", label: t("common.newArrivals") },
    { to: "/contact", label: t("common.contact") },
  ] as const;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate({ to: "/search", search: { q } });
      setSearchOpen(false);
      setOpen(false);
    }
  };

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-lg border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-display text-xl tracking-tight shrink-0"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-lg shadow-brand/20 font-black text-white text-base select-none">
              A
            </span>
            <span className="text-ink font-bold hidden sm:inline">AIT Shop</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-muted-foreground hover:text-brand transition-colors"
                activeProps={{ className: "text-ink" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-0.5 sm:gap-1.5">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              aria-label={t("common.search")}
              className="touch-target p-2.5 sm:p-2 rounded-full hover:bg-muted active:bg-muted/80 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/wishlist"
              aria-label={t("common.wishlist")}
              className="relative touch-target p-2.5 sm:p-2 rounded-full hover:bg-muted active:bg-muted/80 transition-colors"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-brand text-brand-foreground text-[10px] font-bold grid place-items-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              aria-label={t("common.cart")}
              className="relative touch-target p-2.5 sm:p-2 rounded-full hover:bg-muted active:bg-muted/80 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-brand text-brand-foreground text-[10px] font-bold grid place-items-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
            <SignedOutWrapper>
              <Link
                to="/login"
                className="hidden md:inline-flex ml-1.5 sm:ml-2 px-4 py-2 text-sm font-semibold rounded-full border border-border hover:bg-muted active:bg-muted/80 transition"
              >
                {t("common.signIn")}
              </Link>
            </SignedOutWrapper>
            <SignedInWrapper>
              <UserButton afterSignOutUrl="/" />
            </SignedInWrapper>
            <button
              onClick={() => setLanguage(language === "mn" ? "en" : "mn")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-border hover:bg-muted transition"
              aria-label="Switch language"
            >
              <Globe className="h-3.5 w-3.5" />
              {language === "mn" ? "EN" : "МН"}
            </button>
            <button
              ref={hamburgerRef}
              onClick={() => setOpen((s) => !s)}
              aria-label="Menu"
              className="lg:hidden touch-target p-2.5 sm:p-2 rounded-full hover:bg-muted active:bg-muted/80 transition ml-0.5"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form onSubmit={submit} className="pb-4 animate-fade-in">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="w-full h-11 px-4 rounded-full border border-border bg-muted/40 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </form>
        )}
      </div>

      {/* Mobile slide-in menu */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/40 animate-fade-in" onClick={close} />
          <div
            ref={menuRef}
            className="fixed top-16 right-0 bottom-0 w-72 max-w-[85vw] bg-background border-l border-border animate-slide-up shadow-2xl flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={close}
                  className="block px-4 py-3.5 rounded-xl hover:bg-muted text-sm font-medium transition active:bg-muted/80"
                  activeProps={{ className: "bg-brand/10 text-brand font-semibold" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-border p-4 space-y-3">
              <button
                onClick={() => setLanguage(language === "mn" ? "en" : "mn")}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition w-full"
              >
                <Globe className="h-4 w-4" />
                {language === "mn" ? "English" : "Монгол"}
              </button>
              <Link
                to="/wishlist"
                onClick={close}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition"
              >
                <Heart className="h-4 w-4" />
                {t("common.wishlist")}
                {wishlist.length > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground">{wishlist.length}</span>
                )}
              </Link>
              <Link
                to="/cart"
                onClick={close}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition"
              >
                <ShoppingBag className="h-4 w-4" />
                {t("common.cart")}
                {cartCount > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground">{cartCount}</span>
                )}
              </Link>
              <SignedOutWrapper>
                <Link
                  to="/login"
                  onClick={close}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition"
                >
                  {t("common.signIn")}
                </Link>
              </SignedOutWrapper>
              <SignedInWrapper>
                <div className="px-4 py-3 flex justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedInWrapper>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
