/* eslint-disable no-console */
'use strict';
/* global $ */

const STORE = {
  items: [{name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}],
  hideCompleted: false,
  searchPhrase: ''
};

// html template for adding items to the list
function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <input type="text" value ="${item.name} " class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}" readonly/>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

// making the shopping item input into a array of strings so we can use it in other functions
function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}

// rendering function for the entire list of shopping items, will be called in each new task function
function renderShoppingList() {
  console.log('`renderShoppingList` ran');

  // render the shopping list in the DOM

  const { items, hideCompleted, searchPhrase } = STORE;
  
  let shoppingListString;

  if (hideCompleted) {
    console.log('if statement for hideCompleted evaluated true');
    const notChecked = items.filter(item => (item.checked === false));
    shoppingListString = generateShoppingItemsString(notChecked);
  }
  else if (searchPhrase) {
    const search = items.filter(item => item.name.includes(searchPhrase));
    shoppingListString = generateShoppingItemsString(search);
  }
  else {
    shoppingListString = generateShoppingItemsString(items);
  }

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListString);
}

// handling the submission of new item strings by storing it in the STORE object
function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  const { items } = STORE;
  items.push({name: itemName, checked: false});
}
// handling the submission of new items upon input submission
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}
// handling the toggle for the checked property of each item object inside the items array of STORE
function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  const { items } = STORE;
  items[itemIndex].checked = !items[itemIndex].checked;
}

// retrieving the item index so it can be used in other tasks
function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}
// handling the toggle for the check button in the item list
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}
// calling items key from STORE object so we can delete it
function deleteListItem(itemIndex) {
  const { items } = STORE;
  items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  // listen to "DELETE" button click
  let shoppingItem = '';
  $('.js-shopping-list').on('click', '.shopping-item-delete', (event) => {
    console.log('handleDeleteItemClicked ran');
    shoppingItem = $(event.currentTarget).parents('.shopping-item-controls').siblings('.shopping-item'); 
  
    const itemIndex = getItemIndexFromElement(shoppingItem); 
    // use index to remove associated checked property in STORE object
    deleteListItem(itemIndex);
    // send render function
    renderShoppingList();
  });
}
// handling the input for the checkbox to show only incomplete items in the list
function handleChecked() {
  $('.js-checkbox').change( function () {
    STORE.hideCompleted = !STORE.hideCompleted;
    // STORE.hideCompleted = true;
    renderShoppingList();
  });
}
// handling the user search input so it can be used in handleSearch to re-render shopping list for
// search results
function handleSearchString(phrase) {
  return STORE.searchPhrase = phrase;
}
// handling the search functionality from inputted string drawn from handleSearchString
function handleSearch() {
  $('.js-search').keyup( function () {
    handleSearchString($('.js-search').val());
    renderShoppingList();
  });
}

// handling the text editing for the title of each item
function handleTextEdit() {

  $('.js-shopping-item').on( 'select', function (event) {

    console.log('selected text works');
    $(this).removeAttr('readonly');
    $(this).on('keypress', function(e) {
      console.log('keypress listener working');
      if ( e.which === 13 ) {
        const newText = $('input:text').val();
        $('input:text').attr(`value="${newText}"`);
        console.log(newText);
        const { items } = STORE;
        const sameIndex = getItemIndexFromElement(event.currentTarget);
        items[sameIndex].name = newText;
        $('.js-shopping-item').attr('readonly', true);
      }
    });
  });
}



// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleChecked();
  handleSearch();
  handleTextEdit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);