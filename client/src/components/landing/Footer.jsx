import { Users } from "lucide-react";
import { login } from "../../services/authServices";

function scrollToId(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Sessions", href: "#sessions" },
  { label: "Features", href: "#top" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#1c1e2e] py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-5 sm:flex-row sm:px-8">
        <div className="flex flex-col items-center gap-2.5 sm:items-start">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600">
              <Users className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="font-display text-sm font-bold text-white">StudyGroup</span>
          </div>
          <p className="max-w-xs text-center text-xs text-zinc-500 sm:text-left">
            Peer learning &amp; collaborative study rooms.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(link.href);
              }}
              className="text-xs font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={login}
            className="text-xs font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Sign in
          </button>
        </nav>
      </div>

      <p className="mt-10 text-center text-[11px] text-zinc-600">
        StudyGroup — built for students who learn better together.
      </p>
    </footer>
  );
}
