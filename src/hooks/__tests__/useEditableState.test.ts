import { act, cleanup, renderHook } from "@testing-library/react-hooks/native"
import { afterEach, expect, test } from "vitest"
import useEditableState, { EditableStateStatus } from "../useEditableState"

afterEach(() => {
    cleanup()
})

test("should update state with latest observed value", () => {
    const { result, rerender } = renderHook(
        (value: number) => {
            return useEditableState(value)
        },
        { initialProps: 10 },
    )

    expect(result.current[0]).toBe(10)
    expect(result.current[2].status).toBe(EditableStateStatus.OBSERVED)

    rerender(50)
    expect(result.current[0]).toBe(50)
    expect(result.current[2].status).toBe(EditableStateStatus.OBSERVED)
})

test("should set status to 'EDITED' if state is updated manually", () => {
    const { result, rerender } = renderHook(
        (value: number) => {
            return useEditableState(value)
        },
        { initialProps: 10 },
    )

    expect(result.current[0]).toBe(10)
    expect(result.current[2].status).toBe(EditableStateStatus.OBSERVED)

    act(() => {
        result.current[1](50)
    })
    expect(result.current[0]).toBe(50)
    expect(result.current[2].status).toBe(EditableStateStatus.EDITED)

    rerender(80)
    expect(result.current[0]).toBe(50)
    expect(result.current[2].status).toBe(EditableStateStatus.EDITED)
})

test("should reset status to 'OBSERVED'", () => {
    const { result } = renderHook(() => {
        return useEditableState(10)
    })

    expect(result.current[0]).toBe(10)
    expect(result.current[2].status).toBe(EditableStateStatus.OBSERVED)

    act(() => {
        result.current[1](50)
    })
    expect(result.current[0]).toBe(50)
    expect(result.current[2].status).toBe(EditableStateStatus.EDITED)

    act(() => {
        result.current[2].reset()
    })
    expect(result.current[0]).toBe(50)
    expect(result.current[2].status).toBe(EditableStateStatus.OBSERVED)
})

test("should reset status to 'OBSERVED' and state to passed value", () => {
    const { result } = renderHook(() => {
        return useEditableState(10)
    })

    expect(result.current[0]).toBe(10)
    expect(result.current[2].status).toBe(EditableStateStatus.OBSERVED)

    act(() => {
        result.current[1](50)
    })
    expect(result.current[0]).toBe(50)
    expect(result.current[2].status).toBe(EditableStateStatus.EDITED)

    act(() => {
        result.current[2].resetWithValue(80)
    })
    expect(result.current[0]).toBe(80)
    expect(result.current[2].status).toBe(EditableStateStatus.OBSERVED)
})
