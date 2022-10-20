import {useState} from "react";
import axios from "axios";

const RECIPES_URL = 'http://localhost:8000/recipes/'

export default function useRecipes() {
    const [recipes, setRecipes] = useState([])
    const [isError, setIsError] = useState(false)

    function fetchRecipes() {
        axios.get(RECIPES_URL)
            .then(response => {
                setRecipes(response.data)
                setIsError(false)
            })
            .catch(error => {
                console.error(error)
                setIsError(true)
            })
    }

    function deleteRecipe(recipeId) {
        axios.delete(`${RECIPES_URL}${recipeId}/`)
            .then(() => {
                setRecipes(recipes
                    .filter(recipe => recipe.id !== recipeId))
                setIsError(false)
            })
            .catch(error => {
                console.error(error)
                setIsError(true)
            })
    }

    return {recipes, fetchRecipes, deleteRecipe, isError}
}

export {RECIPES_URL}
