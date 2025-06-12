import { useRef, useState } from "react";
import { setValueInLocalStorage, type LocalStorageValueType } from "../../../utils/localStorage";

const useStateRefLocalStorageSync = <Type>(initialValue: Type, localStorageKey: string) => {

    const [value, setValue] = useState(initialValue);
    const valueRef = useRef(initialValue);

    const handleSyncValue = (newValue: Type) => {
        valueRef.current = newValue;
        setValue(newValue);
        setValueInLocalStorage(localStorageKey, newValue as LocalStorageValueType);
    }

    return {
        value,
        valueRef,
        handleSyncValue,
    };
}

export default useStateRefLocalStorageSync;