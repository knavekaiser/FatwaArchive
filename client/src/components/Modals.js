import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export const Modal = ({
  containerClass,
  open,
  setOpen,
  children,
  className,
  backdropClick,
}) => {
  useEffect(() => {
    if (!containerClass) return;
    const portal = document.querySelector("#portal");
    portal.classList.add(containerClass);
    return () => portal.classList.remove(containerClass);
  });
  if (!open) return null;
  return createPortal(
    <>
      <div
        className="modalBackdrop"
        onClick={() => {
          setOpen && setOpen(false);
          backdropClick && backdropClick();
        }}
      />
      <div className={`modal ${className ? className : ""}`}>{children}</div>
    </>,
    document.querySelector("#portal")
  );
};

export const Toast = ({ open, children }) => {
  if (!open) return null;
  return createPortal(
    <>
      <div className="toast">{children}</div>
    </>,
    document.querySelector("#portal")
  );
};
