'use client'
import { useCallback, useRef, useState } from 'react';
import { getValueFromLocalStorageOrDefault, setValueInLocalStorage, type LocalStorageValueType } from '@/utils/localStorage';

const useStateRefLocalStorageSync = <Type>(initialValue: Type, localStorageKey?: string) => {

    const [value, setValue] = useState<Type>(() => localStorageKey ? getValueFromLocalStorageOrDefault(localStorageKey, initialValue as LocalStorageValueType) : initialValue);
    const valueRef = useRef<Type>(value);

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