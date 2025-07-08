import { useCallback, useRef, useState } from "react";
import { setValueInLocalStorage, type LocalStorageValueType } from "../localStorage";

const useStateRefLocalStorageSync = <Type>(initialValue: Type, localStorageKey?: string) => {

    const [value, setValue] = useState(initialValue);
    const valueRef = useRef(initialValue);

    const handleSyncValue = useCallback((newValue: Type) => {
        valueRef.current = newValue;
        setValue(newValue);
        
        if (localStorageKey) {
            setValueInLocalStorage(localStorageKey, newValue as LocalStorageValueType);
        }
    }, [localStorageKey])

    return {
        value,
        valueRef,
        handleSyncValue,
    };
}

export default useStateRefLocalStorageSync;