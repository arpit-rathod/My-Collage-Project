// FullPageSpinner.jsx
// JavaScript / React - functional component
// Comments reference your previous projects: "attendance PIN" (real-time attendance) and "RED HOUSE" (ecommerce).
import React from "react";
/**
 * FullPageSpinner
 * - A full-screen overlay spinner you can return directly from any component's render/return
 * - Accepts: message (string), size (number px), transparentBackground (boolean), show (boolean)
 *
 * Real-world usage examples:
 *  - Attendance page: show while waiting for socket.io to connect or for teacher to generate PIN.
 *  - RED HOUSE product page: show while product images or cart data load.
 *
 * Accessibility: uses role="status" and visually-hidden text for screen readers.
 *
 * Complex words: "aria" = Accessible Rich Internet Applications (attributes that help assistive tech).
 */

export default function FullPageSpinner({
   show = true,
   message = "Loading…",
   size = 64, // spinner diameter in px
   transparentBackground = false,
}) {
   if (!show) return null; // cheap, immediate exit (performance-minded)

   // Inline styles so component is portable. You can move to CSS modules or Tailwind.
   const overlayStyle = {
      position: "fixed",
      inset: 0, // top:0, right:0, bottom:0, left:0
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: transparentBackground ? "rgba(255,255,255,0.6)" : "rgba(10,10,10,0.6)",
      zIndex: 9999,
      backdropFilter: "blur(4px)", // subtle blur (progressive enhancement)
   };

   const boxStyle = {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      borderRadius: 12,
      // Slight card on dark overlay for focus
      background: "rgba(255,255,255,0.03)",
      color: "#fff",
      textAlign: "center",
   };

   const labelStyle = {
      marginTop: 4,
      fontSize: 14,
      opacity: 0.95,
   };

   // SVG spinner (keeps animation smooth & crisp at any size)
   const spinnerSvg = (
      <svg
         width={size}
         height={size}
         viewBox="0 0 50 50"
         aria-hidden="true"
         style={{ display: "block" }}
      >
         {/* Circle background (subtle) */}
         <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="4"
         />
         {/* Animated arc */}
         <path
            d="M25 5
           a20 20 0 0 1 0 40
           a20 20 0 0 1 0 -40"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="31.4 62.8" // (approx) controls dash/space
            style={{
               transformOrigin: "center",
               animation: "spin-rotate 1s linear infinite, spin-dash 1.5s ease-in-out infinite",
            }}
         />
         <style>{`
        @keyframes spin-rotate {
          100% { transform: rotate(360deg); }
        }
        /* change dash offset to create 'chasing' effect */
        @keyframes spin-dash {
          0% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: -31.4; }
          100% { stroke-dashoffset: -62.8; }
        }
      `}</style>
      </svg>
   );

   return (
      <div style={overlayStyle} aria-modal="true" role="dialog" aria-label={message}>
         <div style={boxStyle}>
            <div
               // role=status announces dynamic updates to screen readers (aria-live)
               role="status"
               aria-live="polite"
               style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
               <div style={{ color: "#fff" }}>{spinnerSvg}</div>
               {/* Visually hidden for clarity on small screens (optional) */}
            </div>

            <div style={labelStyle}>
               <strong>{message}</strong>
               <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
                  Please wait — this usually takes a few seconds.
               </div>

               {/* Hidden helpful hint for screen readers (assistive tech) */}
               <span style={{ position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }}>
                  {message} — content is loading (do not navigate away).
               </span>
            </div>
         </div>
      </div>
   );
}
