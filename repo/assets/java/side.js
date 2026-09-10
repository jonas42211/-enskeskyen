let items = JSON.parse(localStorage.getItem('wishlistItems') || '[]');


// Function to render the items in the list
// #region Render the items in the list
function renderItems() {
  const listSection = document.getElementById('list-s');

  if (!listSection) {
    return;
  }

  listSection.innerHTML = '';


  if (items.length === 0) {
    listSection.innerHTML = '<p class="empty-list">Din liste er tom. Find inspiration på siden med ønsker.</p>';
    return;
  }

  items.forEach((item, index) => {
    const div = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = item;
    div.className = 'list-item-div';
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
icon.className = 'fa fa-trash fa-1x';
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
  localStorage.setItem('wishlistItems', JSON.stringify(items));
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
  localStorage.setItem('wishlistItems', JSON.stringify(items));
  renderItems();
  return 'ok';
}
// remove item from the list by name
function removeItem(name) {
  items = items.filter(item => item !== name);
  localStorage.setItem('wishlistItems', JSON.stringify(items));
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
  localStorage.setItem('wishlistItems', JSON.stringify(items));
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
  myHeadLine.innerText = 'Min ønskeliste';
  myHeadLine.className = 'header';
  appContainer.appendChild(myHeadLine);
  // Create and append the input section with an input field and an add button
  const inputSection = document.createElement('section');
  const input = document.createElement('input');
  input.placeholder = 'Skriv et ønske...';
  input.setAttribute('aria-label', 'Nyt ønske');
  inputSection.className = 'input-s';
  
  appContainer.appendChild(inputSection);
  inputSection.appendChild(input);
  // Create and append the add button
  const addbutton = document.createElement('button');
  addbutton.innerText = 'add';
  inputSection.appendChild(addbutton);
  // Create and append the list section
  const listsection = document.createElement('section');
  listsection.id = 'list-s';
  appContainer.appendChild(listsection);
  
  // #endregion
  
  // #region Add event listeners to the static elements of the app
  
  //add event listener to the add button to add items to the list
  addEventcallback(input, addbutton);
  
  // #endregion
  
  renderItems();
}


function sletbutton(index) {
  removeItemAt(index);
  renderItems();
}

function addEventcallback(input, addbutton) {
  addbutton.addEventListener('click', () => {
    const res = validateSimple(input.value, items);
    if (!res.ok) {
      if (res.reason === 'duplicate') {
        alert('Element findes allerede i listen');
      }
      return;
    }
    
    addItem(res.value);
    input.value = '';
  });
}

// Simple validator using map + find (case-insensitive)
function validateSimple(value, itemsList) {
  const v = String(value || '').trim();

  const normalized = v.toLowerCase();
  const found = itemsList.map(i => String(i).toLowerCase()).find(x => x === normalized);

  return found ? { ok: false, reason: 'duplicate' } : { ok: true, value: v };
}

readerStatic('appID');


