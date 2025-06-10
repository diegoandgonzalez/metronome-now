import { useEffect } from "react";

const useExecuteOnSpacePressed = (callback: () => void) => {

  useEffect(() => {
    const executeCallback = (event: KeyboardEvent) => {
      if (event.code === "Space" && callback) callback();
    }

    document.addEventListener("keyup", executeCallback);

    return () => {
      document.removeEventListener("keyup", executeCallback);
    }
  }, [callback])
};

export default useExecuteOnSpacePressed;