import { act, cleanup, renderHook } from "@testing-library/react-hooks/native"
import { test, expect, afterEach, vi } from "vitest"
import useLateInitializedState from "../useLateInitializedState"

afterEach(() => {
    cleanup()
})

test("should mark as initialized if initial value is not undefined", () => {
    const initializerSpy = vi.fn()

    const { result } = renderHook(() => {
        return useLateInitializedState(initializerSpy, 50)
    })

    expect(result.current[0]).toBe(50)
    expect(result.current[2].initialized).toBeTruthy()
    expect(initializerSpy).not.toHaveBeenCalled()
})

test("should use initializer return as initial state", () => {
    const initializerSpy = vi.fn().mockReturnValue(40)

    const { result } = renderHook(() => {
        return useLateInitializedState(initializerSpy)
    })

    expect(result.current[0]).toBe(40)
    expect(result.current[2].initialized).toBeTruthy()
    expect(initializerSpy).toHaveBeenCalled()
})

test("should wait for initializer to return a value", () => {
    let initializerSpy = vi.fn().mockReturnValue(undefined)

    const { result, rerender } = renderHook(() => {
        return useLateInitializedState(initializerSpy)
    })

    expect(result.current[0]).toBeUndefined()
    expect(result.current[2].initialized).toBeFalsy()
    expect(initializerSpy).toHaveBeenCalled()

    initializerSpy = vi.fn().mockReturnValue(30)
    rerender()

    expect(result.current[0]).toBe(30)
    expect(result.current[2].initialized).toBeTruthy()
    expect(initializerSpy).toHaveBeenCalled()
})

test("should mark state as initialized if state is set manually", () => {
    const { result } = renderHook(() => {
        return useLateInitializedState(() => undefined as number | undefined)
    })

    expect(result.current[0]).toBeUndefined()
    expect(result.current[2].initialized).toBeFalsy()

    act(() => {
        result.current[1](50)
    })

    expect(result.current[0]).toBe(50)
    expect(result.current[2].initialized).toBeTruthy()
})
