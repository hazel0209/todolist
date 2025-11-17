let user = document.querySelector("#user");
let add = document.querySelector("#add");
let board = document.querySelector("#board");
let taskList = [];

let day = document.querySelector(".day span");
let time = document.querySelector(".time span");

// 시간 추가
let clockwork = setInterval(function () {
  let clock = new Date();
  let year = clock.getFullYear();
  let month = clock.getMonth(); // 0~11
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
  }

  time.innerHTML = `${timer} ${hour} : ${minute} : ${second}`;
});

add.addEventListener("click", addTask);

function addTask() {
  let task = {
    id: randomId(),
    taskContent: user.value,
    isComplete: false,
    memo: "", //  메모 내용 저장
    isEditing: false, //  메모 입력 모드인지 여부
  };

  taskList.push(task);

  user.value = "";
  render();
}

//리스트 별 고유id 부여
function randomId() {
  return Date.now();
}

function render() {
  let result = "";

  taskList.forEach((task) => {
    let memoHTML = "";

    if (task.isEditing == true) {
      // 입력 모드
      memoHTML = `
        <input
          class="memo-input"
          value="${task.memo ? task.memo : ""}"
          placeholder="한줄 메모를 기입 후 Enter 키를 눌러주세요."
          onkeypress="memoKey(event, ${task.id})"
        />
      `;
    } else {
      // 표시 모드
      memoHTML = `
        <div class="memo ${task.isComplete ? "done" : ""}">
          ${task.memo || ""}
        </div>
      `;
    }

    result += `
      <div class="task ${task.isComplete ? "done" : ""}">
        <div>
          <div>
            ${task.taskContent}
            <button onclick="addMemo(${task.id})">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
          ${memoHTML}
        </div>

        <div>
          <button onclick="complete(${task.id})">
            <i class="fa-regular ${
              task.isComplete ? "fa-square-check" : "fa-square"
            }"></i>
          </button>

          <button onclick="deleteTask(${task.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  board.innerHTML = result;
}

//리스트 체크
function complete(id) {
  taskList.forEach((task) => {
    if (task.id == id) {
      task.isComplete = !task.isComplete;
    }
  });
  render();
}

//리스트 제거
function deleteTask(id) {
  taskList = taskList.filter((task) => task.id != id);
  render();
}

// 메모 입력 모드 on/off
function addMemo(id) {
  taskList.forEach((task) => {
    if (task.id == id) {
      task.isEditing = !task.isEditing; // true ↔ false
    } else {
      task.isEditing = false;
    }
  });
  render();
}

// Enter 키 눌렀을 때 메모 저장
function memoKey(event, id) {
  if (event.keyCode === 13) {
    // Enter
    const value = event.target.value;

    taskList.forEach((task) => {
      if (task.id == id) {
        task.memo = value; // 메모 내용을 task에 저장
        task.isEditing = false; // 입력 모드 종료
      }
    });

    render();
  }
}
