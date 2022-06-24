import type { SetStateAction } from "react"

export function getNextStateProducer<T>(value: SetStateAction<T>): SetStateFn<T> {
    return prev => {
        const setter = value as SetStateFn<T>
        return typeof value === "function" ? setter(prev) : value
    }
}

type SetStateFn<T> = (prev: T) => T
