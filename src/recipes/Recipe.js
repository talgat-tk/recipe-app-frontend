import {useNavigate} from "react-router-dom";
import {v4 as uuid} from "uuid";

export default function Recipe(props) {
    const navigate = useNavigate()

    function handleDeleteClick() {
        props.deleteRecipe(props.id)
    }

    function handleEditClick() {
        navigate(`/${props.id}/edit`)
    }

    return (
        <div>
            <h3 data-testid='recipe-name'>{props.name}</h3>
            <p data-testid='recipe-description'>{props.description}</p>
            <ul>
                {props.ingredients.map(ingredient =>
                    <li key={uuid()} data-testid='recipe-ingredient'>{ingredient.name}</li>)}
            </ul>
            <div>
                <button onClick={handleEditClick} data-testid='recipe-edit-btn'>
                    Edit
                </button>
            </div>
            <div>
                <button onClick={handleDeleteClick} data-testid='recipe-delete-btn'>
                    Delete
                </button>
            </div>
        </div>
    )
}
