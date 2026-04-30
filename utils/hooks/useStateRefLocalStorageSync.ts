'use client'
import { useCallback, useRef, useState } from 'react';
import { getValueFromLocalStorageOrDefault, setValueInLocalStorage } from '@/utils/helpers';
import type { LocalStorageKey, LocalStorageValue } from '@/utils/types';

const useStateRefLocalStorageSync = <Type extends LocalStorageValue>(defaultValue: Type, localStorageKey: LocalStorageKey) => {

    const [value, setValue] = useState<Type>(() => getValueFromLocalStorageOrDefault(localStorageKey, defaultValue as LocalStorageValue));
    const valueRef = useRef<Type>(value);

    const handleSyncValue = useCallback((newValue: Type = defaultValue) => {
        valueRef.current = newValue;
        setValue(newValue);

        if (localStorageKey) {
            setValueInLocalStorage(localStorageKey, newValue);
        }
    }, [localStorageKey, defaultValue])

    return {
        value,
        valueRef,
        handleSyncValue,
    };
}

export default useStateRefLocalStorageSync;