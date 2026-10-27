import { useState } from "react";
import { Menu, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNavClick(e, href) {
    e.preventDefault();
    setMobileOpen(false);
    scrollToId(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, "#top")}
          className="text-base font-semibold tracking-tight"
        >
          StudyGroup
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button onClick={login} className="btn btn-ghost">
            Log in
          </button>
          <button onClick={login} className="btn btn-primary">
            Start studying
          </button>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="btn btn-secondary btn-icon md:hidden"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-bg px-4 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="rounded-md px-2 py-3 text-sm text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
            <button onClick={login} className="btn btn-secondary btn-block">
              Log in
            </button>
            <button onClick={login} className="btn btn-primary btn-block">
              Start studying together
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
