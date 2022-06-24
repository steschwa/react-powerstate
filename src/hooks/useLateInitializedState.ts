import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import { getNextStateProducer } from "utils/state"
import useLatest from "./useLatest"

export type UseLateInitializedStateReturn<T> = readonly [
    state: T,
    setState: Dispatch<SetStateAction<T>>,
    helpers: LateInitializedStateHelpers,
]

export default function useLateInitializedState<T>(
    initializer: LateInitializer<T>,
): UseLateInitializedStateReturn<T | undefined>
export default function useLateInitializedState<T>(
    initializer: LateInitializer<T>,
    initialValue: T,
): UseLateInitializedStateReturn<T>
export default function useLateInitializedState<T>(
    initializer: LateInitializer<T>,
    initialValue?: T,
): UseLateInitializedStateReturn<T | undefined> {
    const [state, setInternalState] = useState(initialValue)
    const [initialized, setInitialized] = useState(initialValue !== undefined)
    const latestInitialized = useLatest(initialized)

    useEffect(() => {
        if (latestInitialized.current) {
            return
        }

        const init = initializer()
        if (init === undefined) {
            return
        }
        setInternalState(init)
        setInitialized(true)
    }, [initializer, initializer])

    const setState: Dispatch<SetStateAction<T | undefined>> = useCallback(value => {
        setInternalState(getNextStateProducer(value))
        setInitialized(true)
    }, [])

    return [state, setState, { initialized }] as const
}

export type LateInitializer<T> = () => T | undefined
export type LateInitializedStateHelpers = {
    /**
     * Flag indicating if the state is already initialized
     */
    initialized: boolean
}
