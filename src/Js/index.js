import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import{ elements, renderLoader, clearLoader} from './views/base';

/** Global State of the app
* - Search object
* - Current Recipe object 
* - Shopping List object 
*- liked recipes 
*/

const state = {};


const controlSearch = async () => {
    
    // 1) get the qury from the view 
    const query = searchView.getInput();
//    console.log(query);// TODO
    
    if (query){
    
        // 2) new search object and add to state
        state.search = new Search(query);
        
        // 3) Prepare UI for Results 
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        
        
        
        // 4) search for recipies 
        try{
        await state.search.getResults();
        
        
        // 5) render results on UI
        clearLoader();
        
        
        searchView.renderResults(state.search.result);
        }catch(error){
            alert('something wrong with search');
            clearLoader();
        }
    }
};


elements.searchForm.addEventListener('submit', e =>{
   e.preventDefault();
    controlSearch();
    
    
});





elements.searchResPages.addEventListener('click', e => {
    const btn =e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        // console.log(goToPage)
    }
    
    //console.log(btn);
});




// Recipe Controller 

const controlRecipe = async () => {
    // get ID from URL 
    const id = window.location.hash.replace('#', '');
    
    console.log(id);
    
    if(id){
    // Prepare UI for Changes  
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        
    // Highlight selected search Item 
        if (state.search)searchView.highlightSelected(id);
        
    // create new recipe object 
        state.recipe = new Recipe(id);
        
    // get recipie data 
      try {  
     await state.recipe.getRecipe();
     state.recipe.parseIngredients();
      
        
    // calculate servings 
        state.recipe.calcTime();
        state.recipe.calcServings();
        
    // render recipe to the UI 
        clearLoader();
        recipeView.renderRecipe(state.recipe);
      }catch(error){
          console.log(error);
          alert('Error Processing Recipe');
      }
        
    }
    
};
      
      
      
      
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


// handeling receipe button clicks 

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // Decrease button is clicked .
        if(state.recipe.servings > 1){
        state.recipe.updateServings('dec');
            recipeView.updateServingsIng(state.recipe);
        }
    }else if (e.target.matches('.btn-increase, .btn-increase *')){
        // Decrease button is clicked 
        state.recipe.updateServings('inc');
        recipeView.updateServingsIng(state.recipe);


    }
    
    console.log(state.recipe);
});


//const l = new List();
window.l = new List();















































