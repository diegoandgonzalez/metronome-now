import { useEffect } from "react";

const useExecuteKeyPressed = (keyCode: string, callback: () => void) => {

  useEffect(() => {
    const executeCallback = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (isTyping) return;

      if (event.key.toUpperCase() === keyCode.toUpperCase() && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        event.preventDefault();
        callback();
      }
    }

    document.addEventListener("keyup", executeCallback);

    return () => {
      document.removeEventListener("keyup", executeCallback);
    }
  }, [keyCode, callback])
};

export default useExecuteKeyPressed;