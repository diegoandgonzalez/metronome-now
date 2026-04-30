'use client'
import { useCallback, useRef, useState } from 'react';

const useStateRefSync = <Type>(initialValue: Type) => {

    const [value, setValue] = useState<Type>(initialValue);
    const valueRef = useRef<Type>(value);

    const handleSyncValue = useCallback((newValue: Type) => {
        valueRef.current = newValue;
        setValue(newValue);
    }, [])

    return {
        value,
        valueRef,
        handleSyncValue,
    };
}

export default useStateRefSync;