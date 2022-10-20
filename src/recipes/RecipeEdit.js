import useRecipe from "./useRecipe";
import RecipeEditBase from "./RecipeEditBase";
import {useEffect} from "react";
import {useParams} from "react-router-dom";

export default function RecipeEdit() {
    const {recipeId} = useParams()
    const {recipe, fetchRecipe, editRecipe, isRecipeEdited, isError} = useRecipe()

    useEffect(() => {
        fetchRecipe(recipeId)
    }, [])

    function saveRecipe(newRecipe) {
        editRecipe(newRecipe)
    }

    return recipe ? (
        <div>
            {recipe && <RecipeEditBase
                title='Edit Recipe'
                {...recipe}
                saveRecipe={saveRecipe}/>}
            {isError && <p data-testid='error-message'>Error while saving</p>}
            {isRecipeEdited && <p data-testid='success-message'>Edited</p>}
        </div>
    ) : (
        <div>
            <h2 data-testid='recipe-loading'>Loading...</h2>
            {isError && <p data-testid='error-message'>Error while fetching</p>}
        </div>
    )
}
