'use client'
import { useCallback, useRef, useState } from 'react';
import { getValueFromLocalStorageOrDefault, setValueInLocalStorage } from '@/utils/helpers';
import type { LocalStorageKey, LocalStorageValue } from '@/utils/types';

const useStateRefLocalStorageSync = <Type extends LocalStorageValue>(initialValue: Type, localStorageKey?: LocalStorageKey) => {

    const [value, setValue] = useState<Type>(() => localStorageKey ? getValueFromLocalStorageOrDefault(localStorageKey, initialValue as LocalStorageValue) : initialValue);
    const valueRef = useRef<Type>(value);

    const handleSyncValue = useCallback((newValue: Type) => {
        valueRef.current = newValue;
        setValue(newValue);

        if (localStorageKey) {
            setValueInLocalStorage(localStorageKey, newValue);
        }
    }, [localStorageKey])

    return {
        value,
        valueRef,
        handleSyncValue,
    };
}

export default useStateRefLocalStorageSync;