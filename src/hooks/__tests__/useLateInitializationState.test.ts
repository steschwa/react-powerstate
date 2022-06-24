import { cleanup, renderHook } from "@testing-library/react-hooks/native"
import { afterEach, expect, test, vi } from "vitest"
import useLateInitializationState from "../useLateInitializationState"

afterEach(() => {
    cleanup()
})

test("should late initialize state", async () => {
    let initializerSpy = vi.fn().mockImplementation(() => {
        throw "not-ready"
    })

    const { result, rerender, waitFor } = renderHook(() => {
        return useLateInitializationState(initializerSpy)
    })

    expect(result.current[0]).toBeUndefined()
    expect(result.current[2].initialized).toBeFalsy()

    initializerSpy = vi.fn().mockReturnValue(10)
    rerender()
    await waitFor(() => {
        expect(result.current[0]).toBe(10)
        expect(result.current[2].initialized).toBeTruthy()
    })
})

test("should skip late initialization if state is set manually", () => {
    const initializerSpy = vi.fn().mockImplementation(() => {
        throw "not-ready"
    })

    const { result } = renderHook(() => {
        return useLateInitializationState(initializerSpy, 50)
    })

    expect(result.current[0]).toBe(50)
    expect(result.current[2].initialized).toBeTruthy()
    expect(initializerSpy).not.toHaveBeenCalled()
})
