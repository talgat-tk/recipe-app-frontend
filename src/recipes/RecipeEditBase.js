import {v4 as uuid} from "uuid"
import {useState} from "react";
import useInputState from "./useInputState";
import IngredientEdit from "./IngredientEdit";
import {useNavigate} from "react-router-dom";

export default function RecipeEditBase(props) {
    const navigate = useNavigate()
    const [name, handleNameChange] = useInputState(props.name)
    const [description, handleDescriptionChange] = useInputState(props.description)
    const [ingredients, setIngredients] = useState(props.ingredients)
    const [newIngredient, handleNewIngredientChange, setNewIngredient] = useInputState('')

    function handleBackClick() {
        navigate('/')
    }

    function addIngredient() {
        const newIngredients = [...ingredients, {
            name: newIngredient
        }]
        setIngredients(newIngredients)
        setNewIngredient('')
    }

    function deleteIngredient(name) {
        let ingredientIndex = -1
        for (let index = 0; index < ingredients.length; index++) {
            let ingredient = ingredients[index]
            if (ingredient.name === name) {
                ingredientIndex = index
                break
            }
        }

        const newIngredients = [
            ...ingredients.slice(0, ingredientIndex),
            ...ingredients.slice(ingredientIndex + 1)
        ]

        setIngredients(newIngredients)
    }

    function handleSaveClick() {
        const newRecipe = {
            name,
            description,
            ingredients,
        }

        props.saveRecipe(newRecipe)
    }

    return (
        <div>
            <h2 data-testid='recipe-heading'>
                {props.title}
            </h2>
            <div>
                <button onClick={handleBackClick}>Back</button>
            </div>
            <div>
                <input data-testid='recipe-name' type="text" value={name} onChange={handleNameChange}/>
            </div>
            <div>
                <textarea data-testid='recipe-description' value={description} onChange={handleDescriptionChange}></textarea>
            </div>
            <div>
                <div>
                    <input data-testid='recipe-new-ingredient' type="text" value={newIngredient} onChange={handleNewIngredientChange}/>
                </div>
                <div>
                    <button data-testid='recipe-add-ingredient-btn' onClick={addIngredient}>Add Ingredient</button>
                </div>
            </div>
            <div>
                {ingredients.map(ingredient => {
                    return <IngredientEdit
                        key={uuid()}
                        name={ingredient.name}
                        deleteIngredient={deleteIngredient}/>
                })}
            </div>
            <div>
                <button data-testid='recipe-save-btn' onClick={handleSaveClick}>
                    Save
                </button>
            </div>
        </div>
    )
}
