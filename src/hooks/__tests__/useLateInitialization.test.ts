import { cleanup, renderHook } from "@testing-library/react-hooks/native"
import { afterEach, expect, test, vi } from "vitest"
import useLateInitialization, { UseLateInitializationReturn } from "../useLateInitialization"

afterEach(() => {
    cleanup()
})

test("should only set state once", async () => {
    const setStateSpy = vi.fn()
    let initializerSpy = vi.fn().mockImplementation(() => {
        throw "not ready"
    })

    const { result, rerender, waitFor } = renderHook(() => {
        return useLateInitialization({
            setState: setStateSpy,
            initializer: initializerSpy,
        })
    })

    expect(initializerSpy).toHaveBeenCalled()
    expect(setStateSpy).not.toHaveBeenCalled()
    expect(result.current.initialized).toBeFalsy()

    initializerSpy = vi.fn().mockReturnValue(5)
    rerender()
    await waitFor(() => {
        expect(initializerSpy).toHaveBeenCalled()
        expect(setStateSpy).toHaveBeenCalledWith(5)
        expect(setStateSpy).toHaveBeenCalledTimes(1)
        expect(result.current.initialized).toBeTruthy()
    })

    initializerSpy = vi.fn().mockImplementation(() => {
        throw "not ready"
    })
    rerender()
    expect(initializerSpy).not.toHaveBeenCalled()
    expect(setStateSpy).toHaveBeenCalledTimes(1)
    expect(result.current.initialized).toBeTruthy()
})

test("should allow manually marking the state as initialized", () => {
    const setStateSpy = vi.fn()
    const initializerSpy = vi.fn().mockReturnValue(5)

    const { result, rerender } = renderHook<{ initialized: boolean }, UseLateInitializationReturn>(
        ({ initialized }) => {
            return useLateInitialization({
                setState: setStateSpy,
                initializer: initializerSpy,
                initialized,
            })
        },
        { initialProps: { initialized: true } },
    )

    expect(result.current.initialized).toBeTruthy()
    expect(initializerSpy).not.toHaveBeenCalled()
    expect(setStateSpy).not.toHaveBeenCalled()

    rerender({ initialized: false })
    expect(result.current.initialized).toBeTruthy()
    expect(initializerSpy).not.toHaveBeenCalled()
    expect(setStateSpy).not.toHaveBeenCalled()
})

test("should wait for Promise to resolve", async () => {
    const setStateSpy = vi.fn()
    const initializerSpy = vi.fn().mockResolvedValue(10)

    const { result, waitFor } = renderHook(() => {
        return useLateInitialization({
            setState: setStateSpy,
            initializer: initializerSpy,
        })
    })

    await waitFor(() => {
        expect(result.current.initialized).toBeTruthy()
        expect(initializerSpy).toHaveBeenCalled()
        expect(setStateSpy).toHaveBeenCalledWith(10)
    })
})
