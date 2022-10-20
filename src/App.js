import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Recipes from "./recipes/Recipes";
import RecipeEdit from "./recipes/RecipeEdit";
import RecipeCreate from "./recipes/RecipeCreate";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/'>
            <Route path='/' element={<Recipes/>}/>
            <Route path='/create' element={<RecipeCreate/>}/>
            <Route path='/:recipeId/edit' element={<RecipeEdit/>}/>
        </Route>
    )
)

export default function App() {
  return <RouterProvider router={router}/>
}
