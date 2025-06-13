import { useContext } from "react";
import SnackbarContext from "./snackbarContext";

const useSnackbarContext = () => {

    const snackbarContextValue = useContext(SnackbarContext);

    return {
        ...snackbarContextValue
    }
}

export default useSnackbarContext;