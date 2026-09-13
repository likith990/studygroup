import { ArrowRight } from "lucide-react";
import { login } from "../../services/authServices";
import useReveal from "../../hooks/useReveal";

export default function FinalCTA() {
  const [ref, visible] = useReveal();

  return (
    <section className="relative py-28 sm:py-36">
      {/* dramatic glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
        <div className="h-[420px] w-[720px] rounded-full bg-gradient-to-tr from-violet-600/30 via-indigo-600/20 to-transparent blur-[100px]" />
      </div>

      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <div ref={ref} className={`reveal ${visible ? "is-visible" : ""}`}>
          <h2 className="text-balance font-display text-[2.1rem] font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Your next study session is one click away.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-balance text-[15px] leading-relaxed text-zinc-400 sm:text-base">
            Find people. Pick a topic. Show up.
          </p>

          <button
            onClick={login}
            className="btn-primary group mx-auto mt-10 flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_auto] px-7 py-4 text-[15px] font-semibold text-white shadow-2xl shadow-violet-950/60"
          >
            Start studying together
            <ArrowRight className="btn-arrow h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
