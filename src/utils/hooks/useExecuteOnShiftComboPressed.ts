import { useEffect } from "react";

const useExecuteOnShiftComboPressed = (keyCode: string, callback: () => void) => {

  useEffect(() => {
    const executeCallback = (event: KeyboardEvent) => {
      if (event.key === keyCode && event.shiftKey) {
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

export default useExecuteOnShiftComboPressed;