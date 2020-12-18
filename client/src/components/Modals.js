import React from "react";
import { createPortal } from "react-dom";

export const Modal = ({ open, setOpen, children, className }) => {
  if (!open) return null;
  return createPortal(
    <>
      <div
        className="modalBackdrop"
        onClick={() => {
          setOpen(false);
        }}
      />
      <div className={`modal ${className ? className : ""}`}>{children}</div>
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
