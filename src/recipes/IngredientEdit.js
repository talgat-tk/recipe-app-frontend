export default function IngredientEdit(props) {
    function handleDeleteClick() {
        props.deleteIngredient(props.name)
    }

    return (
        <div>
            <p data-testid='ingredient-name'>
                {props.name}
            </p>
            <div>
                <button data-testid='ingredient-delete-btn' onClick={handleDeleteClick}>
                    Delete Ingredient
                </button>
            </div>
        </div>
    )
}
