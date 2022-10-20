import useRecipe from "./useRecipe";
import RecipeEditBase from "./RecipeEditBase";

export default function RecipeCreate() {
    const initialRecipe = {
        name: '',
        description: '',
        ingredients: [],
    }
    const {recipe, createRecipe, isError} = useRecipe()

    function saveRecipe(newRecipe) {
        createRecipe(newRecipe)
    }

    return (
        <div>
            <RecipeEditBase
                title='Create Recipe'
                {...initialRecipe}
                saveRecipe={saveRecipe}/>
            {recipe &&
                <p data-testid='success-message'>Created</p>}
            {isError &&
                <p data-testid='error-message'>Error while creating</p>}
        </div>
    )
}
