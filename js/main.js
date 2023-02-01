let registerUserModalBtn = document.querySelector("#registerUser-modal");
let loginUserModalBtn = document.querySelector("#loginUser-modal");
let registerUserModalBlock = document.querySelector("#registerUser-block");
let loginUserModalBlock = document.querySelector("#loginUser-block");
let registerUserBtn = document.querySelector("#registerUser-btn");
let loginUserBtn = document.querySelector("#loginUser-btn");
let logoutUserBtn = document.querySelector("#logoutUser-btn");
let closeRegisterModalBtn = document.querySelector(".btn-close");

registerUserModalBtn.addEventListener("click", () => {
  registerUserModalBlock.setAttribute("style", "display: flex !important");
  registerUserBtn.setAttribute("style", "display: flex !important");

  loginUserModalBlock.setAttribute("style", "display: none !important");
  loginUserBtn.setAttribute("style", "display: none !important");
});

loginUserModalBtn.addEventListener("click", () => {
  loginUserModalBlock.setAttribute("style", "display: flex !important");
  loginUserBtn.setAttribute("style", "display: flex !important");

  registerUserModalBlock.setAttribute("style", "display: none !important");
  registerUserBtn.setAttribute("style", "display: none !important");
});

// register logic
const USERS_API = "http://localhost:8000/users";

// inputs group
let usernameInp = document.querySelector("#reg-username");
let ageInp = document.querySelector("#reg-age");
let passwordInp = document.querySelector("#reg-password");
let passwordConfirmInp = document.querySelector("#reg-passwordConfirm");
let isAdminInp = document.querySelector("#isAdmin");

async function checkUniqeUsername(username) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  return users.some((item) => item.username === username);
}
// chekUniqeUsername();
async function registerUser() {
  if (
    !usernameInp.value.trim() &&
    !ageInp.value.trim() &&
    !passwordInp.value.trim() &&
    !passwordConfirmInp.value.trim()
  ) {
    alert("Some inputs are empty!");
    return;
  }

  let uniqeUsername = await checkUniqeUsername(usernameInp.value);
  if (uniqeUsername) {
    alert("User with this username already excists!");
    return;
  }
  if (passwordInp.value !== passwordConfirmInp.value) {
    alert("Password dont match");
    return;
  }

  let userObj = {
    username: usernameInp.value,
    age: ageInp.value,
    password: passwordInp.value,
    isAdmin: isAdminInp.checked,
  };

  fetch(USERS_API, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  usernameInp.value = "";
  ageInp.value = "";
  passwordInp.value = "";
  passwordConfirmInp.value = "";
  isAdminInp.checked = "";

  closeRegisterModalBtn.click();
}
registerUserBtn.addEventListener("click", registerUser);

let showUsername = document.querySelector("#showUsername");
function checkLoginLogoutStatus() {
  let user = localStorage.getItem("user");
  if (!user) {
    loginUserModalBtn.parentNode.style.display = "block";
    logoutUserBtn.parentNode.style.display = "none";
    showUsername.innerText = "No user";
  } else {
    logoutUserBtn.parentNode.style.display = "block";
    loginUserModalBtn.parentNode.style.display = "none";
    showUsername.innerText = JSON.parse(user).username;
  }
}
checkLoginLogoutStatus();

let loginUsernameInp = document.querySelector("#login-username");
// login logic
let passUsernameInp = document.querySelector("#login-password");

function checkUserInUsers(username, users) {
  return users.some((item) => item.username === username);
}

function checkUserPassword(user, password) {
  return user.password === password;
}

function setUserToStorage(username, isAdmin) {
  localStorage.setItem(
    "user",
    JSON.stringify({
      username,
      isAdmin,
    })
  );
}

function getUserFromStorage(posts) {
  localStorage.getItem("user", JSON.parse(posts));
}

async function loginUser() {
  if (!loginUsernameInp.value.trim() || !passUsernameInp.value.trim()) {
    alert("Some inputs are empty!");
    return;
  }

  let res = await fetch(USERS_API);
  let users = await res.json();

  if (!checkUserInUsers(loginUsernameInp.value, users)) {
    alert("User not found!");
    return;
  }

  let userObj = users.find((item) => item.username === loginUsernameInp.value);

  if (!checkUserPassword(userObj, passUsernameInp.value)) {
    alert("Wrong password!");
    return;
  }

  setUserToStorage(userObj.username, userObj.isAdmin);

  loginUsernameInp = "";
  passUsernameInp = "";

  checkLoginLogoutStatus();

  closeRegisterModalBtn.click();

  //   render();
}

loginUserBtn.addEventListener("click", loginUser);

// logout logic
logoutUserBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  checkLoginLogoutStatus();
  // render();
});
