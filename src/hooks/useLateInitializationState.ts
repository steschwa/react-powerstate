import { Dispatch, SetStateAction, useState } from "react"
import useLateInitialization, {
    LateInitializationInitializer,
    UseLateInitializationReturn,
} from "./useLateInitialization"

export type UseLateInitializationStateReturn<T> = readonly [
    state: T,
    setState: Dispatch<SetStateAction<T>>,
    lateInitialization: UseLateInitializationReturn,
]

export default function useLateInitializationState<T>(
    initializer: LateInitializationInitializer<T>,
): UseLateInitializationStateReturn<T>
export default function useLateInitializationState<T>(
    initializer: LateInitializationInitializer<T>,
    initial: T,
): UseLateInitializationStateReturn<T>

export default function useLateInitializationState<T>(
    initializer: LateInitializationInitializer<T | undefined>,
    initial?: T,
): UseLateInitializationStateReturn<T | undefined> {
    const [state, setState] = useState(initial)

    const lateInitializationReturn = useLateInitialization({
        initialized: state !== undefined,
        setState,
        initializer,
    })

    return [state, setState, lateInitializationReturn] as const
}

type SetStateInitalValue<V> = V | (() => V)
