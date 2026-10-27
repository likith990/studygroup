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
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold">StudyGroup</p>
          <p className="mt-1 text-xs text-muted">Peer learning and collaborative study rooms.</p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(link.href);
              }}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <button onClick={login} className="text-sm text-muted transition-colors hover:text-ink">
            Sign in
          </button>
        </nav>
      </div>
    </footer>
  );
}
