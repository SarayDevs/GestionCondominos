import { useEffect } from 'react';

export default function ChatbaseWidget() {
  useEffect(() => {
    // Función para inicializar Chatbase
    const initChatbase = () => {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args) => {
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(args);
        };
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") {
              return target.q;
            }
            return (...args) => target(prop, ...args);
          }
        });
      }

      const onLoad = function() {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "DaJTBKG-wO8Tc0v3Peqvn";
        script.domain = "www.chatbase.co";
        document.body.appendChild(script);
      };

      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }
    };

    initChatbase();
  }, []);

  return null; // Este componente no renderiza nada visible
}

