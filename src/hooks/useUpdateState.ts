import { Dispatch, SetStateAction, useCallback } from "react"

export type UseUpdateStateReturn<S> = (updateData: Partial<S>) => void

export default function useUpdateState<S extends Record<string | number | symbol, unknown>>(
    setState: Dispatch<SetStateAction<S>>,
): UseUpdateStateReturn<S> {
    const stateUpdateFn: UseUpdateStateReturn<S> = useCallback(
        updateData => {
            setState(prev => ({
                ...prev,
                ...updateData,
            }))
        },
        [setState],
    )

    return stateUpdateFn
}
