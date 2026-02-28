import { toast } from "react-toastify";

export const confirmAction = (message, onConfirm) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#cbd5e1", lineHeight: 1.4 }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={closeToast}
            style={{
              padding: "5px 10px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              transition: "background 0.2s"
            }}
            onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={e => e.target.style.background = "transparent"}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              closeToast();
              onConfirm();
            }}
            style={{
              padding: "5px 10px",
              background: "#ef4444",
              border: "none",
              color: "#fff",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(239,68,68,0.3)"
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    ),
    { 
      autoClose: false, 
      closeOnClick: false, 
      draggable: false, 
      closeButton: false,
      style: { background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" }
    }
  );
};
