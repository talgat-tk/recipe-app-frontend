import useRecipes from "./useRecipes";
import {useEffect} from "react";
import Recipe from "./Recipe";
import {useNavigate} from "react-router-dom";

export default function Recipes() {
    const {recipes, fetchRecipes, deleteRecipe, isError} = useRecipes()
    const navigate = useNavigate()

    useEffect(() => {
        fetchRecipes()
    }, [])

    function handleCreateClick() {
        navigate('/create')
    }

    return recipes ? (
        <div>
            <h2>Recipes</h2>
            <div>
                <button onClick={handleCreateClick}>Create Recipe</button>
            </div>

            {recipes && recipes.map(recipe =>
                <Recipe key={recipe.id} {...recipe} deleteRecipe={deleteRecipe}/>)}

            {isError && <p>Error while fetching/deleting</p>}
        </div>
    ) : (
        <div>
            <h2>Loading...</h2>
        </div>
    )
}
