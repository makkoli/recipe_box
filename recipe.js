"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function(obj) {
        return typeof obj;
    }
    : function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol
            ? "symbol"
            : typeof obj;
    };

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/*
* Recipe object used to store, set, and retrieve the list of recipes
*/
var Recipes = function() {
    function Recipes(defaultRecipe) {
        _classCallCheck(this, Recipes);

        if (defaultRecipe == null) {
            this.recipes = {
                "Pumpkin Pie": [
                    "Pumpkin Puree", "Sweetened Condensed Milk", "Eggs", "Pumpkin Pie Spice", "Pie Crust"
                ],
                "Spaghetti": [
                    "Noodles", "Tomato Sauce", "(Optional) Meatballs"
                ],
                "Onion Pie": ["Onion", "Pie Crust", "Sounds Yummy right?"]
            };
        } else {
            this.recipes = defaultRecipe;
        }
    }

    /*
  * Returns the recipe list
  */

    Recipes.prototype.getRecipes = function getRecipes() {
        return this.recipes;
    };

    /*
  * Sets/edits the recipe list
  * @name: string containing recipe name
  * @ingredients: string containing ingredients separated by commas
  */

    Recipes.prototype.setRecipes = function setRecipes(name, ingredients) {
        ingredients = ingredients.split(',');
        ingredients.forEach(function(curr) {
            curr.trim();
        });
        this.recipes[name] = ingredients;
    };

    /*
  * Deletes a recipe from the list
  * @name: name of the recipe to remove
  */

    Recipes.prototype.deleteRecipe = function deleteRecipe(name) {
        delete this.recipes[name];
    };

    /*
  * Gets the ingredients of a recipe
  * @name: name of the recipe to get the ingredients of
  */

    Recipes.prototype.getIngredients = function getIngredients(name) {
        return this.recipes[name].join(',');
    };

    return Recipes;
}();

var recipeObj; // Recipe object to be loaded from local storage or created

// Create a recipes object and set local storage of recipes if it isn't set
if ((typeof Storage === "undefined"
    ? "undefined"
    : _typeof(Storage)) !== undefined && localStorage.getItem('__makkoli_recipes') == null) {
    recipeObj = new Recipes();
    localStorage.setItem("__makkoli_recipes", JSON.stringify(recipeObj.getRecipes())// Get the list of recipes and create an object for it
    );
} else if ((typeof Storage === "undefined"
    ? "undefined"
    : _typeof(Storage)) !== undefined && localStorage.getItem('__makkoli_recipes') != null) {
    recipeObj = new Recipes(JSON.parse(localStorage.getItem("__makkoli_recipes")));
}

// Main component to hold all recipes
var Recipes = React.createClass({
    displayName: "Recipes",

    getInitialState: function getInitialState() {
        return {recipes: null};
    },

    // Get recipes once component mounts
    componentDidMount: function componentDidMount() {
        this.setState({recipes: recipeObj.getRecipes()});
    },

    // Updates the component when the recipe list has changed
    changeRecipeList: function changeRecipeList() {
        this.setState({recipes: recipeObj.getRecipes()});
    },

    // Renders the list of recipes and add recipe button
    render: function render() {
        return React.createElement("div", {
            className: "recipe-container"
        }, React.createElement("h1", null, "Recipes"), React.createElement(RecipeLinkContainer, {
            recipes: this.state.recipes,
            changeRecipes: this.changeRecipeList
        }), React.createElement(AddRecipe, {changeRecipes: this.changeRecipeList}));
    }
});

// Component to add a recipe to the list
var AddRecipe = React.createClass({
    displayName: "AddRecipe",

    // Initial state is an add recipe button
    getInitialState: function getInitialState() {
        return {
            addRecipe: React.createElement(AddRecipeBtn, {recipeInput: this.recipeInput})
        };
    },

    // Close the add recipe input without adding a recipe
    closeAddRecipe: function closeAddRecipe() {
        this.setState({
            addRecipe: React.createElement(AddRecipeBtn, {recipeInput: this.recipeInput})
        });
    },

    // Add a recipe from user input
    addRecipe: function addRecipe(name, ingredients) {
        this.setState({
            addRecipe: React.createElement(AddRecipeBtn, {recipeInput: this.recipeInput})
        });
        this.props.changeRecipes();
    },

    // Recipe input boxes to display when clicked
    recipeInput: function recipeInput() {
        this.setState({
            addRecipe: React.createElement(AddRecipeInput, {
                onClose: this.closeAddRecipe,
                onAdd: this.addRecipe
            })
        });
    },

    // Renders either the add recipe button or the recipe input boxes
    render: function render() {
        return React.createElement("div", null, this.state.addRecipe);
    }
});

// The add recipe button, displayed when user isn't adding new recipes
var AddRecipeBtn = React.createClass({
    displayName: "AddRecipeBtn",

    render: function render() {
        return React.createElement("button", {
            className: "btn btn-primary btn-lg btn-block",
            type: "button",
            onClick: this.props.recipeInput
        }, "Add Recipe");
    }
});

// Recipe input boxes for the user to give the name and ingredients of new recipe
var AddRecipeInput = React.createClass({
    displayName: "AddRecipeInput", name: "", ingredients: "",

    // Keep the name variable updated
    setName: function setName(event) {
        this.name = event.target.value;
    },

    // Keep the ingredients variable updated
    setIngredients: function setIngredients(event) {
        this.ingredients = event.target.value;
    },

    // Add a recipe to the list when the user clicks the add recipe button
    addRecipe: function addRecipe() {
        recipeObj.setRecipes(this.name, this.ingredients);
        localStorage.setItem("__makkoli_recipes", JSON.stringify(recipeObj.getRecipes()));
        this.props.onAdd();
    },

    // Render the input boxes and buttons with associated functions
    render: function render() {
        return React.createElement("div", {
            className: "add-recipe"
        }, React.createElement("div", null, React.createElement("strong", null, "Recipe Name")), React.createElement("input", {
            type: "text",
            id: "recipe-name",
            onChange: this.setName
        }), React.createElement("div", null, React.createElement("strong", null, "Recipe Ingredients")), React.createElement("textarea", {
            id: "recipe-list",
            onChange: this.setIngredients
        }, "Enter recipe ingredients separated by commas."), React.createElement("button", {
            type: "button",
            className: "btn btn-success",
            onClick: this.addRecipe
        }, "Add Recipe"), React.createElement("button", {
            type: "button",
            className: "btn btn-default",
            onClick: this.props.onClose
        }, "Close"));
    }
});

// A container that holds all the recipe links
var RecipeLinkContainer = React.createClass({
    displayName: "RecipeLinkContainer",

    // Initial state is for no recipe to be displayed
    getInitialState: function getInitialState() {
        return {displayList: []};
    },

    // Adds a recipe to be displayed to the display array
    addToDisplay: function addToDisplay(name) {
        this.setState({displayList: this.state.displayList.concat(name)});
    },

    // Removes a recipe from the display array
    removeFromDisplay: function removeFromDisplay(name) {
        this.state.displayList.splice(this.state.displayList.indexOf(name), 1);
        this.setState({displayList: this.state.displayList});
    },

    // Checks if a recipe is in the display array
    checkForDisplay: function checkForDisplay(name) {
        return this.state.displayList.indexOf(name) != -1;
    },

    // Gets the list of recipes put into components
    getRecipeList: function getRecipeList(recipeList) {
        for (var recipe in this.props.recipes) {
            recipeList.push(React.createElement(RecipeLink, {
                recipeName: recipe,
                ingredients: this.props.recipes[recipe],
                changeRecipes: this.props.changeRecipes,
                display: this.checkForDisplay,
                addDisplay: this.addToDisplay,
                removeDisplay: this.removeFromDisplay
            }));
        }
    },

    // Render the recipe links
    render: function render() {
        var recipeLinksList = [];
        this.getRecipeList(recipeLinksList);

        return React.createElement("div", null, recipeLinksList);
    }
});

// Links to each recipes details
var RecipeLink = React.createClass({
    displayName: "RecipeLink",

    // Delete a recipe from the list
    deleteRecipe: function deleteRecipe() {
        recipeObj.deleteRecipe(this.props.recipeName);
        localStorage.setItem("__makkoli_recipes", JSON.stringify(recipeObj.getRecipes()));
        this.props.changeRecipes();
    },

    // User can choose to display or hide recipes
    display: function display(recipeName) {
        if (this.props.display(recipeName)) {
            this.props.removeDisplay(recipeName);
        } else {
            this.props.addDisplay(recipeName);
        }
    },

    // Render the recipe name and ingredients if display is set to true
    render: function render() {
        return React.createElement("div", null, React.createElement("div", {
            className: "recipe-link"
        }, React.createElement("span", {
            onClick: this.display.bind(this, this.props.recipeName),
            className: "glyphicon glyphicon-menu-down"
        }), " ", this.props.recipeName, React.createElement("button", {
            className: "close",
            type: "button",
            onClick: this.deleteRecipe,
            "aria-label": "Close"
        }, React.createElement("span", {
            "aria-hidden": "true"
        }, "×"))), this.props.display(this.props.recipeName)
            ? React.createElement(Ingredients, {
                ingredients: this.props.ingredients,
                recipeName: this.props.recipeName,
                changeRecipes: this.props.changeRecipes
            })
            : "");
    }
});

// Component that contains the ingredients of each recipe
var Ingredients = React.createClass({
    displayName: "Ingredients",

    getInitialState: function getInitialState() {
        return {
            edit: React.createElement(EditButton, {editRecipe: this.onEditInput})
        };
    },

    // Edit button when edit input is inactive
    onEdit: function onEdit() {
        this.setState({
            edit: React.createElement(EditButton, {editRecipe: this.onEditInput})
        });
        this.props.changeRecipes();
    },

    // Input boxes for user when editing a recipe
    onEditInput: function onEditInput() {
        this.setState({
            edit: React.createElement(EditRecipeInput, {
                onClose: this.onEdit,
                recipeName: this.props.recipeName
            })
        });
    },

    // Renders the ingredients as well as the delete and edit recipe buttons
    render: function render() {
        return React.createElement("div", {
            className: "ingredients"
        }, React.createElement("h4", null, "Ingredients"), React.createElement("ul", {
            className: "list-group"
        }, this.props.ingredients.map(function(curr) {
            return React.createElement("li", {
                className: "list-group-item"
            }, curr);
        })), this.state.edit);
    }
});

// Edit button for the user to edit recipes
var EditButton = React.createClass({
    displayName: "EditButton",

    render: function render() {
        return React.createElement("button", {
            className: "btn btn-default text-right",
            type: "button",
            onClick: this.props.editRecipe
        }, "Edit");
    }
});

// Input boxes for user to edit ingredients of recipes
var EditRecipeInput = React.createClass({
    displayName: "EditRecipeInput", name: "", ingredients: "",

    // Keep the name variable updated
    setName: function setName(event) {
        this.name = event.target.value;
    },

    // Keep the ingredients variable updated
    setIngredients: function setIngredients(event) {
        this.ingredients = event.target.value;
    },

    // Add a recipe to the list when the user clicks the add recipe button
    editRecipe: function editRecipe() {
        recipeObj.setRecipes(this.name, this.ingredients);
        localStorage.setItem("__makkoli_recipes", JSON.stringify(recipeObj.getRecipes()));
        this.props.onClose();
    },

    render: function render() {
        // Set the name and ingredients of the recipe
        if (this.props.recipeName != null) {
            this.name = this.props.recipeName;
            this.ingredients = recipeObj.getIngredients(this.props.recipeName);
        }

        return React.createElement("div", {
            className: "add-recipe"
        }, React.createElement("div", null, React.createElement("strong", null, "Recipe Name")), React.createElement("input", {
            type: "text",
            id: "recipe-name",
            onChange: this.setName,
            placeholder: this.name
        }), React.createElement("div", null, React.createElement("strong", null, "Recipe Ingredients")), React.createElement("textarea", {
            id: "recipe-list",
            onChange: this.setIngredients
        }, this.ingredients), React.createElement("button", {
            type: "button",
            className: "btn btn-success",
            onClick: this.editRecipe
        }, "Edit Recipe"), React.createElement("button", {
            type: "button",
            className: "btn btn-default",
            onClick: this.props.onClose
        }, "Close"));
    }
});

// Render the components
ReactDOM.render(React.createElement(Recipes, null), document.getElementById("recipes"));
