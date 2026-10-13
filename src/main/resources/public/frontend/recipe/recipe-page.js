/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    var addName = document.getElementById("add-recipe-name-input");
    var addInstructions = document.getElementById("add-recipe-instructions-input");
    var addButton = document.getElementById("add-recipe-submit-input");
    var updateName = document.getElementById("update-recipe-name-input");
    var updateInstructions = document.getElementById("update-recipe-instructions-input");
    var updateButton = document.getElementById("update-recipe-submit-input");
    var deleteName = document.getElementById("delete-recipe-name-input");
    var deleteButton = document.getElementById("delete-recipe-submit-input");
    var recipeList = document.getElementById("recipe-list");
    var adminLink = document.getElementById("admin-link");
    var logoutButton = document.getElementById("logout-button");
    var searchInput = document.getElementById("search-input");
    var searchButton = document.getElementById("search-button");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if(sessionStorage.getItem("auth-token") != null) logoutButton.hidden = false;
    if(sessionStorage.getItem("is-admin") === "true") adminLink.hidden = false;

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addButton.addEventListener("click", () => {addRecipe();})
    deleteButton.addEventListener("click", () => {deleteRecipe();})
    updateButton.addEventListener("click", () => {updateRecipe();})
    searchButton.addEventListener("click", () => {searchRecipes();})
    logoutButton.addEventListener("click", () => {processLogout();})

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();


    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        const search = searchInput.value.trim();
        try {
            const params = new URLSearchParams();
            params.append("name", search);
            const response = await fetch(`${BASE_URL}/recipes?${params}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                  },
            });
            if (response.ok) {
                recipes = await response.json();
                refreshRecipeList();
            } else if (response.status == 404) alert("No recipes found");
            else alert("Unknown issue!");
        } catch (error) {
            alert("Network error.");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        const name = addName.value.trim();
        const instructions = addInstructions.value.trim();
        if (name === "" || instructions === "") alert("Provide a name and instructions to add a recipe")
        else {
            try {
                const response = await fetch(`${BASE_URL}/recipes`, {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                    },
                    body: JSON.stringify({ name, instructions}),
                });
                if (response.ok) {
                    addName.value = "";
                    addInstructions.value = "";
                    getRecipes();
                    refreshRecipeList();
                } else alert("Unknown issue!");
            } catch (error) {
                alert("Network error.");
            }
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        const name = updateName.value.trim();
        const instructions = updateInstructions.value.trim();
        if (name === "" || instructions === "") alert("Provide a name and instructions to update a recipe")
        else {
            getRecipes();
            let id = -1
            for (const recipe of recipes) if (recipe.name === name) id = recipe.id;
            if (id === -1) alert("Could not find recipe to update");
            else {
                try {
                    const response = await fetch(`${BASE_URL}/recipes/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                        },
                        body: JSON.stringify({ name, instructions}),
                    });
                    if (response.ok) {
                        updateName.value = "";
                        updateInstructions.value = "";
                        getRecipes();
                        refreshRecipeList();
                    } else alert("Unknown issue!");
                } catch (error) {
                    alert("Network error.");
                }
            }
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        const name = deleteName.value.trim();
        if (name === "") alert("Provide a name to delete a recipe")
        else {
            getRecipes();
            let id = -1
            for (const recipe of recipes) if (recipe.name === name) id = recipe.id;
            if (id === -1) alert("Could not find recipe to delete");
            else {
                try {
                    const response = await fetch(`${BASE_URL}/recipes/${id}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                        },
                    });
                    if (response.ok) {
                        deleteName.value = "";
                        getRecipes();
                        refreshRecipeList();
                    } else alert("Unknown issue!");
                } catch (error) {
                    alert("Network error.");
                }
            }
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                  },
            });
            if (response.ok) {
                recipes = await response.json();
                refreshRecipeList();
            } else if (response.status == 404) alert("No recipes found");
            else alert("Unknown issue!");
        } catch (error) {
            alert("Network error.");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        recipeList.innerHTML = "";
        for (const recipe of recipes) {
            const listItem = document.createElement("li");
            listItem.appendChild(document.createElement("strong")).textContent =
              recipe.name;
            listItem.append(': ');
            listItem.appendChild(document.createElement("strong")).textContent =
              recipe.instructions;
            recipeList.appendChild(listItem);
        }
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                  },
            });
            if (response.ok) {
                sessionStorage.clear();
                window.location.href = "../login/login-page.html";
            } else alert("Unknown issue!");
        } catch (error) {
            alert("Network error.");
        }
    }

});
