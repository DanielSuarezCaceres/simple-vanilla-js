// SELECTORS

const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

// EVENT LISTENERS

document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
// in Firefox click event works fine, but in Chrome it works only after clicking again on the element
// so we use 'change' event because it works fine for both
filterOption.addEventListener('change', filterTodo);

// FUNCTIONS

function addTodo(event) {
  // prevents form from submitting, so browser does not refresh
  event.preventDefault();

  // Create div
  const todoDiv = document.createElement('div');
  todoDiv.classList.add('todo');
  // Create li 
  const newTodo = document.createElement('li');
  newTodo.innerText = todoInput.value;
  newTodo.classList.add('todo-item');
  // Append todo to div
  todoDiv.appendChild(newTodo);
  // Add Todo item to local storage
  saveLocalTodos(todoInput.value);

  // Check mark button
  const completedButton = document.createElement('button');
  // completedButton.innerText = 'fdfdsf'; this does not work, just would add text
  completedButton.innerHTML = '<i class="fas fa-check"></i>'
  completedButton.classList.add('complete-btn');
  todoDiv.appendChild(completedButton);

  // Check delete button
  const trashButton = document.createElement('button');
  trashButton.innerHTML = '<i class="fas fa-trash"></i>'
  trashButton.classList.add('trash-btn');
  todoDiv.appendChild(trashButton);

  // Append to list
  todoList.appendChild(todoDiv);
  // Clear todo input after adding it
  todoInput.value = '';
}

// check item to mark it as completed or to delete it
function deleteCheck(e) {
  const item = e.target;
  // returns whatever item you're clicking on inside list
  // if you click todo item itself, returns <li class="todo-item"></li>
  // if you click check/delete button, returns <i class="fas fa-check/trash"></i>

  // Delete item
  if (item.classList[0] === 'trash-btn') {
    console.log(item.classList);
    // That returns: 
    /*
      DOMTokenList ["trash-btn", value: "trash-btn"]
        0: "trash-btn"
        length: 1
        value: "trash-btn"
        __proto__: DOMTokenList 
    */
    const todo = item.parentElement;
    // Animation
    todo.classList.add("fall");
    // Delete element after animation
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  // Mark item as completed
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    // toggle -> add class if it's not present; if it's already, it deletes the class
    todo.classList.toggle("completed");
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  console.log(todos);
  // loop NodeList
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

// save todos in local storage
function saveLocalTodos(todo) {
  let todos = loadFromLocal();
  // next, grab the todo and push it in todos array
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() { // similar to addTodo method, but loading from localStorage
  let todos = loadFromLocal();
  // next, load the todo items
  todos.forEach(function (todo) {
    // Create div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    // Create li 
    const newTodo = document.createElement('li');
    newTodo.innerText = todo;
    newTodo.classList.add('todo-item');
    // append todo to div
    todoDiv.appendChild(newTodo);

    // Check mark button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>'
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);

    // Check delete button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>'
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);

    // Append to list
    todoList.appendChild(todoDiv);
  });
}

function removeLocalTodos(todo) {
  let todos = loadFromLocal();
  // todo -> div element
  // console.log(todo.children) -> returns li item, button check and button delete
  const todoIndex = todo.children[0].innerText;
  /* 
    arg1: position of the element to delete (todoIndex)
    arg2: number of elements to delete (1)
  */
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadFromLocal() {
  let todos;
  // first, check if there's already something there
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else { // get items array
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  return todos;
}