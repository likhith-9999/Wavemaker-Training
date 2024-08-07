var id = 0;
var taskList = [];
var darkmode = false;
var editindx;

window.onload = displayTasks;

function addTask() {
    let task = document.getElementById("task-input").value;
    // document.getElementById("task-heading").value = task;

    let heading = document.getElementById("task-heading").value;
    let description = document.getElementById("task-desc").value;
    // console.log(heading);
    let date = document.getElementById("task-date").value;
    let priorty= document.getElementById("priorty").value;

    if (heading !== "") {
        let obj = { "id": id++, "task": heading,"description": description  ,"checkbox": false, "date": date, "priorty": priorty };
        taskList.push(obj);

        addToContainer(obj);

        localStorage.setItem("taskList", JSON.stringify(taskList));

        document.getElementById("task-input").value = "";
        
        diaclose('taskDialog');
        document.getElementById("task-input").value = "";
        document.getElementById("task-heading").value = "";
        document.getElementById("task-desc").value = "";
        document.getElementById("task-date").value = "";
        document.getElementById("priorty").value = "";
        
    } else {
        diashow('myDialog');
    }
}

function addToContainer(task) {
    const newRow = document.createElement("div");
    newRow.id = task.id; 
    newRow.className =
        "row border p-2 mb-2 d-flex flex-nowrap justify-content-between align-items-center";
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
    textCol.className = "col-6   text-truncate";
    textCol.textContent = task.task;
    textCol.style.textDecoration = task.checkbox ? "line-through" : "none";
    textCol.addEventListener('click', function(){
        viewTask(task.id);
    })
    newRow.appendChild(textCol);

    //priorty
    const priortyTxt = document.createElement("div");
    priortyTxt.className = "col-3 text-center";
    priortyTxt.textContent = task.priorty;
    if(task.priorty==="High"){
        priortyTxt.style.color = '#dc3545';
    } else if(task.priorty==="Medium"){
        priortyTxt.style.color = '#ffc107';
    }
    else{
        priortyTxt.style.color = '#198754';
    }
    newRow.append(priortyTxt);

    //edit icon
    const iconEdit = document.createElement("div");
    iconEdit.className = "col-1";
    const icon2 = document.createElement("i");
    icon2.className = "fa-regular fa-pen-to-square";
    iconEdit.appendChild(icon2);
    icon2.addEventListener('click', function() {
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


    document.getElementById("container").appendChild(newRow);
}

function displayTasks() {
    let storedTasks = localStorage.getItem("taskList");

    if (storedTasks) {
        taskList = JSON.parse(storedTasks);
        id = taskList.length ? Math.max(...taskList.map(t => t.id)) + 1 : 0;

        if (taskList.length !== 0) {
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


function editTask(taskId) {
    let element = document.getElementById(taskId);
    console.log(element);

    // Find the task index
    editindx = taskList.findIndex(task => task.id === taskId);

    if (editindx !== -1) {
        diashow('editDialog');

        document.getElementById("etask-heading").value = taskList[editindx].task;
        document.getElementById("etask-desc").value = taskList[editindx].description;
        document.getElementById("etask-date").value = taskList[editindx].date;
        document.getElementById("epriorty").value = taskList[editindx].priorty;
    }
}


function saveEdit() {
    let task = taskList[editindx];
    task.task = document.getElementById("etask-heading").value;
    task.description = document.getElementById("etask-desc").value;
    task.date = document.getElementById("etask-date").value;
    task.priorty = document.getElementById("epriorty").value;

    let row = document.getElementById(task.id);
    row.getElementsByTagName('div')[1].innerText = task.task;
    let priortyDiv = row.getElementsByTagName('div')[2];
    priortyDiv.innerText = task.priorty;

    
    if (task.priorty === "High") {
        priortyDiv.style.color = "#dc3545";
    } else if (task.priorty === "Medium") {
        priortyDiv.style.color = "#ffc107";
    } else {
        priortyDiv.style.color = "#198754";
    }

    localStorage.setItem("taskList", JSON.stringify(taskList));
    diaclose('editDialog');
}




function viewTask(taskId){
    diashow('viewDialog');

    let task = null;
    for (let key in taskList) {
        if (taskId == taskList[key].id) {
            task = taskList[key];
            break; 
        }
    }

    console.log(task);

    let container = document.getElementById('viewDialog');
    document.getElementById('viewheading').textContent = task.task || 'No heading';
    document.getElementById('viewdesc').textContent = task.description || 'No description';
    document.getElementById('view-date').textContent = task.date || 'No date';
    document.getElementById('view-priorty').textContent = task.priorty || 'No priorty';
}



function darkMode(){
    // document.getElementById('box').classList.toggle("bg-dark");
    
    document.body.classList.toggle("bg-dark");
    
    if(!darkmode){
        document.getElementById("container").style.color = "white";
        document.getElementsByClassName("heading")[0].style.color = "white";
        document.getElementById("addTask-btn").classList.remove("btn-dark");
        document.getElementById("brand-name").style.color = "white";
        document.getElementById("dark-mode-btn").textContent = "Light Mode"
        darkmode = true;
    }else{
        darkmode = false;
        document.getElementById("container").style.color = "black";
        document.getElementsByClassName("heading")[0].style.color = "black";
        document.getElementById("addTask-btn").classList.add("btn-dark");
        document.getElementById("brand-name").style.color = "black";
        document.getElementById("dark-mode-btn").textContent = "Dark Mode"
    }
    
}



function diashow(ele){
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
        task.description.toLowerCase().includes(searchQuery)
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
        return taskList.find(task => task.id === parseInt(row.id));
    });

    
    localStorage.setItem("taskList", JSON.stringify(taskList));
}







// checkbox

function toggleCheckbox(taskId, isChecked) {
    
    const taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        
        taskList[taskIndex].checkbox = isChecked;

        
        const row = document.getElementById(taskId);
        row.getElementsByClassName('col-6')[0].style.textDecoration = isChecked ? "line-through" : "none";

        
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }
}
