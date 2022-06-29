import { cleanup, renderHook } from "@testing-library/react-hooks/native"
import { afterEach, expect, test } from "vitest"
import useMapState from "../useMapState"

afterEach(() => {
    cleanup()
})

test("should use nested array as initial state", () => {
    const { result } = renderHook(() => {
        return useMapState([
            ["first", 1],
            ["second", 2],
            ["third", 3],
        ])
    })

    expect(result.current[0].size).toBe(3)
    expect(Array.from(result.current[0].keys())).toMatchObject(["first", "second", "third"])
    expect(Array.from(result.current[0].values())).toMatchObject([1, 2, 3])
})

test("should use Map as initial state", () => {
    const { result } = renderHook(() => {
        return useMapState(
            new Map([
                ["first", 1],
                ["second", 2],
                ["third", 3],
            ]),
        )
    })

    expect(result.current[0].size).toBe(3)
    expect(Array.from(result.current[0].keys())).toMatchObject(["first", "second", "third"])
    expect(Array.from(result.current[0].values())).toMatchObject([1, 2, 3])
})

test("should clear state", () => {
    const { result } = renderHook(() => {
        const map = new Map()
        map.set(1, "first")
        map.set(2, "second")
        map.set(3, "third")
        return useMapState(map)
    })

    expect(result.current[0].size).toBe(3)

    result.current[0].clear()

    expect(result.current[0].size).toBe(0)
})

test("should delete key", () => {
    const { result } = renderHook(() => {
        const map = new Map()
        map.set(1, "first")
        map.set(2, "second")
        map.set(3, "third")
        return useMapState(map)
    })

    expect(result.current[0].size).toBe(3)
    expect(result.current[0].get(1)).toBe("first")

    result.current[0].delete(1)

    expect(result.current[0].size).toBe(2)
    expect(result.current[0].get(1)).toBeUndefined()
})

test("should set key", () => {
    const { result } = renderHook(() => {
        const map = new Map()
        map.set(1, "first")
        map.set(2, "second")
        map.set(3, "third")
        return useMapState(map)
    })

    expect(result.current[0].size).toBe(3)
    expect(result.current[0].get(4)).toBeUndefined()

    result.current[0].set(4, "fourth")

    expect(result.current[0].size).toBe(4)
    expect(result.current[0].get(4)).toBe("fourth")

    result.current[0].set(1, "entry")

    expect(result.current[0].size).toBe(4)
    expect(result.current[0].get(1)).toBe("entry")
})

test("should override state", () => {
    const { result } = renderHook(() => {
        const map = new Map()
        map.set(1, "first")
        map.set(2, "second")
        map.set(3, "third")
        return useMapState(map)
    })

    expect(result.current[0].size).toBe(3)
    expect(result.current[0].get(1)).toBe("first")
    expect(result.current[0].get(2)).toBe("second")
    expect(result.current[0].get(3)).toBe("third")
    expect(result.current[0].get("first")).toBeUndefined()
    expect(result.current[0].get("second")).toBeUndefined()

    result.current[1]([
        ["first", 1],
        ["second", 2],
    ])

    expect(result.current[0].size).toBe(2)
    expect(result.current[0].get(1)).toBeUndefined()
    expect(result.current[0].get(2)).toBeUndefined()
    expect(result.current[0].get(3)).toBeUndefined()
    expect(result.current[0].get("first")).toBe(1)
    expect(result.current[0].get("second")).toBe(2)
})

test("should convert to array", () => {
    const { result } = renderHook(() => {
        return useMapState(new Map().set("first", 1).set("second", 2).set("third", 3))
    })

    expect(result.current[0].size).toBe(3)

    const arr = result.current[0].toArray()
    expect(arr).toHaveLength(3)
    expect(arr[0]).toMatchObject(["first", 1])
    expect(arr[1]).toMatchObject(["second", 2])
    expect(arr[2]).toMatchObject(["third", 3])
})
