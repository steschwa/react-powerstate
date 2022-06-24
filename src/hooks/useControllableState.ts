import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { getNextStateProducer } from "utils/state"
import useLatest from "./useLatest"

export type UseControllableStateParams<T> = {
    value?: T | undefined
    defaultValue?: T | undefined
    /**
     * Function to call with the current controlled or uncontrolled value
     * @default undefined
     */
    onChange?: (value: T) => void
}
export type UseControllableStateReturn<T> = readonly [
    state: T | undefined,
    setState: Dispatch<SetStateAction<T | undefined>>,
]

export default function useControllableState<T>(
    params: UseControllableStateParams<T>,
): UseControllableStateReturn<T> {
    const { value, defaultValue, onChange } = params

    const [uncontrolledValue, setUncontrolledValue] = useUncontrolledState({
        defaultValue,
        onChange,
    })
    const isControlled = value !== undefined
    const state = isControlled ? value : uncontrolledValue

    const latestOnChange = useLatest(onChange)

    const setState: Dispatch<SetStateAction<T | undefined>> = useCallback(
        nextValue => {
            if (isControlled) {
                const state = getNextStateProducer(nextValue)(value)
                if (state !== value) {
                    latestOnChange.current?.(state as T)
                }
            } else {
                setUncontrolledValue(nextValue)
            }
        },
        [isControlled, value],
    )

    return [state, setState] as const
}

type UseUncontrolledStateParams<T> = {
    defaultValue?: T | undefined
    onChange?: (value: T) => void
}
function useUncontrolledState<T>(params: UseUncontrolledStateParams<T>) {
    const { defaultValue, onChange } = params

    const uncontrolledState = useState(defaultValue)
    const [value] = uncontrolledState
    const prevValueRef = useRef(value)
    const latestOnChange = useLatest(onChange)

    useEffect(() => {
        if (value !== prevValueRef.current) {
            latestOnChange.current?.(value as T)
            prevValueRef.current = value
        }
    }, [value])

    return uncontrolledState
}

type SetStateFn<T> = (prevState?: T) => T
