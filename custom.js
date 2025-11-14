let user = document.querySelector("#user");
let add = document.querySelector("#add");
let board = document.querySelector("#board");
let taskList = [];
let finisher;

let how = document.querySelector(".how");
let modal = document.querySelector(".modal");
let modalBox = document.querySelector(".modalBox");
let close = document.querySelector(".modalBox > i");

let day = document.querySelector(".day span");
let time = document.querySelector(".time span");

how.addEventListener("click", () => {
  modal.classList.add("on");
  modalBox.classList.add("on");
});
close.addEventListener("click", () => {
  modal.classList.remove("on");
  modalBox.classList.remove("on");
});

//시간 추가

let clockwork = setInterval(function () {
  let clock = new Date();
  let year = clock.getFullYear();
  let month = clock.getMonth();
  let date = clock.getDate();
  let hour = clock.getHours();
  let minute = clock.getMinutes();
  let second = clock.getSeconds();

  if (month >= 12) {
    month = 0;
  }
  if (date < 10) {
    date = "0" + date;
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }

  day.innerHTML = `${year} / ${month + 1} / ${date}`;

  let timer = "am";

  if (hour > 12) {
    timer = "PM";
    hour = "0" + (hour - 12);
  } else if (hour < 12) {
    timer = "AM";
  } else {
    timer = "PM";
    hour = hour;
  }

  time.innerHTML = `${timer} ${hour} : ${minute} : ${second}`;
});

add.addEventListener("click", addTask);

function addTask() {
  let task = {
    id: randomId(),
    taskContent: user.value, //리스트 내용 저장
    isComplete: false, //체크 여부 저장
    memo: "", //메모 내용 저장
    isEditing: false, //메모 입력 여부 저장
  };
  console.log(task);
  if (user.value == "") {
    alert("오늘의 할 일을 입력해주세요!");
  } else {
    taskList.push(task);
  }

  render();

  user.value = "";
}

function render() {
  let result = "";
  console.log(taskList);

  taskList.forEach((task) => {
    //메모를 입력할 경우의 내용을 우선 지정, 리스트의 체크 여부는 그 다음
    let memoHTML = "";

    if (task.isEditing == true) {
      //메모를 입력하고 있을 경우
      memoHTML = `<input class="memory" value="${
        task.memo ? task.memo : ""
      }" placeholder="한줄 메모를 기입 후 Enter 키를 눌러주세요."
      onkeypress="memoKey(event, ${task.id})"/> `;
    } else {
      //메모를 표시하고 있을 때
      memoHTML = `<div class="memo ${task.isComplete ? "done " : ""}">${
        task.memo
      }</div>`;
    }

    result += `<div class="task ${task.isComplete ? "done" : ""}">
              <div>
                <div>${task.taskContent}
                  <button onclick="addMemo(${
                    task.id
                  })" onkeypress="if(event.keyCode==13) {addMemo(${
      task.id
    })}"><i class="fa-solid fa-pen-to-square"></i></button>
                </div>
                ${memoHTML}
              </div>
              
              <div>
              <span class="finish">${task.isComplete ? finisher : ""}</span>
                <button onclick="complete(${task.id})"><i class="fa-regular ${
      task.isComplete ? "fa-square-check" : "fa-square"
    }"></i></button>
            
                <button onclick="deleteTask(${
                  task.id
                })"><i class="fa-solid fa-trash"></i></button>
              </div>
            </div>`;
  });
  board.innerHTML = result;
}

//리스트 별 고유id 부여
function randomId() {
  return Date.now();
}

//리스트 체크
function complete(id) {
  taskList.forEach((task) => {
    if (task.id == id) {
      task.isComplete = !task.isComplete;
      memoHTML = `<div class="memo ${task.isComplete ? "done " : ""}">${
        task.memo
      }</div>`;

      let clock = new Date();
      let hour = clock.getHours();
      let minute = clock.getMinutes();
      let second = clock.getSeconds();
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }
      finisher = `${hour} : ${minute} : ${second} 완료!`;
    }
  });
  render();
}
//리스트 제거
function deleteTask(id) {
  taskList = taskList.filter((task) => task.id != id);
  render();
}

// ---------추가된 js---------

//(++)메모 input 열기
function addMemo(id) {
  taskList.forEach((task) => {
    if (task.id == id) {
      task.isEditing = !task.isEditing;
    } else {
      task.isEditing = false;
    }
  });
  render();
}

function memoKey(event, id) {
  if (event.keyCode === 13) {
    const value = event.target.value;

    taskList.forEach((task) => {
      if (task.id == id) {
        task.memo = value; // 메모 내용 저장
        task.isEditing = false;
      }
    });
    render();
  }
}
