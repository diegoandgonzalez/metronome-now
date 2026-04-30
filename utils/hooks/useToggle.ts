'use client'
import { useState } from 'react';

const useToggle = () => {

    const [value, setValue] = useState(false);

    const handleToggle = () => setValue((prev) => !prev);

    return {
        value,
        handleToggle,
    }
}

export default useToggle;