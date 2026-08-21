const STORAGE_KEY = 'wish-list-items';

const savedUsername = 'admin';
const savedPassword = '1234';
const loginCookie = 'loggedIn';

function checkLogin(username, password) {
  return username === savedUsername && password === savedPassword;
}

function setLoginCookie() {
  const expires = new Date();
  expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
  document.cookie = `${loginCookie}=true; expires=${expires.toUTCString()}; path=/`;
}

function getLoginCookie() {
  return document.cookie.includes(`${loginCookie}=true`);
}

function showLogin(appID) {
  const app = document.getElementById(appID);
  app.innerHTML = '';

  const loginBox = document.createElement('section');
  loginBox.className = 'login-box';

  const title = document.createElement('h1');
  title.textContent = 'Log ind';
  title.className = 'login-title';

  const username = document.createElement('input');
  username.className = 'login-input';
  username.placeholder = 'Brugernavn';

  const password = document.createElement('input');
  password.className = 'login-input';
  password.type = 'password';
  password.placeholder = 'Password';

  const button = document.createElement('button');
  button.className = 'login-button';
  button.textContent = 'Login';

  const message = document.createElement('p');
  message.className = 'login-message';

  button.addEventListener('click', () => {
    if (checkLogin(username.value, password.value)) {
      setLoginCookie();
      readerStatic(appID);
    } else {
      message.textContent = 'Forkert login';
    }
  });

  loginBox.append(title, username, password, button, message);
  app.appendChild(loginBox);
}

function startApp() {
  if (getLoginCookie()) {
    readerStatic('appID');
  } else {
    showLogin('appID');
  }
}

let items = loadItemsFromStorage();

function loadItemsFromStorage() {
  try {
    const savedItems = localStorage.getItem(STORAGE_KEY);

    if (!savedItems) {
      return [];
    }

    const parsedItems = JSON.parse(savedItems);
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch (error) {
    console.error('Kunne ikke læse fra localStorage:', error);
    return [];
  }
}

function saveItemsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

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
    icon.className = 'fa fa-trash fa-5x';
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
  saveItemsToStorage();
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
  if (newName === undefined || newName === null || newName === '') {
    console.log('fejl');
    return 'fejl';
  }

  items = items.map(item => item === oldName ? newName : item);
  saveItemsToStorage();
  renderItems();
  return 'ok';
}

// remove item from the list by name
function removeItem(name) {
  const beforeLength = items.length;
  items = items.filter(item => item !== name);

  if (items.length === beforeLength) {
    console.log('fejl');
    return 'fejl';
  }

  saveItemsToStorage();
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
  saveItemsToStorage();
  renderItems();
  return 'ok';
}

// function to create the static elements of the app and add event listeners
function readerStatic(appID) {
  const appContainer = document.getElementById(appID);

  if (!appContainer) {
    return;
  }

  appContainer.innerHTML = '';

  // #endregion

  // #region Create and append the static elements of the app
  // Create and append the headline
  const myHeadLine = document.createElement('h1');
  myHeadLine.innerText = 'Ønske List';
  myHeadLine.className = 'header';
  appContainer.appendChild(myHeadLine);

  // Create and append the input section with an input field and an add button
  const inputSection = document.createElement('section');
  const input = document.createElement('input');
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

startApp();


