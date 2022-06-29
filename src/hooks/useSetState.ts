import { useCallback, useState } from "react"

export type UseSetStateReturn<T> = readonly [
    state: SetStateContract<T>,
    override: (init?: SetStateInit<T>) => void,
]

export default function useSetState<T>(initial?: SetStateInit<T>): UseSetStateReturn<T> {
    const createSet = useCallback((init?: SetStateInit<T>) => {
        class SetState implements SetStateContract<T> {
            private set: Set<T>

            constructor(init?: SetStateInit<T>) {
                this.set = new Set(init)
            }

            get size() {
                return this.set.size
            }
            add(value: T): void {
                this.set.add(value)
                this.rerender()
            }
            clear(): void {
                this.set.clear()
                this.rerender()
            }
            delete(value: T): void {
                this.set.delete(value)
                this.rerender()
            }
            has(value: T): boolean {
                return this.set.has(value)
            }
            values(): IterableIterator<T> {
                return this.set.values()
            }
            toArray(): T[] {
                return Array.from(this.values())
            }
            private rerender() {
                setState(createSet(this.set))
            }
        }

        return new SetState(init)
    }, [])

    const [state, setState] = useState(() => {
        return createSet(initial)
    })

    const override = useCallback(
        (init?: SetStateInit<T>) => {
            setState(createSet(init))
        },
        [createSet],
    )

    return [state, override] as const
}

export type SetStateInit<T> = Set<T> | readonly T[]

export interface SetStateContract<T> {
    add(value: T): void
    clear(): void
    delete(value: T): void
    has(value: T): boolean
    values(): IterableIterator<T>
    toArray(): T[]
    readonly size: number
}
