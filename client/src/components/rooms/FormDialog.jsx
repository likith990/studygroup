import { useState } from "react";
import { createPortal } from "react-dom";
import Form from "../layouts/Form";
import { Plus } from "lucide-react";

export default function FormDialog({ rerender }) {
  const [isform, setisform] = useState(false);

  return (
    <>
      <button onClick={() => setisform(true)} aria-label="Create session" className="btn btn-primary">
        <Plus className="h-4 w-4" strokeWidth={2} />
        <span className="hidden min-[420px]:inline">Create session</span>
      </button>
      {isform &&
        createPortal(
          <Form setisform={setisform} rerender={rerender} />,
          document.body
        )}
    </>
  );
}
