import {render, screen} from "@testing-library/react";
import RecipeCreate from "../recipes/RecipeCreate";
import {MemoryRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {RECIPES_URL} from "../recipes/useRecipes";

describe('RecipeCreate Test Suite', function () {
    const server = setupServer()

    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    test('Initial recipe renders correctly', function () {
        render(<MemoryRouter><RecipeCreate/></MemoryRouter>)

        expect(screen.getByTestId('recipe-heading')).toHaveTextContent('Create Recipe')
        expect(screen.getByTestId('recipe-name')).toHaveValue('')
        expect(screen.getByTestId('recipe-description')).toHaveValue('')
        expect(screen.getByTestId('recipe-new-ingredient')).toHaveValue('')
        expect(screen.queryByTestId('ingredient-name')).toBeNull()
    })

    test('Save button creates a new recipe', async function () {
        const mockRecipe = {
            name: 'Soup',
            description: 'Recipe for soup',
            ingredients: [{
                name: 'Meat',
            }],
        }

        let callTimes = 0

        server.use(
            rest.post(RECIPES_URL, async (req, res, context) => {
                const payload = await req.json()

                expect(payload).toEqual(mockRecipe)

                callTimes += 1

                return res(context.json(mockRecipe))
            })
        )

        render(<MemoryRouter><RecipeCreate/></MemoryRouter>)

        const nameEl = screen.getByTestId('recipe-name')
        const descriptionEl = screen.getByTestId('recipe-description')
        const newIngredientEl = screen.getByTestId('recipe-new-ingredient')
        const addIngredientBtn = screen.getByTestId('recipe-add-ingredient-btn')
        const saveBtn = screen.getByTestId('recipe-save-btn')

        userEvent.type(nameEl, mockRecipe.name)
        userEvent.type(descriptionEl, mockRecipe.description)
        userEvent.type(newIngredientEl, mockRecipe.ingredients[0].name)
        userEvent.click(addIngredientBtn)
        userEvent.click(saveBtn)

        await screen.findByTestId('success-message')

        expect(callTimes).toEqual(1)

        expect(screen.getByTestId('success-message')).toHaveTextContent('Created')
        expect(screen.queryByTestId('error-message')).toBeNull()
    })
})
