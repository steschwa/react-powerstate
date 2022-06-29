import { useCallback, useState } from "react"

export type UseMapStateReturn<K, V> = readonly [
    state: MapStateContract<K, V>,
    override: (init?: MapStateInit<K, V>) => void,
]

export default function useMapState<K, V>(initial?: MapStateInit<K, V>): UseMapStateReturn<K, V> {
    const createMap = useCallback((init?: MapStateInit<K, V>) => {
        class MapState implements MapStateContract<K, V> {
            private map: Map<K, V>

            constructor(init?: MapStateInit<K, V>) {
                this.map = new Map(init)
            }

            get size() {
                return this.map.size
            }
            clear(): void {
                this.map.clear()
                this.rerender()
            }
            delete(key: K): void {
                this.map.delete(key)
                this.rerender()
            }
            get(key: K): V | undefined {
                return this.map.get(key)
            }
            has(key: K): boolean {
                return this.map.has(key)
            }
            set(key: K, value: V): void {
                this.map.set(key, value)
                this.rerender()
            }
            keys(): IterableIterator<K> {
                return this.map.keys()
            }
            values(): IterableIterator<V> {
                return this.map.values()
            }
            entries(): IterableIterator<[K, V]> {
                return this.map.entries()
            }
            toArray(): Array<[K, V]> {
                return Array.from(this.entries())
            }
            private rerender() {
                setState(createMap(this.map))
            }
        }

        return new MapState(init)
    }, [])

    const [state, setState] = useState(() => {
        return createMap(initial)
    })

    const override = useCallback(
        (init?: MapStateInit<K, V>) => {
            setState(createMap(init))
        },
        [createMap],
    )

    return [state, override] as const
}

export type MapStateInit<Key, Value> = Map<Key, Value> | Array<readonly [Key, Value]>

export interface MapStateContract<K, V> {
    clear(): void
    delete(key: K): void
    get(key: K): V | undefined
    has(key: K): boolean
    set(key: K, value: V): void
    keys(): IterableIterator<K>
    values(): IterableIterator<V>
    entries(): IterableIterator<[K, V]>
    toArray(): Array<[K, V]>
    readonly size: number
}
