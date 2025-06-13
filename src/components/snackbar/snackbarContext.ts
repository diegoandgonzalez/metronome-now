import { createContext } from 'react';

const SnackbarContext = createContext({
    open: false,
    text: "",
    secondsToClose: 0,
    handleOpen: (_: string, __?: number) => {},
    handleClose: () => {},
});

export default SnackbarContext;