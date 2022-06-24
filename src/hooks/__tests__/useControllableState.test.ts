import { act, cleanup, renderHook } from "@testing-library/react-hooks/native"
import { afterEach, expect, test, vi } from "vitest"
import useControllableState from "../useControllableState"

afterEach(() => {
    cleanup()
})

test("should prioritize controlled value", () => {
    const { result } = renderHook(() => {
        return useControllableState({
            value: 10,
            defaultValue: 20,
        })
    })

    expect(result.current[0]).toBe(10)
})

test("should notify about controlled value changes", () => {
    const onChangeSpy = vi.fn()

    const { result } = renderHook(() => {
        return useControllableState({
            onChange: onChangeSpy,
            value: 10,
        })
    })

    expect(result.current[0]).toBe(10)
    expect(onChangeSpy).not.toHaveBeenCalled()

    act(() => {
        result.current[1](30)
    })
    expect(onChangeSpy).toHaveBeenCalledWith(30)
})

test("should manage uncontrolled values internally", () => {
    const onChangeSpy = vi.fn()

    const { result } = renderHook(() => {
        return useControllableState({
            onChange: onChangeSpy,
        })
    })

    expect(result.current[0]).toBeUndefined()
    expect(onChangeSpy).not.toHaveBeenCalled()

    act(() => {
        result.current[1](20)
    })
    expect(result.current[0]).toBe(20)
    expect(onChangeSpy).toHaveBeenCalledWith(20)

    act(() => {
        result.current[1](100)
    })
    expect(result.current[0]).toBe(100)
    expect(onChangeSpy).toHaveBeenCalledWith(100)

    act(() => {
        result.current[1](undefined)
    })
    expect(result.current[0]).toBeUndefined()
    expect(onChangeSpy).toHaveBeenCalledWith(undefined)
})
