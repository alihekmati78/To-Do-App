const form = document.querySelector('#todo-form');
const input = document.querySelector('.todo-input');
const todoList = document.querySelector(".todos-list");

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let EditTodoId = -1;

renderTodos();

form.addEventListener('submit', (e) => {
    e.preventDefault();

    createNewTask();
    renderTodos();
    localStorage.setItem('tasks', JSON.stringify(tasks));
});

function createNewTask() {
    const todoValue = input.value;

    if (todoValue === '') {
        alert("You forgot to add a new task");
        return;
    }

    if (tasks.some((task) => task.value.toUpperCase() === todoValue.toUpperCase())) {
        alert("Task already exists!");
        return;
    }

    if (EditTodoId >= 0) {
        tasks[EditTodoId].value = todoValue;
        EditTodoId = -1;
    } else {
        tasks.push({
            value: todoValue,
            completed: false,
            color: '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6),
        });
    }

    input.value = '';
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = "";
    tasks.forEach((task, index) => {
        const iconClass = task.completed ? 'fa-circle-check' : 'fa-circle';
        const iconPerfix = task.completed ? 'fa-solid' : 'fa-regular';
        const liClass = task.completed ? 'completed-task' : '';
        todoList.innerHTML += `
        <div class="todo" id=${index}>
            <i class="${iconPerfix} fa ${iconClass}" style="color: ${task.color}" data-action="check"></i>
            <li class="${liClass}" data-action="check">${task.value}</li>
            <i class="fa fa-pen-to-square" data-action="edit"></i>
            <i class="fa fa-trash" data-action="delete"></i>
        </div>
        `;
    });
}

todoList.addEventListener('click', (event) => {
    const target = event.target;
    const action = target.dataset.action;
    const todoId = Number(target.closest('.todo').id);

    if (action === "check") {
        checkTodo(todoId);
    } else if (action === "edit") {
        editTodo(todoId);
    } else if (action === "delete") {
        deleteTodo(todoId);
    }
});

function checkTodo(todoId) {
    tasks[todoId].completed = !tasks[todoId].completed;
    renderTodos();
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTodo(todoId) {
    input.value = tasks[todoId].value;
    EditTodoId = todoId;

}

function deleteTodo(todoId) {
    tasks = tasks.filter((task, index) => index !== todoId)
    renderTodos();
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

