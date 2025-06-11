import { useState } from "react";


// todo: ver si dejarlo aca o juntarlo con useMetronome
const useCounter = (initialAmount: number) => {

    const [isActive, setIsActive] = useState(false);
    const [amount, setAmount] = useState(initialAmount);

    const handleSetCounter = (newAmount: number, newIsActive: boolean) => {
        setAmount(newAmount);
        setIsActive(newIsActive);
    }

    return {
        isActive,
        amount,
        handleSetCounter,
    };
}

export default useCounter;