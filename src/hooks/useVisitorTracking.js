import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const VISITOR_KEY = "petrx_visitor_id";
const SESSION_KEY = "petrx_session_id";

function genId(prefix) {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  const hex = Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
  return prefix + "_" + hex;
}

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = genId("v");
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return genId("v");
  }
}

function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = genId("s");
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return genId("s");
  }
}

export function useVisitorTracking() {
  const location = useLocation();

  useEffect(() => {
    const visitor_id = getVisitorId();
    const session_id = getSessionId();

    base44.functions
      .invoke("trackVisit", {
        page: location.pathname,
        visitor_id,
        session_id,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      })
      .catch(() => {});
  }, [location.pathname]);
}