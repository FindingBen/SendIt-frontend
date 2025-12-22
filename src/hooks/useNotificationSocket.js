import { useEffect, useRef } from "react";
import { config } from "../constants/Constants";
import { useRedux } from "../constants/reduxImports";

const makeWsUrl = (baseUrl, path, token) => {
  const isSecure = baseUrl.startsWith("https");
  const wsProto = isSecure ? "wss" : "ws";
  // remove http(s)://
  const host = baseUrl.replace(/^https?:\/\//, "");
  let url = `${wsProto}://${host}${path}`;
  if (token) {
    const separator = url.includes("?") ? "&" : "?";
    url = `${url}${separator}token=${encodeURIComponent(token)}`;
  }
  return url;
};

// options: { path: string, onMessage: fn }
export default function useNotificationSocket(options = {}) {
  const { path = "/ws/notifications/", onMessage } = options;
  const { currentToken } = useRedux();
  const wsRef = useRef(null);
  const reconnectRef = useRef({ attempts: 0, timeoutId: null });
    console.log("Setting up notification socket with path:", path);
  useEffect(() => {
    let mounted = true;
    console.log('connection working')
    const connect = () => {
      if (!mounted) return;
      const url = makeWsUrl(config.url.BASE_URL, path, currentToken);
      try {
        wsRef.current = new WebSocket(url);
      } catch (err) {
        scheduleReconnect();
        console.log("WebSocket connection error:", err);
        return;
      }

      wsRef.current.onopen = () => {
        reconnectRef.current.attempts = 0;
      };

      wsRef.current.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          console.log("Received socket message:", data);
          if (onMessage) onMessage(data);
        } catch (e) {
          console.warn("Invalid socket message", e);
        }
      };

      wsRef.current.onclose = () => {
        scheduleReconnect();
      };

      wsRef.current.onerror = () => {
        // error will trigger close -> reconnect
        try {
          wsRef.current.close();
        } catch (e) {}
      };
    };

    const scheduleReconnect = () => {
      const attempts = reconnectRef.current.attempts || 0;
      const wait = Math.min(30000, 1000 * Math.pow(1.6, attempts));
      reconnectRef.current.attempts = attempts + 1;
      if (reconnectRef.current.timeoutId) clearTimeout(reconnectRef.current.timeoutId);
      reconnectRef.current.timeoutId = setTimeout(() => connect(), wait);
    };

    connect();

    return () => {
      mounted = false;
      if (reconnectRef.current.timeoutId) clearTimeout(reconnectRef.current.timeoutId);
      try {
        if (wsRef.current) wsRef.current.close();
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, currentToken]);

  return wsRef;
}
