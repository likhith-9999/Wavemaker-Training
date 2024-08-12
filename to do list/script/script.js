var id = 0;
var taskList = [];
var darkmode = false;

window.onload = displayTasks;

function addTask() {
    let heading = document.getElementById("task-heading").value;
    let description = document.getElementById("task-desc").value;
    let date = document.getElementById("task-date").value;
    let time = document.getElementById("task-time").value;
    let priorty = document.getElementById("priorty").value;

    
    

    if (heading !== "") {
        let obj = { "id": id++, "task": heading, "description": description, "checkbox": false, "date": date, "time": time, "priorty": priorty, "subtasks":[] };

        let subtaskId = 0;
        document.querySelectorAll('.subtask-form').forEach(subtaskForm => {
            const subtaskHeading = subtaskForm.querySelector('input[type="text"]').value;
            const subtaskDesc = subtaskForm.querySelector('textarea').value;
            const subtaskDate = subtaskForm.querySelector('input[type="date"]').value;
            const subtaskTime = subtaskForm.querySelector('input[type="time"]').value;
            const subtaskPriority = subtaskForm.querySelector('select').value;

            obj.subtasks.push({
                id: subtaskId++, 
                heading: subtaskHeading,
                description: subtaskDesc,
                date: subtaskDate,
                time: subtaskTime,
                priority: subtaskPriority
            });
        });


        taskList.push(obj);
        addToContainer(obj);
        localStorage.setItem("taskList", JSON.stringify(taskList));
        diaclose('taskDialog');
        document.getElementById("task-heading").value = "";
        document.getElementById("task-desc").value = "";
        document.getElementById("task-date").value = "";
        document.getElementById("task-time").value = "";
        document.getElementById("priorty").value = "";
    } else {
        diashow('myDialog');
    }
}

function addToContainer(task) {
    const newRow = document.createElement("div");
    newRow.id = task.id;
    newRow.className = "row border p-2 mb-2 d-flex justify-content-between align-items-center";
    newRow.draggable = true;
    newRow.ondragstart = (event) => drag(event);
    newRow.ondragover = (event) => allowDrop(event);
    newRow.ondrop = (event) => drop(event);

    // checkbox
    const checkboxCol = document.createElement("div");
    checkboxCol.className = "col-1";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.checkbox;
    checkbox.addEventListener('change', function() {
        toggleCheckbox(task.id, checkbox.checked);
    });
    checkboxCol.appendChild(checkbox);
    newRow.appendChild(checkboxCol);

    // text container
    const textCol = document.createElement("div");
    textCol.className = "col-4 text-truncate h6";
    textCol.textContent = task.task;
    textCol.style.textDecoration = task.checkbox ? "line-through" : "none";
    textCol.addEventListener('click', function() {
        viewTask(task.id);
    });
    newRow.appendChild(textCol);

    // priority
    const priortyTxt = document.createElement("div");
    priortyTxt.className = "col-3 text-center text-truncate";
    priortyTxt.textContent = task.priorty;
    priortyTxt.style.color = task.priorty === "High" ? '#dc3545' : (task.priorty === "Medium" ? '#ffc107' : '#198754');
    newRow.append(priortyTxt);

    // edit icon
    const iconEdit = document.createElement("div");
    iconEdit.className = "col-1";
    const icon2 = document.createElement("i");
    icon2.className = "fa-regular fa-pen-to-square";
    iconEdit.appendChild(icon2);
    icon2.addEventListener('click', function() {
        // console.log()
        editTask(task.id);
    });
    newRow.appendChild(iconEdit);

    // delete icon
    const iconCol = document.createElement("div");
    iconCol.className = "col-1";
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-delete-left";
    iconCol.appendChild(icon);
    icon.addEventListener('click', function() {
        deleteTask(task.id);
    });
    newRow.appendChild(iconCol);

    // newRow.appendChild(document.createElement("br"));
    // subtasks
    const subtasks_div = document.createElement("div");
    subtasks_div.className = "col-12 ml-4 px-5";
    
    if(task.subtasks.length>0){
        task.subtasks.forEach(subtask => {
            // console.log(subtask);
            const subtask_innnerdiv = document.createElement("div");
            subtask_innnerdiv.className = "col-12 border-left border-dark  mt-2 font-italic bg-light py-1 text-truncate";
            subtask_innnerdiv.draggable = true;
            subtask_innnerdiv.ondragstart = (event) => subtasksDrag(event);
            subtask_innnerdiv.ondragover = (event) => allowDrop(event);
            subtask_innnerdiv.ondrop = (event) => subtasksDrop(event);
            subtask_innnerdiv.dataset.subtaskId = subtask.id; 
            subtask_innnerdiv.innerHTML =  subtask.heading;
            subtask_innnerdiv.style.color = subtask.priority === "High" ? '#dc3545' : (subtask.priority === "Medium" ? '#ffc107' : '#198754');

            subtasks_div.appendChild(subtask_innnerdiv);
        });
    }
    // console.log(subtasks_div);
    newRow.appendChild(subtasks_div);

    document.getElementById("container").appendChild(newRow);
}

function displayTasks() {
    let storedTasks = localStorage.getItem("taskList");

    if (storedTasks) {
        taskList = JSON.parse(storedTasks);
        id = taskList.length ? Math.max(...taskList.map(t => t.id)) + 1 : 0;
        if (taskList.length !== 0) {
            // sortTasksByPriority();

            const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };

            
            taskList.sort((a, b) => priorityOrder[a.priorty] - priorityOrder[b.priorty]);
            for (let task of taskList) {
                addToContainer(task);
            }
        }
    }
}

function deleteTask(taskId) {
    taskList = taskList.filter(task => task.id !== taskId);
    const element = document.getElementById(taskId);
    if (element) {
        element.remove();
    }
    localStorage.setItem("taskList", JSON.stringify(taskList));
}















let editingTaskId = null;


function editTask(taskId) {
    const task = taskList.find(task => task.id === taskId);
    if (!task) return;

    // console.log(taskId);

    document.getElementById('edit-heading').value = task.task;
    document.getElementById('edit-desc').value = task.description;
    document.getElementById('edit-date').value = task.date;
    document.getElementById('edit-time').value = task.time;
    document.getElementById('edit-priorty').value = task.priorty;
    
    const subtasks_container = document.getElementById("edit-subtasks");
    

    if(task.subtasks.length>0){
        // console.log(task.subtasks);
        subtasks_container.innerHTML = '';
        let i=1;
        task.subtasks.forEach(task => {
            const innerdiv = document.createElement("div");
            innerdiv.id = `edit_subtask_innerdiv_${i}`;
            innerdiv.innerHTML = `
        <div id="subtask-form-${i}">
            <h4>Subtask ${i}</h4>
            <label for="subtask-heading-${i}">Enter Subtask</label><br>
            <input type="text" placeholder="enter Subtask" id="subtask-heading-${i}" class="w-100" value="${task.heading}" required><br>
            
            <label for="subtask-desc-${i}">Description</label><br>
            <textarea name="subtask-desc-${i}" id="subtask-desc-${i}" class="w-100"
                placeholder="enter description" value="${task.description}"></textarea><br>
            <label for="subtask-date-${i}">Deadline</label><br>
            <input type="date" id="subtask-date-${i}" value="${task.date}" required><br>
            <label for="subtask-time-${i}">Time</label><br>
            <input type="time" id="subtask-time-${i}" value="${task.time}" required><br>
            <label for="subtask-priority-${i}">Priority</label><br>
            <select name="subtask-priority-${i}" id="subtask-priority-${i}" value="${task.priority}">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select><br>
            <br>
            <button type="button" class="btn border border-dark" onclick="removeEditSubTask(${i}, ${taskId})">Cancel</button>
            <br><br>
        </div>
    `;
            i++;
            subtasks_container.appendChild(innerdiv);
            
        });

    }

    const addSubtaskBtn = document.createElement('button');
    addSubtaskBtn.type = "button";
    addSubtaskBtn.textContent = "Add Subtask";
    addSubtaskBtn.className = "btn border border-dark mb-2"
    addSubtaskBtn.addEventListener('click', ()=>addEditSubTask(taskId));

    subtasks_container.appendChild(addSubtaskBtn);


  
    editingTaskId = taskId;


    diashow('editTaskDialog');
}


function saveEdit() {
    if (editingTaskId === null) return;

 
    const heading = document.getElementById('edit-heading').value;
    const description = document.getElementById('edit-desc').value;
    const date = document.getElementById('edit-date').value;
    const time = document.getElementById('edit-time').value;
    const priorty = document.getElementById('edit-priorty').value;
    // const subtasks = [];
    

 
    const taskIndex = taskList.findIndex(task => task.id === editingTaskId);
    if (taskIndex !== -1) {
        taskList[taskIndex] = {
            ...taskList[taskIndex],
            task: heading,
            description,
            date,
            time,
            priorty
        };
        let i=0;
        for(i=1; i<=taskList[taskIndex].subtasks.length; i++){
            console.log()
            taskList[taskIndex].subtasks[i-1] = {
                id: i,
                heading: document.getElementById(`subtask-heading-${i}`).value,
                description: document.getElementById(`subtask-desc-${i}`).value,
                date: document.getElementById(`subtask-date-${i}`).value,
                time: document.getElementById(`subtask-time-${i}`).value,
                priority: document.getElementById(`subtask-priority-${i}`).value
            };

        }
        // console.log(taskList);

        localStorage.setItem("taskList", JSON.stringify(taskList));
        


        document.getElementById(editingTaskId).remove();
        // document.getElementById()
        // addToContainer(taskList[taskIndex]);
        sortTasksByPriority();

        console.log(document.getElementById('editTaskDialog'));
        // diaclose('editTaskDialog');
    }

    editingTaskId = null;
}



function addEditSubTask(taskId) {
    console.log(taskId);
    const task = taskList.find(task => task.id === taskId);
    let obj = {
        id: task.subtasks.length,
        heading: "",
        description: "",
        date: "",
        time: "",
        priority: ""
    };
    console.log(obj);
    task.subtasks.push(obj);
    editTask(taskId);
}

function removeEditSubTask(i, taskId){
    console.log(i);
    const task = taskList.find(task => task.id === taskId);

    task.subtasks.splice(i-1, 1);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    console.log(task.subtasks);
    window.location.reload();
    editTask(taskId);
}







function viewTask(taskId) {
    const task = taskList.find(task => task.id === taskId);
    if (!task) return;

    
    document.getElementById('view-task-heading').textContent = `Heading: ${task.task}`;
    document.getElementById('view-task-desc').textContent = `Description: ${task.description}`;
    document.getElementById('view-task-date').textContent = `Date: ${task.date}`;
    document.getElementById('view-task-time').textContent = `Time: ${task.time}`;
    document.getElementById('view-task-priorty').textContent = `Priority: ${task.priorty}`;
    // document.getElementById('view-subtasks').textContent = `Subtasks: ${task.subtasks}`;

    let subtasks_container = document.getElementById('view-subtasks');
    subtasks_container.innerHTML = "";
    let i=1;
    task.subtasks.forEach(obj=>{
        const heading = document.createElement('h4');
        heading.textContent = `Subtask ${i++}`;
        subtasks_container.appendChild(heading);
        for (const [key, value] of Object.entries(obj)) {
            if(key=="id"){
                continue;
            }
            const p = document.createElement('p');
            p.textContent = `${key}: ${value}`;
            subtasks_container.appendChild(p);
        }
        subtasks_container.appendChild(document.createElement('hr'))  
    })

    
    diashow('viewTaskDialog');
}





function cancelEdit() {
    const editSubtasksContainer = document.getElementById('edit-subtasks');
    editSubtasksContainer.innerHTML = '';

    diaclose('editTaskDialog');

    editingTaskId = null;
}














function darkMode() {
    document.body.classList.toggle("bg-dark");

    if (!darkmode) {
        document.getElementById("container").style.color = "white";
        document.getElementsByClassName("heading")[0].style.color = "white";
        document.getElementById("addTask-btn").classList.remove("btn-dark");
        document.getElementById("brand-name").style.color = "white";
        document.getElementById("dark-mode-btn").innerHTML = 'Light Mode <i class="fa-solid fa-sun"></i>';
        document.getElementById('navbar').style.backgroundColor = "black";
        darkmode = true;
    } else {
        darkmode = false;
        document.getElementById("container").style.color = "black";
        document.getElementsByClassName("heading")[0].style.color = "black";
        document.getElementById("addTask-btn").classList.add("btn-dark");
        document.getElementById("brand-name").style.color = "black";
        document.getElementById("dark-mode-btn").innerHTML = 'Dark Mode <i class="fa-solid fa-moon"></i>';
        document.getElementById('navbar').style.backgroundColor = "white";
    }
}

function diashow(ele) {
    // console.log(document.getElementById(ele));
    document.getElementById(ele).showModal();
}

function diaclose(ele) {
    document.getElementById(ele).close();
}


// search

function searchTasks() {
    const searchQuery = document.getElementById("search-input").value.toLowerCase();
    const container = document.getElementById("container");

    container.innerHTML = "";

    const filteredTasks = taskList.filter(task =>
        task.task.toLowerCase().includes(searchQuery) ||
        task.description.toLowerCase().includes(searchQuery) ||
        task.subtasks.some(subtask =>
            subtask.heading.toLowerCase().includes(searchQuery) ||
            subtask.description.toLowerCase().includes(searchQuery)
        )
    );

    filteredTasks.forEach(task => addToContainer(task));
}

document.getElementById("search-input").addEventListener("input", searchTasks);






// drag and drop
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(draggedId);
    const targetElement = event.target.closest('.row');
    const container = document.getElementById("container");

    if (targetElement && targetElement !== draggedElement) {
        container.insertBefore(draggedElement, targetElement.nextSibling);
        reorderTasks();
    }
}

function reorderTasks() {
    const taskRows = document.querySelectorAll("#container .row");
    taskList = Array.from(taskRows).map(row => {
        // console.log(row.id);
        return taskList.find(task => task.id === parseInt(row.id));
    });

    // localStorage.setItem("taskList", JSON.stringify(taskList));
}




// subtasks drag and drop
// function subtasksDrag(event) {
//     event.dataTransfer.setData("text", event.target.dataset.subtaskId || event.target.id);
// }

// function subtasksDrop(event) {
//     event.preventDefault();
//     const data = event.dataTransfer.getData("text");
//     const targetElement = event.target;
    
//     if (targetElement.classList.contains("col-12") && targetElement.dataset.subtaskId) {
//         
//         const targetTaskId = targetElement.closest(".row").id;
//         const sourceSubtaskId = data;
//         
//         console.log(`Dropped subtask ${sourceSubtaskId} into task ${targetTaskId}`);
//     }
// }







function toggleCheckbox(taskId, isChecked) {
    const taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].checkbox = isChecked;
        const row = document.getElementById(taskId);
        row.getElementsByClassName('col-4')[0].style.textDecoration = isChecked ? "line-through" : "none";
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }
}

setInterval(function() {
    let currTime = new Date();
    taskList.forEach(task => {
        let taskTime = new Date(`${task.date}T${task.time}`);
        let remainingTime = taskTime - currTime;

        if (remainingTime > 0 && remainingTime < 600000) {
            let remainingMinutes = Math.floor(remainingTime / 60000);
            if (!task.checkbox) {
                let text = `${task.task} ends in ${remainingMinutes} minutes`;
                notifyMe(text);
                task.alertShown = true;
            }
        }
    });
}, 60000);

function notifyMe(text) {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        const notification = new Notification(text);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                const notification = new Notification(text);
            }
        });
    }
}

function sortTasksByPriority() {
    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };

    
    taskList.sort((a, b) => priorityOrder[a.priorty] - priorityOrder[b.priorty]);

    taskList.forEach(task=> {
        task.subtasks.sort((a,b)=>priorityOrder[a.priorty] - priorityOrder[b.priorty]);
    });

    
    document.getElementById("container").innerHTML = "";

    
    taskList.forEach(task => addToContainer(task));

   
    localStorage.setItem("taskList", JSON.stringify(taskList));

    window.location.reload();
}

function sortTasksByRemainingTime() {
    const now = new Date();

    
    taskList.sort((a, b) => {
        const timeA = new Date(`${a.date}T${a.time}`);
        const timeB = new Date(`${b.date}T${b.time}`);
        return timeA - timeB;
    });

    // console.log(taskList);

    
    document.getElementById("container").innerHTML = "";

    
    taskList.forEach(task => addToContainer(task));
    // window.location.reload();


    // localStorage.setItem("taskList", JSON.stringify(taskList));
}


document.getElementById("sort-by").addEventListener("change", function() {
    const sortBy = this.value;
    if (sortBy === "priority") {
        sortTasksByPriority();
        
    } else if (sortBy === "remaining-time") {
        sortTasksByRemainingTime();
        // window.location.reload();
    }
});






// import export



function exportToJson() {
    
    const tasks = localStorage.getItem("taskList");

    
    if (!tasks) {
        alert("No data to export");
        return;
    }

    
    const jsonData = JSON.parse(tasks);

    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });

    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tasks.json";

    
    document.body.appendChild(link);
    link.click();

    
    document.body.removeChild(link);
}






function triggerFileInput() {
    document.getElementById('import-file').click();
}


function importFromJson() {
    
    const fileInput = document.getElementById('import-file');

    
    if (!fileInput.files.length) {
        alert("Please select a file to import.");
        return;
    }

    
    const file = fileInput.files[0];
    const reader = new FileReader();

    
    reader.onload = function(event) {
        try {
            
            const jsonData = JSON.parse(event.target.result);

            
            if (Array.isArray(jsonData)) {
                taskList = jsonData;
                localStorage.setItem("taskList", JSON.stringify(taskList));
                
                
                document.getElementById("container").innerHTML = "";
                displayTasks();
                
                alert("Tasks imported successfully.");
            } else {
                alert("Invalid JSON format. Expected an array of tasks.");
            }
        } catch (e) {
            alert("Error reading JSON file: " + e.message);
        }
    };

  
    reader.readAsText(file);
    window.location.reload();
}














// subtask
let subtaskCount = 0;

function addSubTask() {
    subtaskCount++;
    
    
    const subtaskForm = document.createElement('div');
    subtaskForm.classList.add('subtask-form');
    subtaskForm.dataset.subtaskCount = subtaskCount;
    subtaskForm.innerHTML = `
        <div id="subtask-form-${subtaskCount}">
            <h4>Subtask ${subtaskCount}</h4>
            <label for="subtask-heading-${subtaskCount}">Enter Subtask</label><br>
            <input type="text" placeholder="enter Subtask" id="subtask-heading-${subtaskCount}" class="w-100" required><br>
            
            <label for="subtask-desc-${subtaskCount}">Description</label><br>
            <textarea name="subtask-desc-${subtaskCount}" id="subtask-desc-${subtaskCount}" class="w-100"
                placeholder="enter description"></textarea><br>
            <label for="subtask-date-${subtaskCount}">Deadline</label><br>
            <input type="date" id="subtask-date-${subtaskCount}" required><br>
            <label for="subtask-time-${subtaskCount}">Time</label><br>
            <input type="time" id="subtask-time-${subtaskCount}" required><br>
            <label for="subtask-priority-${subtaskCount}">Priority</label><br>
            <select name="subtask-priority-${subtaskCount}" id="subtask-priority-${subtaskCount}">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select><br>
            <br>
            <button type="button" class="btn border border-dark" onclick="removeSubTask(${subtaskCount})">Cancel</button>
            <br><br>
        </div>
    `;

    
    document.getElementById('subtasks-container').appendChild(subtaskForm);
}


function resetSubtaskForms() {
    const subtasksContainer = document.getElementById('subtasks-container');
    subtasksContainer.innerHTML = '';
}






function removeSubTask(subtaskId) {
    const subtaskForm = document.querySelector(`[data-subtask-count="${subtaskId}"]`);
    if (subtaskForm) {
        subtaskForm.remove();
    }

    
    subtaskCount = document.querySelectorAll('.subtask-form').length;
    updateSubtaskCount();
}

function updateSubtaskCount() {
    document.querySelectorAll('.subtask-form').forEach((form, index) => {
        form.dataset.subtaskCount = index + 1;
        form.querySelector('h4').textContent = `Subtask ${index + 1}`;
        form.querySelectorAll('input, textarea, select').forEach(el => {
            const id = el.id;
            if (id) {
                el.id = id.replace(/\d+$/, index + 1);
            }
        });
        form.querySelector('button').setAttribute('onclick', `removeSubTask(${index + 1})`);
    });
}