import { useState, useEffect } from "react";
import styles from "./ConfirmationModal.module.css";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
}) {
  const [show, setShow] = useState(isOpen);
  const [render, setRender] = useState(isOpen);

  useEffect(() => {
    let timer;
    if (isOpen) {
      setRender(true);
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      setShow(false);
      document.body.style.overflow = "";
      timer = setTimeout(() => setRender(false), 300);
    }

    return () => {
      clearTimeout(timer);
      if (isOpen) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen]);

  if (!render) return null;

  return (
    <div className={`${styles.overlay} ${!show ? styles.closing : ""}`}>
      <div className={`${styles.modal} ${!show ? styles.closing : ""}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.body}>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`${styles.confirmBtn} ${isDestructive ? styles.destructive : ""}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <div className={styles.spinner}></div> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
