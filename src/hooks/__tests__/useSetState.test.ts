import { cleanup, renderHook } from "@testing-library/react-hooks/native"
import { afterEach, expect, test } from "vitest"
import useSetState from "../useSetState"

afterEach(() => {
    cleanup()
})

test("should use array as initial state", () => {
    const { result } = renderHook(() => {
        return useSetState(["first", "second", "third"])
    })

    expect(result.current[0].size).toBe(3)
    expect(result.current[0].toArray()).toMatchObject(["first", "second", "third"])
})

test("should use Set as initial state", () => {
    const { result } = renderHook(() => {
        return useSetState(new Set().add("first").add("second").add("third"))
    })

    expect(result.current[0].size).toBe(3)
    expect(result.current[0].toArray()).toMatchObject(["first", "second", "third"])
})

test("should clear state", () => {
    const { result } = renderHook(() => {
        return useSetState(new Set().add("first").add("second").add("third"))
    })

    expect(result.current[0].size).toBe(3)

    result.current[0].clear()

    expect(result.current[0].size).toBe(0)
})

test("should delete value", () => {
    const { result } = renderHook(() => {
        return useSetState(new Set().add("first").add("second").add("third"))
    })

    expect(result.current[0].size).toBe(3)
    expect(result.current[0].has("first")).toBeTruthy()

    result.current[0].delete("first")

    expect(result.current[0].size).toBe(2)
    expect(result.current[0].has("first")).toBeFalsy()
})

test("should add value", () => {
    const { result } = renderHook(() => {
        return useSetState(new Set().add("first").add("second").add("third"))
    })

    expect(result.current[0].size).toBe(3)
    expect(result.current[0].has("ten")).toBeFalsy()

    result.current[0].add("ten")

    expect(result.current[0].size).toBe(4)
    expect(result.current[0].has("ten")).toBeTruthy()
})

test("should override state", () => {
    const { result } = renderHook(() => {
        return useSetState(new Set().add("first").add("second").add("third"))
    })

    expect(result.current[0].size).toBe(3)
    expect(result.current[0].has("first")).toBeTruthy()
    expect(result.current[0].has("second")).toBeTruthy()
    expect(result.current[0].has("third")).toBeTruthy()
    expect(result.current[0].has("ten")).toBeFalsy()

    result.current[1](["ten"])

    expect(result.current[0].size).toBe(1)
    expect(result.current[0].has("first")).toBeFalsy()
    expect(result.current[0].has("second")).toBeFalsy()
    expect(result.current[0].has("third")).toBeFalsy()
    expect(result.current[0].has("ten")).toBeTruthy()
})

test("should convert to array", () => {
    const { result } = renderHook(() => {
        return useSetState(new Set().add("first").add("second").add("third"))
    })

    const arr = result.current[0].toArray()

    expect(arr).toHaveLength(3)
    expect(arr.includes("first")).toBeTruthy()
    expect(arr.includes("second")).toBeTruthy()
    expect(arr.includes("third")).toBeTruthy()
})
