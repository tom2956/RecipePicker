
 console.log('this is working'); 

const apiKey = '3feff05697754166b193f038648d67e4';

async function searchRecipes(query, glutenFree, vegetarian) {
  try {
    let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;
    if (glutenFree) {
      apiUrl += '&diet=gluten+free';
    }
    if (vegetarian) {
      apiUrl += '&diet=vegetarian';
    }
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayRecipes(data.results);
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

function displayRecipes(recipes) {
  const recipeList = document.getElementById('recipeList');
  recipeList.innerHTML = '';

  if (recipes.length === 0) {
    const noResultsMessage = createNoResultsMessage();
    recipeList.appendChild(noResultsMessage);
  } else {
    recipes.forEach(async (recipe) => {
      const recipeDetails = await getRecipeDetails(recipe.id);
      const recipeCard = createRecipeCard(recipe, recipeDetails);
      recipeList.appendChild(recipeCard);
    });
  }
}

function createNoResultsMessage() {
  const noResultsMessage = document.createElement('p');
  noResultsMessage.textContent = 'No recipes found.';
  return noResultsMessage;
}

function createRecipeCard(recipe, recipeDetails) {
  const recipeCard = document.createElement('div');
  recipeCard.classList.add('recipe-card');

  const title = document.createElement('h3');
  title.textContent = recipe.title;

  const image = document.createElement('img');
  image.src = recipe.image;

  const recipeDetailsContainer = document.createElement('div');
  recipeDetailsContainer.classList.add('recipe-details');

  if (Array.isArray(recipeDetails.ingredients)) {
    const ingredients = document.createElement('p');
    ingredients.innerHTML = `<strong>Ingredients:</strong> ${recipeDetails.ingredients.join(', ')}`;
    recipeDetailsContainer.appendChild(ingredients);
  }

  if (recipeDetails.instructions) {
    const instructions = document.createElement('p');
    instructions.innerHTML = `<strong>Instructions:</strong> ${recipeDetails.instructions}`;
    recipeDetailsContainer.appendChild(instructions);
  }

  recipeCard.appendChild(title);
  recipeCard.appendChild(image);
  recipeCard.appendChild(recipeDetailsContainer);

  return recipeCard;
}

async function getRecipeDetails(recipeId) {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchInput = document.getElementById('searchInput');
  const glutenFreeCheckbox = document.getElementById('glutenFreeCheckbox');
  const vegetarianCheckbox = document.getElementById('vegetarianCheckbox');

  const searchQuery = searchInput.value.trim();
  const glutenFree = glutenFreeCheckbox.checked;
  const vegetarian = vegetarianCheckbox.checked;

  if (searchQuery !== '') {
    searchRecipes(searchQuery, glutenFree, vegetarian);
  }
});

const randomButton = document.getElementById('randomButton');
randomButton.addEventListener('click', () => {
  getRandomRecipe();
});

async function getRandomRecipe() {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`);
    const data = await response.json();
    const recipe = data.recipes[0];
    const recipeDetails = await getRecipeDetails(recipe.id);
    displayRandomRecipe(recipe, recipeDetails);
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

function displayRandomRecipe(recipe, recipeDetails) {
  const recipeList = document.getElementById('recipeList');
  recipeList.innerHTML = '';

  const recipeCard = createRecipeCard(recipe, recipeDetails);
  recipeList.appendChild(recipeCard);
}

