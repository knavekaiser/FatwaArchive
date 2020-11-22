import React from "react";
import ReactDom, { createPortal } from "react-dom";

export const Modal = ({ open, setOpen, children }) => {
  if (!open) return null;
  return createPortal(
    <>
      <div
        className="modalBackdrop"
        onClick={() => {
          console.log("click");
          setOpen(false);
        }}
      />
      <div className="modal">{children}</div>
    </>,
    document.getElementById("portal")
  );
};

export const Toast = ({ open, children }) => {
  if (!open) return null;
  return createPortal(
    <>
      <div className="toast">{children}</div>
    </>,
    document.getElementById("portal")
  );
};
