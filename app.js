 let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

 let historyArray = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
 historyArray.reverse()

let dateCompleted = new Date().toString().split(' ')
dateCompleted = dateCompleted[1] + '-' + dateCompleted[2] + '-' + dateCompleted[3] + '-' + dateCompleted[4]

let completeds = {
  timeCompleted: dateCompleted
}
const addButton = document.querySelector('#addTask');
addButton.addEventListener('click', () => {
  let newTaskList = document.getElementById('new-task-list').value
  let dateTaskList = document.getElementById('date-task-list').value
  if (newTaskList == '' || dateTaskList == '') {
    return false;
  } else {
    createItems(newTaskList, dateTaskList)
  }
})
function createItems(newTask, newDate) {
  itemsArray.push({task: newTask, date: newDate});
  localStorage.setItem('items', JSON.stringify(itemsArray));
}
function displayItems() {
  if (itemsArray.length == 0) {
    document.querySelector('#task-lists').innerHTML =
     `<div class="container-fluid text-center" id="no-remaining-tasks">
            <div class="row justify-content-center align-items-center">
              <div class="col-4">
                <i class="fa-solid fa-list-check"></i>
                <h4>There are no tasks.</h4>
              </div>
            </div>
          </div>`
  } else {
  let items = '';
  for (let i = 0; i < itemsArray.length; i++) {
    items += ` <div class="list mb-3">
            <span id="to-do" class="row">
              <input type="text" class="task-input "readonly value="${itemsArray[i]['task']}">
              <input type="text" class="date-input " value="${itemsArray[i]['date']}" readonly>
            </span>
            <span id="buttons" class="gx-4">
              <button class="btn btn-warning edit">Edit</button>
              <button class="btn btn-success complete">Complete</button>
            </span>
            </div>`
  }
  document.querySelector('#task-lists').innerHTML = items
  activateCompleteButton();
  activateEditButton();
  }
  let historyItems = '';
  if (historyArray.length == 0) {
      historyItems += ` <div class="background-no-history"><i class="fa-solid fa-clock-rotate-left"></i>
                          <h4>No History Available</h4>
                        </div> `
      document.querySelector('.history').classList.add('centered-history');
  } else {
    document.querySelector('.history').classList.remove('centered-history')
    for (let i = 0; i < historyArray.length; i++) {
      historyItems += `<div class="history-items">
                    <p>${i+1}. Task: ${historyArray[i]['task']}. Date Completed: ${historyArray[i]['timeCompleted']}<p>
                    </div>`
      }
  }
  document.querySelector('.history-list').innerHTML = historyItems
}
function activateEditButton() {
  let editBtn = document.querySelectorAll('.edit');
  let taskInp = document.querySelectorAll('.task-input');
  let dateInp = document.querySelectorAll('.date-input');
  editBtn.forEach((ed, i) => {
    ed.addEventListener('click', function() {
      let completeBtn = document.querySelectorAll('.complete');
        
      if (ed.innerHTML == 'Edit') {
        taskInp[i].removeAttribute('readonly');
        dateInp[i].removeAttribute('readonly');
        dateInp[i].type = 'date';
        ed.innerHTML = 'Save';
        ed.classList.remove('edit');
        ed.classList.add('save');
        completeBtn.forEach(btn => {
          btn.setAttribute('disabled', 'disabled');
        })
      } else {
        updateItem(taskInp[i].value, dateInp[i].value, i);
          taskInp[i].setAttribute('readonly', true);
          dateInp[i].setAttribute('readonly', true);
          dateInp[i].type = 'text';
          ed.innerHTML = 'Edit';
          ed.classList.remove('save');
          ed.classList.add('edit');
             completeBtn.forEach(btn => {
                btn.removeAttribute('disabled', 'disabled');
        })
      }
    });
  });
}
function updateItem(task, date, i) {
  itemsArray[i] = {task, date}
  localStorage.setItem('items', JSON.stringify(itemsArray))
  location.reload()
}
function activateCompleteButton() {
  let completeBtn = document.querySelectorAll('.complete');
  completeBtn.forEach((cmpl, i) => {
    cmpl.addEventListener('click', () => {
      completeItem(i)
    })
  })
}
let timeObject = {
  timetoDelete: new Date().getTime() +  864000000//  10 Days
}
function checkAndDeleteHistory() {
  let timeNow = new Date().getTime()

  for (let i = 0; i < historyArray.length; i++) {
    if (timeNow > historyArray[i]['timetoDelete']) {
      historyArray.splice(i, 1);
      i--
    }
  }
  localStorage.setItem('history', JSON.stringify(historyArray))
}
function completeItem(i) {
  historyArray.push(Object.assign(itemsArray[i], completeds, timeObject))
  localStorage.setItem('history', JSON.stringify(historyArray))
  itemsArray.splice(i, 1)
  localStorage.setItem('items', JSON.stringify(itemsArray))
  displayItems();
  updateTotalList();
}
function updateTotalList() {
  let totalList = document.getElementById('totalLists');

  if (!Array.isArray(itemsArray) || itemsArray.length === 0) {
      totalList.innerHTML = 'You dont have tasks yet'
  } else {
      totalList.innerHTML = `You have ${itemsArray.length} tasks left`
    }
}
window.addEventListener('load', () => {
  displayItems();
  updateTotalList();
  checkAndDeleteHistory();
    if (historyArray.length >= 16) {
    historyArray = historyArray.slice(0, -1)
    localStorage.setItem('history', JSON.stringify(historyArray))
  }
})
window.addEventListener('change', () => {
  displayItems();
  updateTotalList();
  checkAndDeleteHistory();
    if (historyArray.length >= 16) {
    historyArray = historyArray.slice(0, -1)
    localStorage.setItem('history', JSON.stringify(historyArray))
  }
})
  setTimeout(function() {
  checkAndDeleteHistory();
}, 864000000); // 10 days
 if (historyArray.length >= 16) {
    historyArray = historyArray.slice(0, -1)
    localStorage.setItem('history', JSON.stringify(historyArray))
  }