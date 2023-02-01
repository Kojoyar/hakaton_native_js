let registerUserModalBtn = document.querySelector("#registerUser-modal");
let loginUserModalBtn = document.querySelector("#loginUser-modal");
let registerUserModalBlock = document.querySelector("#registerUser-block");
let loginUserModalBlock = document.querySelector("#loginUser-block");
let registerUserBtn = document.querySelector("#registerUser-btn");
let loginUserBtn = document.querySelector("#loginUser-btn");
let logoutUserBtn = document.querySelector("#logoutUser-btn");
let closeRegisterModalBtn = document.querySelector(".btn-close");
console.log(registerUserModalBtn);
console.log(loginUserModalBtn);
console.log(registerUserModalBlock);
console.log(loginUserModalBlock);
console.log(registerUserBtn);
console.log(loginUserBtn);
console.log(logoutUserBtn);
console.log(closeRegisterModalBtn);

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
