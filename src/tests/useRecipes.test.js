import {setupServer} from "msw/node";
import {rest} from "msw";
import useRecipes, {RECIPES_URL} from "../recipes/useRecipes";
import {act, renderHook} from "@testing-library/react";

describe('useRecipes Fetching Test Suite', function () {
    const server = setupServer()

    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    test('Initially empty', async function() {
        const {result} = renderHook(useRecipes)

        expect(result.current.recipes).toEqual([])
    })

    test('Fetch with correct server', async function () {
        const mockRecipes = [{
            id: '1',
            name: 'Breakfast',
            description: 'Recipe for breakfast',
            ingredients: [{
                name: 'Eggs',
            }, {
                name: 'Toast',
            }],
        }, {
            id: '2',
            name: 'Lunch',
            description: 'Recipe for lunch',
            ingredients: [{
                name: 'Soup',
            }],
        }]

        server.use(
            rest.get(RECIPES_URL, (req, res, context) => {
                return res(context.json(mockRecipes))
            })
        )

        const {result} = renderHook(useRecipes)

        await act(result.current.fetchRecipes)

        expect(JSON.stringify(result.current.recipes)).toEqual(JSON.stringify(mockRecipes))
        expect(result.current.isError).toBeFalsy()
    })

    test('Fetch with incorrect server', async function () {
        server.use(
            rest.get(RECIPES_URL, (req, res, context) => {
                return res(context.status(500))
            })
        )

        const {result} = renderHook(useRecipes)

        expect(result.current.recipes).toEqual([])

        await act(result.current.fetchRecipes)

        expect(result.current.recipes).toEqual([])
        expect(result.current.isError).toBeTruthy()
    })
})

describe('useRecipes Deleting Test Suite', function () {
    const mockRecipes = [{
        id: '1',
        name: 'Breakfast',
        description: 'Recipe for breakfast',
        ingredients: [{
            name: 'Eggs',
        }, {
            name: 'Toast',
        }],
    }, {
        id: '2',
        name: 'Lunch',
        description: 'Recipe for lunch',
        ingredients: [{
            name: 'Soup',
        }],
    }, {
        id: '3',
        name: 'Dinner',
        description: 'Recipe for lunch',
        ingredients: [],
    }]

    const server = setupServer(
        rest.get(RECIPES_URL, (req, res, context) => {
            return res(context.json(mockRecipes))
        }),
    )

    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    test('Delete with correct server', async function() {
        server.use(
            rest.delete(`${RECIPES_URL}2/`, (req, res, context) => {
                return res(context.status(204))
            })
        )

        const {result} = renderHook(useRecipes)

        await act(result.current.fetchRecipes)
        
        await act(() => result.current.deleteRecipe('2'))

        expect(result.current.recipes.length).toEqual(2)

        expect(result.current.isError).toBeFalsy()
        expect(JSON.stringify(result.current.recipes))
            .toEqual(JSON.stringify([mockRecipes[0], mockRecipes[2]]))
    })

    test('Delete with incorrect server', async function() {
        server.use(
            rest.delete(`${RECIPES_URL}2/`, (req, res, context) => {
                return res(context.status(500))
            })
        )

        const {result} = renderHook(useRecipes)

        await act(result.current.fetchRecipes)

        await act(() => result.current.deleteRecipe('2'))

        // expect(result.current.isError).toBeTruthy()
        expect(JSON.stringify(result.current.recipes)).toEqual(JSON.stringify(mockRecipes))
    })
})
