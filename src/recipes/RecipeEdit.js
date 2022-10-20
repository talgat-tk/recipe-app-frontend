import useRecipe from "./RecipeHooks";
import RecipeEditBase from "./RecipeEditBase";
import {useEffect} from "react";
import {useParams} from "react-router-dom";

export default function RecipeEdit() {
    const {recipeId} = useParams()
    const {recipe, fetchRecipe, editRecipe, isError} = useRecipe()

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
            {isError && <p>Error while fetching/saving</p>}
        </div>
    ) : (
        <div>
            <h2>Loading...</h2>
        </div>
    )
}
