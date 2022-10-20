import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import Recipes from "../recipes/Recipes";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {RECIPES_URL} from "../recipes/useRecipes";
import userEvent from "@testing-library/user-event";

describe('Recipes Test Suite', function () {
    const server = setupServer()

    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    test('Loading renders correctly', function () {
        render(
            <MemoryRouter>
                <Recipes/>
            </MemoryRouter>)

        expect(screen.getByTestId('recipes-heading'))
            .toHaveTextContent('Loading...')
    })

    test('Fetching with correct server', async function () {
        const mockRecipes = [{
            id: '1',
            name: 'Soup',
            ingredients: [{
                name: 'Water',
            }, {
                name: 'Meat',
            }]
        }]

        render(
            <MemoryRouter>
                <Recipes/>
            </MemoryRouter>)

        server.use(
            rest.get(RECIPES_URL, (req, res, context) => {
                return res(context.json(mockRecipes))
            })
        )

        expect(screen.queryByText('Recipes')).toBeNull()
        expect(screen.queryByTestId('recipes-create-btn')).toBeNull()
        expect(screen.queryByTestId('recipes-recipe')).toBeNull()

        await screen.findByText('Recipes')

        expect(screen.getByTestId('recipes-heading'))
            .toHaveTextContent('Recipes')
        expect(screen.getByTestId('recipes-create-btn'))
            .toHaveTextContent('Create Recipe')
        expect(screen.queryByTestId('recipes-error')).toBeNull()
    })

    test('Fetching with incorrect server', async function () {
        render(
            <MemoryRouter>
                <Recipes/>
            </MemoryRouter>)

        server.use(
            rest.get(RECIPES_URL, (req, res, context) => {
                return res(context.status(500))
            })
        )

        await screen.findByText('Error while fetching/deleting')

        expect(screen.queryByText('Recipes')).toBeNull()
        expect(screen.getByTestId('recipes-heading'))
            .toHaveTextContent('Loading...')
        expect(screen.queryByTestId('recipes-create-btn')).toBeNull()
        expect(screen.getByTestId('recipes-error'))
            .toHaveTextContent('Error while fetching/deleting')
    })

    test('Create button navigates to create-page', async function () {
        render(
            <MemoryRouter>
                <Recipes/>
            </MemoryRouter>)

        const createBtn = await screen.findByTestId('recipes-create-btn')

        userEvent.click(createBtn)

        // TODO
        // expect(history).toHaveBeenNthCalledWith(1, '/create')
    })
})
