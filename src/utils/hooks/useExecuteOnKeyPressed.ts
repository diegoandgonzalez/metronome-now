import { useEffect } from "react";

const useExecuteOnKeyPressed = (keyCode: string, callback: () => void) => {

  useEffect(() => {
    const executeCallback = (event: KeyboardEvent) => {
      if (event.code === keyCode && callback) callback();
    }

    document.addEventListener("keyup", executeCallback);

    return () => {
      document.removeEventListener("keyup", executeCallback);
    }
  }, [callback])
};

export default useExecuteOnKeyPressed;