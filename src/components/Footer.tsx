import { Link } from "@tanstack/react-router";
import { Twitter, Facebook, Youtube, Instagram, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:border-0 border-b border-white/10 md:pb-0 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="md:cursor-default flex w-full items-center justify-between md:pointer-events-none py-3 md:py-0"
      >
        <h4 className="font-display text-lg">{title}</h4>
        <ChevronDown
          className={`h-4 w-4 text-white/50 md:hidden transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`md:block overflow-hidden transition-all duration-300 ${open ? "max-h-96 mt-3" : "max-h-0 md:max-h-96 md:mt-3"}`}
      >
        {children}
      </div>
    </div>
  );
}

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-16 md:mt-24 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid gap-8 sm:gap-10 md:grid-cols-4">
        <FooterSection title={t("common.stores")}>
          <ul className="space-y-2.5 text-sm text-white/70 pb-2">
            <li>
              <Link to="/find-store" className="hover:text-white transition">
                {t("common.findStore")}
              </Link>
            </li>
            <li>
              <Link to="/newsletter" className="hover:text-white transition">
                {t("common.newsletter")}
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                search={{ mode: "register" }}
                className="hover:text-white transition"
              >
                {t("common.becomeMember")}
              </Link>
            </li>
            <li>
              <Link to="/feedback" className="hover:text-white transition">
                {t("common.siteFeedback")}
              </Link>
            </li>
          </ul>
        </FooterSection>
        <FooterSection title={t("common.help")}>
          <ul className="space-y-2.5 text-sm text-white/70 pb-2">
            <li>
              <Link
                to="/profile"
                search={{ tab: "orders" }}
                className="hover:text-white transition"
              >
                {t("common.orderStatus")}
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-white transition">
                {t("common.shippingDelivery")}
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-white transition">
                {t("common.returns")}
              </Link>
            </li>
            <li>
              <Link to="/payment-options" className="hover:text-white transition">
                {t("common.paymentOptions")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                {t("common.contactUs")}
              </Link>
            </li>
          </ul>
        </FooterSection>
        <FooterSection title={t("common.aboutAITShop")}>
          <ul className="space-y-2.5 text-sm text-white/70 pb-2">
            <li>
              <Link to="/news" className="hover:text-white transition">
                {t("common.news")}
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-white transition">
                {t("common.careers")}
              </Link>
            </li>
            <li>
              <Link to="/investors" className="hover:text-white transition">
                {t("common.investors")}
              </Link>
            </li>
            <li>
              <Link to="/sustainability" className="hover:text-white transition">
                {t("common.sustainability")}
              </Link>
            </li>
          </ul>
        </FooterSection>
        <FooterSection title={t("common.socials")}>
          <div className="flex gap-3 pb-2">
            {[Twitter, Facebook, Youtube, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-brand transition active:bg-brand"
                aria-label={`Social ${i}`}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </FooterSection>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-3 justify-between text-xs text-white/50 text-center md:text-left">
          <p>
            © {new Date().getFullYear()} AIT Shop by AIT Nomad LLC. {t("common.allRightsReserved")}
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#" className="hover:text-white transition">
              {t("common.catalog")}
            </a>
            <a href="#" className="hover:text-white transition">
              {t("common.termsOfUse")}
            </a>
            <a href="#" className="hover:text-white transition">
              {t("common.privacy")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
