import {setupServer} from "msw/node";
import {render, screen} from "@testing-library/react";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import RecipeEdit from "../recipes/RecipeEdit";
import {rest} from "msw";
import {RECIPES_URL} from "../recipes/useRecipes";
import userEvent from "@testing-library/user-event";

describe('RecipeEdit Test Suite', function () {
    const server = setupServer()

    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    test('Loading renders correctly', function () {
        render(
            <MemoryRouter>
                <RecipeEdit/>
            </MemoryRouter>
        )

        expect(screen.getByTestId('recipe-loading')).toHaveTextContent('Loading...')
    })

    test('Fetched recipe renders correctly', async function () {
        const mockRecipe = {
            id: '45',
            name: 'Soup',
            description: 'Recipe for soup',
            ingredients: [{
                name: 'Meat',
            }],
        }

        server.use(
            rest.get(`${RECIPES_URL}${mockRecipe.id}`, (req, res, context) => {
                return res(context.json(mockRecipe))
            })
        )

        render(
            <MemoryRouter initialEntries={[`/${mockRecipe.id}/edit/`]}>
                <Routes>
                    <Route path="/:recipeId/edit/" element={<RecipeEdit/>} />
                </Routes>
            </MemoryRouter>)

        await screen.findByTestId('recipe-heading')

        expect(screen.getByTestId('recipe-heading')).toHaveTextContent('Edit Recipe')
        expect(screen.getByTestId('recipe-name')).toHaveValue(mockRecipe.name)
        expect(screen.getByTestId('recipe-description')).toHaveValue(mockRecipe.description)
        expect(screen.getByTestId('ingredient-name')).toHaveTextContent(mockRecipe.ingredients[0].name)
    })

    test('Edited recipe is saved correctly', async function () {
        const mockRecipe = {
            id: '45',
            name: 'Soup',
            description: 'Recipe for soup',
            ingredients: [{
                name: 'Meat',
            }],
        }

        let putCallTimes = 0

        server.use(
            rest.get(`${RECIPES_URL}${mockRecipe.id}`, (req, res, context) => {
                return res(context.json(mockRecipe))
            }),
            rest.put(`${RECIPES_URL}${mockRecipe.id}`, async (req, res, context) => {
                const payload = await req.json()

                putCallTimes += 1

                return res(context.json(payload))
            })
        )

        render(
            <MemoryRouter initialEntries={[`/${mockRecipe.id}/edit/`]}>
                <Routes>
                    <Route path="/:recipeId/edit/" element={<RecipeEdit/>} />
                </Routes>
            </MemoryRouter>)

        await screen.findByTestId('recipe-heading')

        const mockEditRecipe = {
            name: 'Spaghetti with Meat Balls',
            description: 'Good recipe',
            ingredients: [{
                name: 'Spaghetti'
            }, {
                name: 'Meat Balls'
            }]
        }

        const nameEl = screen.getByTestId('recipe-name')
        const descriptionEl = screen.getByTestId('recipe-description')
        const newIngredientEl = screen.getByTestId('recipe-new-ingredient')
        const addIngredientBtn = screen.getByTestId('recipe-add-ingredient-btn')
        const saveBtn = screen.getByTestId('recipe-save-btn')
        const ingredientDeleteBtn = screen.getByTestId('ingredient-delete-btn')

        userEvent.type(nameEl, mockEditRecipe.name)
        userEvent.type(descriptionEl, mockEditRecipe.description)
        userEvent.type(newIngredientEl, mockEditRecipe.ingredients[0].name)
        userEvent.click(addIngredientBtn)
        userEvent.click(ingredientDeleteBtn)
        userEvent.type(newIngredientEl, mockEditRecipe.ingredients[1].name)
        userEvent.click(addIngredientBtn)

        userEvent.click(saveBtn)

        await screen.findByTestId('success-message')

        expect(putCallTimes).toEqual(1)

        expect(screen.getByTestId('success-message')).toHaveTextContent('Edited')
        expect(screen.queryByTestId('error-message')).toBeNull()
    })
})
