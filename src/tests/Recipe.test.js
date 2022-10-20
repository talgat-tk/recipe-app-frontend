import {render, screen} from "@testing-library/react";
import Recipe from "../recipes/Recipe";
import {MemoryRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe('Recipe Test Suite', function () {
    test('Renders correctly', function () {
        const mockRecipe = {
            name: 'Breakfast',
            description: 'Recipe for breakfast',
            ingredients: [{
                name: 'Eggs',
            }, {
                name: 'Toast',
            }],
        }

        render(
            <MemoryRouter>
                <Recipe {...mockRecipe}/>
            </MemoryRouter>)

        expect(screen.getByTestId('recipe-name')).toHaveTextContent('Breakfast')
        expect(screen.getByTestId('recipe-description'))
            .toHaveTextContent('Recipe for breakfast')

        const ingredients = mockRecipe.ingredients.map(ingredient => ingredient.name)
        const ingredientEls = screen.getAllByTestId('recipe-ingredient')

        expect(ingredients.length).toEqual(ingredientEls.length)

        ingredientEls.map(ingredientEl => {
            expect(ingredients).toContain(ingredientEl.innerHTML)
        })

        expect(screen.getByTestId('recipe-edit-btn')).toHaveTextContent('Edit')
        expect(screen.getByTestId('recipe-delete-btn')).toHaveTextContent('Delete')
    })
    
    test('Delete button invokes callback', function () {
        const mockRecipe = {
            id: '15',
            name: 'Lunch',
            description: 'Recipe for lunch',
            ingredients: [{
                name: 'Soup',
            }, {
                name: 'Steak',
            }],
        }

        const mockCallback = jest.fn()

        render(
            <MemoryRouter>
                <Recipe {...mockRecipe} deleteRecipe={mockCallback}/>
            </MemoryRouter>)

        const deleteBtn = screen.getByTestId('recipe-delete-btn')

        userEvent.click(deleteBtn)

        expect(mockCallback).toHaveBeenNthCalledWith(1, '15')
    })

    test('Edit button navigates to edit-page', async function () {
        const mockRecipe = {
            id: '20',
            name: 'Dinner',
            description: 'Recipe for dinner',
            ingredients: [{
                name: 'French fries',
            }, {
                name: 'Wine',
            }],
        }

        render(
            <MemoryRouter>
                <Recipe {...mockRecipe}/>
            </MemoryRouter>)

        const editBtn = await screen.findByTestId('recipe-edit-btn')

        userEvent.click(editBtn)

        // TODO
        // expect(history).toHaveBeenNthCalledWith(1, '/20/edit')
    })
});
