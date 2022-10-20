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

    return recipes.length > 0 ? (
        <div>
            <h2 data-testid='recipes-heading'>Recipes</h2>
            <div>
                <button onClick={handleCreateClick} data-testid='recipes-create-btn'>
                    Create Recipe
                </button>
            </div>

            {recipes && recipes.map(recipe =>
                <Recipe key={recipe.id} {...recipe} deleteRecipe={deleteRecipe}/>)}
        </div>
    ) : (
        <div>
            <h2 data-testid='recipes-heading'>Loading...</h2>

            {isError && <p data-testid='recipes-error'>Error while fetching/deleting</p>}
        </div>
    )
}
