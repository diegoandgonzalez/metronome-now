import { createContext } from 'react';

const SnackbarContext = createContext({
    open: false,
    text: "",
    secondsToClose: 0,
    type: "",
    handleOpen: (_: string, __?: number, ___?: string) => { },
    handleClose: () => { },
});

export default SnackbarContext;