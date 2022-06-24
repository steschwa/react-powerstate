import { useRef } from "react"

export type UseLatestReturn<T> = {
    readonly current: T
}

export default function useLatest<T>(value: T): UseLatestReturn<T> {
    const ref = useRef(value)
    ref.current = value

    return ref
}
