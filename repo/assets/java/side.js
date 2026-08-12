let items = [];


// Function to render the items in the list
// #region Render the items in the list
function renderItems() {
  const listSection = document.getElementById('list-s');

  if (!listSection) {
    return;
  }

  listSection.innerHTML = '';


  items.forEach((item, index) => {
    const div = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = item;
    p.id = 'list-item-p';
    div.id = 'list-item-div';
    div.appendChild(p);
    listSection.appendChild(div);

    // Create a remove button for each item
    const removeButton = document.createElement('button');
    removeButton.className = 'btn';
    removeButton.addEventListener('click', () => {
    sletbutton(index);
    });
    div.appendChild(removeButton);

const icon = document.createElement('i');
icon.className = 'fa fa-trash fa-5x';
icon.id = 'icon';
removeButton.appendChild(icon);
  });
}



// #region Item Management Functions



//add item to the list and render the list
function addItem(name) {
  if (name === undefined || name === null || name === '') {
    console.log('fejl');
    return 'fejl';
  }

  items.push(name);
  renderItems();
  return 'ok';
}
// list items in the list by index
function listItems(index) {
  const data = items[index];

  if (data === undefined) {
    console.log('fejl');
  }

  return data;
}
// update item in the list by name
function updateItem(oldName, newName) {
  items = items.map(item => item === oldName ? newName : item);
  renderItems();
  return 'ok';
}
// remove item from the list by name
function removeItem(name) {
  items = items.filter(item => item !== name);
  renderItems();
  return 'ok';
}

// remove item from the list by index
function removeItemAt(index) {
  if (typeof index !== 'number' || index < 0 || index >= items.length) {
    console.log('fejl');
    return 'fejl';
  }

  items.splice(index, 1);
  renderItems();
  return 'ok';
}
// function to create the static elements of the app and add event listeners
function readerStatic(appID) {
  const appContainer = document.getElementById(appID);

  if (!appContainer) {
    return;
  }
  // #endregion 

  // #region Create and append the static elements of the app
// Create and append the headline
  const myHeadLine = document.createElement('h1');
  myHeadLine.innerText = 'Ønske List';
  myHeadLine.id = 'header';
  appContainer.appendChild(myHeadLine);
// Create and append the input section with an input field and an add button
  const inputSection = document.createElement('section');
  const input = document.createElement('input');
  inputSection.id = 'ips';
  input.id = 'ip';
  appContainer.appendChild(inputSection);
  inputSection.appendChild(input);
// Create and append the add button
  const addbutton = document.createElement('button');
  addbutton.innerText = 'add';
  addbutton.id = 'abtn';
  inputSection.appendChild(addbutton);
// Create and append the list section
  const listsection = document.createElement('section');
  listsection.id = 'list-s';
  appContainer.appendChild(listsection);

  // #endregion
  
  // #region Add event listeners to the static elements of the app
 
    //add event listener to the add button to add items to the list
    addbutton.addEventListener('click', () => {
      const value = input.value.trim();
  // Check if the input value is not empty before adding the item
      if (value) {
        addItem(value);
        input.value = '';
      }
    });
  
  // #endregion



  renderItems();
}


  function sletbutton(index) {
       removeItemAt(index);
       renderItems();
  }




readerStatic('appID');


