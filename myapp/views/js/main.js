function showForm() {
    const modal = document.querySelector("#todo-app-form");
    const btn = document.querySelector("span#close");
    modal.style.display = "block";
}

function hideForm() {
    const modal = document.querySelector("#todo-app-form");
    const btn = document.querySelector("span#close");
    modal.style.display = "none";
}

function getTaskFromForm() {
    const formTask = document.forms;
    const addTaskForm = formTask['addTask'];
    const taskName = addTaskForm.elements["taskName"].value;
    const taskDesc = addTaskForm.elements["taskDesc"].value;
    const taskPriority = addTaskForm.elements["todo-input-priority"].value;
    const jsonTask = JSON.stringify({ name: taskName, desc: taskDesc, priority: taskPriority });
    return jsonTask;
}

async function sendTask() {
    const task = getTaskFromForm();
    try {
        const response = await fetch("http://0.0.0.0:3000/add", {
            method: 'POST',
            body: task
        });
        const result = await response.json();
        if (result.error) {
            throw JSON.parse(result.error);
        }
        alert(result.message);
        console.log(result);
    } catch (error) {
        console.log(error);
        alert(error.error);
    }
}

function removeElementFromDb(element) {
    console.log(element.querySelector('.element-id').innerHTML);
    console.log(renderTask());
    element.remove();
}

document.addEventListener("DOMContentLoaded", () => {
    todoList.addEventListener("click", e => {
        if (e.target.classList.contains("element-delete")) {
            removeElementFromDb(e.target.parentElement.parentElement);
        }
    });
});

async function getData() {
    try {
        const response = await fetch("http://0.0.0.0:3000/get", {});
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
}

async function renderTask() {
    try {
        const tasks = await getData();
        for (let task of tasks) {
            console.log(task); //one task
        }
    } catch (error) {
        console.log(error);
    }
}
