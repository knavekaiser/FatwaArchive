import React from "react";
import ReactDom from "react-dom";

function Modal({ open, children }) {
  if (!open) return null;
  return ReactDom.createPortal(
    <>
      <div className="portal">{children}</div>
    </>,
    document.getElementById("portal")
  );
}

export default Modal;
