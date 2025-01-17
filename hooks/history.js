import { useState } from "react"

const useHistory = (initialState) => {
    const [index, setIndex] = useState(0);
    const [history, setHistory] = useState([initialState]);
    const setState = (action, overwrite = false) => {
        const newState = typeof action === "function" ? action(history[index]) : action;
        if (overwrite) {
            const historyCopy = [...history]
            historyCopy[index] = newState
            setHistory(historyCopy)
        } else {
            const updatedHistory=[...history].slice(0,index+1);
            setHistory([...updatedHistory, newState]);
            setIndex(prev => prev + 1);
        }
    }
    const undo = () => {
        if (index > 0) {
            setIndex((prev) => prev - 1);
        }
    }
    const redo = () => {
        if (index < history.length - 1) {
            setIndex((prev) => prev + 1);
        }
    }
    return [history[index], setState,undo,redo]
}
export default useHistory