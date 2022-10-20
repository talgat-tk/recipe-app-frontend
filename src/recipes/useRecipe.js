import {useState} from "react";
import axios from "axios";
import {RECIPES_URL} from "./useRecipes";

export default function useRecipe() {
    const [recipe, setRecipe] = useState(null)
    const [isError, setIsError] = useState(false)

    function fetchRecipe(recipeId) {
        return axios.get(`${RECIPES_URL}${recipeId}/`)
            .then(response => {
                setRecipe(response.data)
                setIsError(false)
            })
            .catch(error => {
                console.error(error)
                setIsError(true)
            })
    }

    function createRecipe(newRecipe) {
        axios.post(RECIPES_URL, newRecipe)
            .then(() => {
                setRecipe(newRecipe)
                setIsError(false)
            })
            .catch(error => {
                console.error(error)
                setIsError(true)
            })
    }

    function editRecipe(newRecipe) {
        axios.put(`${RECIPES_URL}${recipe.id}/`, newRecipe)
            .then(() => {
                setRecipe(newRecipe)
                setIsError(false)
            })
            .catch(error => {
                console.error(error)
                setIsError(true)
            })
    }

    return {recipe, fetchRecipe, createRecipe, editRecipe, isError}
}
