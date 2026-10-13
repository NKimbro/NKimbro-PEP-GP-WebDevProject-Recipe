/**
 * This script defines the add, view, and delete operations for Ingredient objects in the ingredient Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */

    var addName = document.getElementById("add-ingredient-name-input");
    var addButton = document.getElementById("add-ingredient-submit-input");
    var deleteName = document.getElementById("delete-ingredient-name-input");
    var deleteButton = document.getElementById("delete-ingredient-submit-input");
    var ingredientList = document.getElementById("ingredient-list");
    var backLink = document.getElementById("back-link");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addButton.addEventListener("click", () => {addIngredient();})
deleteButton.addEventListener("click", () => {deleteIngredient();})

/*
 * TODO: Create an array to keep track of ingredients
 */

ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
getIngredients();


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    const name = addName.value.trim();
    if (name === "") alert("Provide a name to add an ingredient")
    else {
        try {
            const response = await fetch(`${BASE_URL}/ingredients`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                },
                body: JSON.stringify({ name}),
            });
            if (response.ok) {
                addName.value = "";
                getIngredients();
                refreshIngredientList();
            } else alert("Unknown issue!");
        } catch (error) {
            alert("Network error.");
        }
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
              },
        });
        if (response.ok) {
            ingredients = await response.json();
            refreshIngredientList();
        } else if (response.status == 404) alert("No ingredients found");
        else alert("Unknown issue!");
    } catch (error) {
        alert("Network error.");
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    deleteName = deleteName.trim();
    if (deleteName === "") alert("Provide a name to delete a ingredient")
    else {
        getIngredients();
        let id = -1
        for (const ingredient of ingredients) if (ingredient.name === deleteName) id = ingredient.id;
        if (id === -1) alert("Could not find ingredient to delete");
        else {
            try {
                const response = await fetch(`${BASE_URL}/ingredients/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                    },
                });
                if (response.ok) {
                    deleteName.innerText = "";
                    getingredients();
                    refreshingredientList();
                } else alert("Unknown issue!");
            } catch (error) {
                alert("Network error.");
            }
        }
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientList.innerHTML = "";
    for (const ingredient of ingredients) {
        const listItem = document.createElement("li");
        listItem.appendChild(document.createElement("strong")).textContent =
            ingredient.name;
        listItem.append(': ');
        listItem.appendChild(document.createElement("strong")).textContent =
            ingredient.instructions;
        ingredientList.appendChild(listItem);
    }
}
