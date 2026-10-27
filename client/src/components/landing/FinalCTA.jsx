import { login } from "../../services/authServices";

export default function FinalCTA() {
  return (
    <section className="landing-section border-t border-line">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="section-title mx-auto">Your next study session is one click away.</h2>
        <p className="mx-auto mt-4 max-w-md text-base text-muted">
          Find people. Pick a topic. Show up.
        </p>
        <button onClick={login} className="btn btn-primary btn-lg mt-9">
          Start studying together
        </button>
      </div>
    </section>
  );
}
