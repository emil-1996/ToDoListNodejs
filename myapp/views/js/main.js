

function validateTask(){
    let formTask = document.forms;
    let addTaskForm = formTask['addTask'];
    let taskName = addTaskForm.elements["taskName"].value;
    console.log(taskName);
}