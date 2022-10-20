import {useState} from "react";

export default function useInputState(initialValue) {
    const [value, setValue] = useState(initialValue)

    function handleChange(e) {
        setValue(e.target.value)
    }

    return [value, handleChange, setValue]
}
