import { useEffect } from "react";

const useExecuteKeyPressed = (keyCode: string, eventType: "keydown" | "keyup", callback: () => void) => {

  useEffect(() => {
    const executeCallback = (event: KeyboardEvent) => {
      if (document.querySelector('[role="dialog"]') !== null) return;
      
      const target = event.target as HTMLElement | null;
      const isNotTypingShortcut = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (isNotTypingShortcut) return;

      if (event.key.toUpperCase() === keyCode.toUpperCase() && !event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        callback();
      }
    }

    document.addEventListener(eventType, executeCallback);

    return () => {
      document.removeEventListener(eventType, executeCallback);
    }
  }, [keyCode, eventType, callback])
};

export default useExecuteKeyPressed;