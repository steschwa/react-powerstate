import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import useLatest from "./useLatest"

export type UseEditableReturn<T> = readonly [
    state: T,
    setState: Dispatch<SetStateAction<T>>,
    helpers: EditableStateHelpers<T>,
]

export default function useEditableState<T>(value: T): UseEditableReturn<T> {
    const [state, setInternalState] = useState(value)
    const [status, setStatus] = useState(EditableStateStatus.OBSERVED)
    const latestStatus = useLatest(status)

    useEffect(() => {
        if (latestStatus.current === EditableStateStatus.EDITED) {
            return
        }

        setInternalState(value)
        setStatus(EditableStateStatus.OBSERVED)
    }, [value])

    const setState: Dispatch<SetStateAction<T>> = useCallback(value => {
        setInternalState(prev => {
            const setter = value as SetStateFn<T>
            return typeof value === "function" ? setter(prev) : value
        })
        setStatus(EditableStateStatus.EDITED)
    }, [])

    const reset: EditableStateHelpers<T>["reset"] = useCallback(() => {
        setStatus(EditableStateStatus.OBSERVED)
    }, [])
    const resetWithValue: EditableStateHelpers<T>["resetWithValue"] = useCallback(value => {
        setInternalState(value)
        setStatus(EditableStateStatus.OBSERVED)
    }, [])

    return [
        state,
        setState,
        {
            status,
            reset,
            resetWithValue,
        },
    ] as const
}

export enum EditableStateStatus {
    OBSERVED = "OBSERVED",
    EDITED = "EDITED",
}
export type EditableStateHelpers<T> = {
    /**
     * Current status of the state
     */
    status: EditableStateStatus
    /**
     * Reset the status to `OBSERVED` but keeps the current state
     */
    reset: () => void
    /**
     * Reset the status to `OBSERVED` and set the state to the passed value
     */
    resetWithValue: (value: T) => void
}

type SetStateFn<T> = (prev: T) => T
