import { useEffect, useState } from "react";
import { Users, Menu, X } from "lucide-react";
import { login } from "../../services/authServices";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Sessions", href: "#sessions" },
  { label: "Live rooms", href: "#live-rooms" },
];

function scrollToId(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick(e, href) {
    e.preventDefault();
    setMobileOpen(false);
    scrollToId(href);
  }

  return (
    <header
      className={`nav-shell fixed inset-x-0 top-0 z-50 ${
        scrolled
          ? "border-b border-[#23263b] bg-[#0a0b12]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Logo */}
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, "#top")}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 shadow-md shadow-violet-900/40">
            <Users className="h-4 w-4 text-white" strokeWidth={2.25} />
          </span>
          <span className="font-display text-[15px] font-bold tracking-tight text-white">
            StudyGroup
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="nav-link text-[13.5px] font-medium text-zinc-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={login}
            className="cursor-pointer rounded-lg px-3.5 py-2 text-[13.5px] font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Log in
          </button>
          <button
            onClick={login}
            className="btn-primary group flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-[13.5px] font-semibold text-white shadow-lg shadow-violet-950/40"
          >
            Start studying
            <span className="btn-arrow">&rarr;</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="cursor-pointer rounded-lg border border-[#25283c] bg-[#141624]/80 p-2 text-zinc-200 md:hidden"
        >
          {mobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[#23263b] bg-[#0a0b12]/95 px-5 pb-6 pt-2 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-[#23263b] pt-4">
            <button
              onClick={login}
              className="cursor-pointer rounded-lg border border-[#2e334f] bg-[#141624] py-2.5 text-sm font-semibold text-zinc-200"
            >
              Log in
            </button>
            <button
              onClick={login}
              className="cursor-pointer rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/40"
            >
              Start studying together &rarr;
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
