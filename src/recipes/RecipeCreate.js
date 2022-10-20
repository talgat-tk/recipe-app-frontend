import useRecipe from "./useRecipe";
import RecipeEditBase from "./RecipeEditBase";

export default function RecipeCreate() {
    const initialRecipe = {
        name: '',
        description: '',
        ingredients: [],
    }
    const {createRecipe, isError} = useRecipe()

    function saveRecipe(newRecipe) {
        createRecipe(newRecipe)
    }

    return (
        <div>
            <RecipeEditBase
                title='Create Recipe'
                {...initialRecipe}
                saveRecipe={saveRecipe}/>
            {isError && <p>Error while creating</p>}
        </div>
    )
}
