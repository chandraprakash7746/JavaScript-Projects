

// without localStorage code Scroll down for LocalStorage code. 

// const addBtn = document.querySelector("button");
// console.log(addBtn);
// const task = document.getElementById("task");
// // console.log(task.value);
// const appendTaskBox = document.getElementById("appendTaskBox");

// addBtn.addEventListener("click", function () {
    
//     const taskValue = task.value;
//     task.value = "";
    
//     const appendTask = document.createElement("div");
//     appendTask.classList.add("appendTask");
//     appendTask.innerHTML = `<input id="checkbox" type="checkbox" value="false">
//                 <h4>${taskValue}</h4>
//                 <svg class="dltBtn"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
//                     <path
//                         d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z">
//                     </path>
//                 </svg>`
//     console.log(appendTask);

//     const dltBtn = appendTask.querySelector(".dltBtn");
//     dltBtn.addEventListener("click", function(){
//         appendTaskBox.removeChild(appendTask);
//     })

//     if(taskValue != ""){
//         appendTaskBox.appendChild(appendTask);
//     }
//     else{
//         alert("Please enter Task first !!");
//     }    
// })


// Use localStorage

const addBtn =document.getElementById("addBtn");
const inputField = document.getElementById("task");
const taskContainer = document.getElementById("appendTaskBox")
const clearAll = document.getElementById("clearTask");


let taskArr = JSON.parse(localStorage.getItem("myTodo")) || [];

renderTask();

addBtn.addEventListener('click', function(){
    let task = inputField.value.trim();
    inputField.value = "";
    if(task === 0) return;
    let taskObj = {id : Date.now(), taskName : task}
    // console.log(taskObj);
    taskArr.push(taskObj);
    console.log(taskArr);

    updateLocalStorage();

    renderTask();
})

function updateLocalStorage(){
    localStorage.setItem("myTodo", JSON.stringify(taskArr));
}

function renderTask(){
    taskContainer.innerHTML = "";
    taskArr.forEach((element, index) => {
        let box = document.createElement('div');
    box.innerHTML = `<span>${element.taskName}</span>
                     <button onclick="deleteTask(${index})" style="border:none; background:none; cursor:pointer; color:red;">Delete</button>`

     taskContainer.appendChild(box); 
    });
                   
}

function deleteTask(index){
    taskArr.pop(index);
    updateLocalStorage();
    renderTask();
}

clearAll.addEventListener('click', clearAllTask);

function clearAllTask(){
    localStorage.removeItem("myTodo");
    taskArr =[];
    renderTask();
}





