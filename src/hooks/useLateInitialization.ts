import { useEffect, useState } from "react"

export type UseLateInitializationParams<T> = {
    /**
     * Function to update the state with the return value of `initializer`.
     * @example
     * const [state, setState] = useState<number | undefined>()
     * const { initialized } = useLateInitialization({
     *   setState
     * })
     */
    setState: LateInitializationSetState<T>
    /**
     * Initialization function. If you're ready return a value to finish initialization.
     * To prevent initialization throw any error.
     * @example
     * const [values, setValues] = useState<string[]>([])
     * const { initialized } = useLateInitialization({
     *  setState,
     *  initializer: () => {
     *    if(state.length === 0) {
     *      throw "not-ready"
     *    }
     *    return state[0]
     *  }
     * })
     */
    initializer: LateInitializationInitializer<T>
    /**
     * Manually mark the state as initialized.
     * Once this changes to `true` the hook won't try to initialize the state anymore.
     * @default false
     */
    initialized?: boolean
}
export type UseLateInitializationReturn = {
    /**
     * Flag that indicates if the state has been initialized (manually or using the `initializer`)
     */
    initialized: boolean
}

/**
 * Defer state initialization
 * @param params
 * @returns
 */
export default function useLateInitialization<T>(
    params: UseLateInitializationParams<T>,
): UseLateInitializationReturn {
    const { setState, initializer, initialized = false } = params

    const [didInitialize, setDidInitialize] = useState(initialized)

    const hookInitialized = initialized || didInitialize

    useEffect(() => {
        if (initialized) {
            setDidInitialize(true)
        }
    }, [initialized])

    useEffect(() => {
        if (hookInitialized) {
            return
        }

        ;(async () => {
            try {
                const init = await initializer()
                setState(init)
                setDidInitialize(true)
            } catch (error) {}
        })()
    }, [setState, initializer, hookInitialized])

    return {
        initialized: hookInitialized,
    }
}

export type LateInitializationSetState<T> = (value: T) => void
export type LateInitializationInitializer<T> = () => T | Promise<T>
