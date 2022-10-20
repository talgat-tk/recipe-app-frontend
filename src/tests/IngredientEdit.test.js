import {render, screen} from "@testing-library/react";
import IngredientEdit from "../recipes/IngredientEdit";
import "@testing-library/jest-dom/extend-expect"
import userEvent from "@testing-library/user-event";

describe('Ingredient Edit Test Suite', function () {
    test('Renders correctly', function () {
        render(<IngredientEdit name='Breakfast'/>)

        expect(screen.getByTestId('ingredient-name')).toHaveTextContent('Breakfast')
        expect(screen.getByTestId('ingredient-delete-btn')).toHaveTextContent('Delete Ingredient')
    })

    test('Delete button invokes callback', function () {
        const mockCallback = jest.fn()

        render(<IngredientEdit name='Lunch' deleteIngredient={mockCallback}/>)

        const deleteBtn = screen.getByTestId('ingredient-delete-btn')

        userEvent.click(deleteBtn)

        expect(mockCallback).toHaveBeenNthCalledWith(1, 'Lunch')
    })
});
