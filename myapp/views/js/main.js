

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
        if(result.error){
            throw JSON.parse(result.error);
        }
        alert(result.message);
        console.log(result);
    } catch (error) {
        console.log(error);
        alert(error.error);
    }
}