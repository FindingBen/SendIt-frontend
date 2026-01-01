import { useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import { config } from "../constants/Constants";
import { useRedux } from "../constants/reduxImports";

const makeWsUrl = (baseUrl, path, token) => {
  const isSecure = baseUrl.startsWith("https");
  const wsProto = isSecure ? "wss" : "ws";
  const host = baseUrl.replace(/^https?:\/\//, "");
  let url = `${wsProto}://${host}${path}`;
  if (token) {
    const separator = url.includes("?") ? "&" : "?";
    url += `${separator}token=${encodeURIComponent(token)}`;
  }
  return url;
};

const isTokenValid = (token) => {
  try {
    const { exp } = jwt_decode(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export default function useNotificationSocket(options = {}) {
  const { path = "/ws/notifications/", onMessage } = options;
  const { currentToken } = useRedux();

  const wsRef = useRef(null);
  const reconnectRef = useRef({ attempts: 0, timeoutId: null });

  useEffect(() => {
    let mounted = true;

    // 🔴 HARD STOP: no token or expired token → no WS
    if (!currentToken || !isTokenValid(currentToken)) {
      if (wsRef.current) {
        try {
          wsRef.current.close(4001, "Not authenticated");
        } catch {}
        wsRef.current = null;
      }
      return;
    }

    const connect = () => {
      if (!mounted) return;
      if (!currentToken || !isTokenValid(currentToken)) return;

      const url = makeWsUrl(config.url.BASE_URL, path, currentToken);

      try {
        wsRef.current = new WebSocket(url);
      } catch {
        scheduleReconnect();
        return;
      }

      wsRef.current.onopen = () => {
        reconnectRef.current.attempts = 0;
      };

      wsRef.current.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          onMessage?.(data);
        } catch {
          // ignore malformed payloads
        }
      };

      wsRef.current.onclose = (event) => {
        wsRef.current = null;

        // 🔒 Auth-related closes → never reconnect
        if ([4001, 4003].includes(event.code)) {
          return;
        }

        scheduleReconnect();
      };

      wsRef.current.onerror = () => {
        try {
          wsRef.current?.close();
        } catch {}
      };
    };

    const scheduleReconnect = () => {
      if (!mounted) return;
      if (!currentToken || !isTokenValid(currentToken)) return;

      const attempts = reconnectRef.current.attempts;
      const delay = Math.min(30000, 1000 * Math.pow(1.6, attempts));

      reconnectRef.current.attempts += 1;
      reconnectRef.current.timeoutId = setTimeout(connect, delay);
    };

    connect();

    return () => {
      mounted = false;

      if (reconnectRef.current.timeoutId) {
        clearTimeout(reconnectRef.current.timeoutId);
      }

      if (wsRef.current) {
        try {
          wsRef.current.close(1000, "Component unmounted");
        } catch {}
        wsRef.current = null;
      }
    };
  }, [currentToken, path, onMessage]);

  return wsRef;
}
