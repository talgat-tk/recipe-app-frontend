import {act, renderHook} from "@testing-library/react";
import useRecipe from "../recipes/useRecipe";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {RECIPES_URL} from "../recipes/useRecipes";

describe('useRecipe Test Suite', function () {
    const server = setupServer()

    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    test('Initially empty', async function () {
        const {result} = renderHook(useRecipe)

        expect(result.current.recipe).toBeNull()
        expect(result.current.isError).toBeFalsy()
    })

    test('Fetch with correct server', async function () {
        const mockRecipe = {
            id: '50',
            name: 'Breakfast',
            description: 'Recipe for breakfast',
            ingredients: [{
                name: 'Eggs',
            }, {
                name: 'Toast',
            }],
        }

        server.use(
            rest.get(`${RECIPES_URL}50/`, (req, res, context) => {
                return res(context.json(mockRecipe))
            })
        )

        const {result} = renderHook(useRecipe)

        await act(() => result.current.fetchRecipe('50'))

        expect(result.current.recipe).toEqual(mockRecipe)
        expect(result.current.isError).toBeFalsy()
    })

    test('Fetch with incorrect server', async function () {
        server.use(
            rest.get(`${RECIPES_URL}50/`, (req, res, context) => {
                return res(context.status(500))
            })
        )

        const {result} = renderHook(useRecipe)

        await act(() => result.current.fetchRecipe('50'))

        expect(result.current.recipe).toBeNull()
        expect(result.current.isError).toBeTruthy()
    })

    test('Create with correct server', async function() {
        const mockPayload = {
            name: 'Lunch',
            description: 'Recipe for lunch',
            ingredients: [{
                name: 'Soup',
            }],
        }

        server.use(
            rest.post(RECIPES_URL, async (req, res, context) => {
                const mockResponse = await req.json()

                mockResponse.id = '100'

                return res(context.json(mockResponse))
            })
        )

        const {result} = renderHook(useRecipe)

        await act(() => result.current.createRecipe(mockPayload))

        expect(result.current.isError).toBeFalsy()
        expect(result.current.recipe).toEqual({id: '100', ...mockPayload})
    })

    test('Create with incorrect server', async function() {
        const mockPayload = {
            name: 'Dinner',
            description: 'Recipe for dinner',
            ingredients: [{
                name: 'Steak',
            }, {
                name: 'Wine',
            }],
        }

        server.use(
            rest.post(RECIPES_URL, async (req, res, context) => {
                return res(context.status(500))
            })
        )

        const {result} = renderHook(useRecipe)

        await act(() => result.current.createRecipe(mockPayload))

        expect(result.current.isError).toBeTruthy()
        expect(result.current.recipe).toBeNull()
    })

    test('Edit with correct server', async function() {
        const mockCreatePayload = {
            name: 'Breakfast',
            description: 'Recipe for breakfast',
            ingredients: [{
                name: 'Eggs',
            }, {
                name: 'Toast',
            }],
        }

        const mockEditPayload = {
            name: 'Lunch',
            description: 'Recipe for lunch',
            ingredients: [{
                name: 'Soup',
            }, {
                name: 'Salad',
            }],
        }

        server.use(
            rest.post(RECIPES_URL, async (req, res, context) => {
                const mockResponse = await req.json()
                mockResponse.id = '100'
                return res(context.json(mockResponse))
            }),
            rest.put(`${RECIPES_URL}100/`, async (req, res, context) => {
                const mockResponse = await req.json()
                mockResponse.id = '100'
                return res(context.json(mockResponse))
            })
        )

        const {result} = renderHook(useRecipe)

        await act(() => result.current.createRecipe(mockCreatePayload))

        await act(() => result.current.editRecipe(mockEditPayload))

        expect(result.current.isError).toBeFalsy()
        expect(result.current.recipe).toEqual({id: '100', ...mockEditPayload})
    })

    test('Edit with incorrect server', async function() {
        const mockCreatePayload = {
            name: 'Breakfast',
            description: 'Recipe for breakfast',
            ingredients: [{
                name: 'Eggs',
            }, {
                name: 'Toast',
            }],
        }

        const mockEditPayload = {
            name: 'Lunch',
            description: 'Recipe for lunch',
            ingredients: [{
                name: 'Soup',
            }, {
                name: 'Salad',
            }],
        }

        server.use(
            rest.post(RECIPES_URL, async (req, res, context) => {
                const mockResponse = await req.json()
                mockResponse.id = '100'
                return res(context.json(mockResponse))
            }),
            rest.put(`${RECIPES_URL}100/`, async (req, res, context) => {
                return res(context.status(500))
            })
        )

        const {result} = renderHook(useRecipe)

        await act(() => result.current.createRecipe(mockCreatePayload))

        await act(() => result.current.editRecipe(mockEditPayload))

        expect(result.current.isError).toBeTruthy()
        expect(result.current.recipe).toEqual({id: '100', ...mockCreatePayload})
    })
});
