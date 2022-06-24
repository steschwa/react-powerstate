import { expect, test } from "vitest"
import { getNextStateProducer } from "../state"

test("should return passed value", () => {
    const stateProducer = getNextStateProducer(50)

    expect(stateProducer).toBeTypeOf("function")
    expect(stateProducer(0)).toBe(50)
})

test("should return state update function", () => {
    const stateProducer = getNextStateProducer<number>(prev => prev + 5)

    expect(stateProducer).toBeTypeOf("function")
    expect(stateProducer(20)).toBe(25)
})
