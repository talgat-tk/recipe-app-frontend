import useInputState from "../recipes/useInputState";
import {act, renderHook} from "@testing-library/react";

describe('useInputState Test Suite', function () {
    test('Array of length 3 is returned', function () {
        const {result} = renderHook(useInputState)

        expect(result.current.length).toEqual(3)
    })

    test('Initial value is set', function () {
        const initialValue = 'hello'

        const {result} = renderHook(() => useInputState(initialValue))

        expect(result.current[0]).toEqual(initialValue)
    })

    test('handleChange sets value', async function () {
        const initialValue = 'hello'

        const {result} = renderHook(() => useInputState(initialValue))

        const handleChange = result.current[1]

        const mockEvent = {
            target: {
                value: '5'
            }
        }

        await act(() => handleChange(mockEvent))

        expect(result.current[0]).toEqual('5')
    })

    test('setValue sets value', async function () {
        const initialValue = 'hello'

        const {result} = renderHook(() => useInputState(initialValue))

        const setValue = result.current[2]

        await act(() => setValue('1'))

        expect(result.current[0]).toEqual('1')
    })
});
