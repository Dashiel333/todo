const addTaskForm = document.querySelector('#addTaskForm');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
 

let tasks = [];

if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'))
    console.log(tasks);
    tasks.forEach((task) => renderTask(task));
}


checkEmptyList()

addTaskForm.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTaskClick);

function addTask(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    tasks.push(newTask);
    saveToLocalStorage ()

    renderTask(newTask);

    taskInput.value = "";
    taskInput.focus();

    // if (taskList.children.length > 0) {
    //     emptyList.classList.add('none');
    // }
    checkEmptyList()
}

function handleTaskClick(event) {
    if (event.target.dataset.action === 'delete') {
        deleteTask(event);
    } else if (event.target.dataset.action === 'done') {
        doneTask(event);
    }
}

function deleteTask(event) {
    const parentNode = event.target.closest('.task-item');
    const id = Number(parentNode.id);

    tasks = tasks.filter((task) => task.id !== id);
    // console.log("Удалили:", tasks);
    saveToLocalStorage ()

    if (parentNode) {
        parentNode.remove();
    }
    checkEmptyList()
}

function doneTask(event) {
    const parentNode = event.target.closest('.task-item');
    const id = Number(parentNode.id);

    const task = tasks.find((task) => task.id === id);
    
    if (task) {
        task.done = !task.done;
        
        parentNode.classList.toggle('task-title--done');
        saveToLocalStorage ()
    }
}

function checkEmptyList() {

    if (tasks.length === 0) {
        const emptyListElement = `<div class="todo-empty" id="emptyList">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Empty" width="50" />
                <p>To-do list is empty</p>
            </div>`;
        taskList.insertAdjacentHTML('afterbegin', emptyListElement)
    }
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}
function saveToLocalStorage (){
    localStorage.setItem('tasks', JSON.stringify(tasks))

}

function renderTask(task) {
     const cssClass = task.done ? "task-item task-title--done" : "task-item";

    const taskHTML = `
        <li id="${task.id}" class="${cssClass}">
            ${task.text}
            <span class="actions">
                <button class="btn-check" data-action="done">✔</button>
                <button class="btn-remove" data-action="delete">✘</button>
            </span>
        </li>
    `;
    taskList.insertAdjacentHTML('beforeend', taskHTML);
}
