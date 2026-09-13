import { useState } from "react";
import { createPortal } from "react-dom";
import Form from "../layouts/Form";
import { Plus } from "lucide-react";

export default function FormDialog({ rerender }) {
  const [isform, setisform] = useState(false);

  return (
    <>
      <button
        onClick={() => setisform(true)}
        className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-900/50 active:scale-95"
      >
        <Plus className="h-4 w-4" />
        <span>Create Session</span>
      </button>
      {isform &&
        createPortal(
          <Form setisform={setisform} rerender={rerender} />,
          document.body
        )}
    </>
  );
}
