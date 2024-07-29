const apiKey = '6c22f746f2bd4039a6ac4bf158961e1a'; 

document.getElementById('search').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        fetchRecipes(e.target.value);
    }
});

async function fetchRecipes(query) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`);
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        console.error(error);
        displayNoResults(); // Display an error message if fetch fails
    }
}

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = '';
    
    if (recipes.length === 0) {
        displayNoResults(); // Call function to display no results message
        return;
    }
    
    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('border', 'rounded', 'p-4', 'bg-white');
        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-32 object-cover mb-2 rounded">
            <h2 class="text-lg font-bold mb-2">${recipe.title}</h2>
            <button class="view-recipe bg-blue-500 text-white px-4 py-2 rounded" data-id="${recipe.id}">View Recipe</button>
        `;
        recipesContainer.appendChild(recipeElement);
    });
    
    document.querySelectorAll('.view-recipe').forEach(button => {
        button.addEventListener('click', function () {
            const recipeId = this.getAttribute('data-id');
            fetchRecipeDetails(recipeId);
        });
    });
}

function displayNoResults() {
    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = `
        <div class="border rounded p-4 bg-white text-center">
            <p class="text-lg font-bold">No recipes found with that keyword.</p>
        </div>
    `;
}

async function fetchRecipeDetails(id) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
        if (!response.ok) throw new Error('Failed to fetch recipe details');
        const recipe = await response.json();
        displayRecipeDetails(recipe);
    } catch (error) {
        console.error(error);
    }
}

function displayRecipeDetails(recipe) {
    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = `
        <div class="border rounded p-4 bg-white">
            <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-64 object-cover mb-4 rounded">
            <h2 class="text-2xl font-bold mb-4">${recipe.title}</h2>
            <p class="mb-4">${recipe.instructions}</p>
            <h3 class="text-lg font-bold mb-2">Ingredients:</h3>
            <ul class="list-disc list-inside">
                ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
            </ul>
            <button class="back bg-gray-500 text-white px-4 py-2 rounded mt-4">Back</button>
        </div>
    `;
    document.querySelector('.back').addEventListener('click', function () {
        document.getElementById('search').dispatchEvent(new KeyboardEvent('keyup', { 'key': 'Enter' }));
    });
}
