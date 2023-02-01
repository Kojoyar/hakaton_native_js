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

// logic for CRUD 
// create Post
// connecting to elements 

let createPostModalBtn = document.querySelector('#createPostModal-btn');
let changePostModalBtn = document.querySelector('#changePostModal-btn');
console.log(createPostModalBtn, changePostModalBtn);

let createModalBlock = document.querySelector('#postCreate-modal-block')
let createPostTitle = document.querySelector('#postCreate-title');
let createPostContent = document.querySelector('#postCreate-content');
let createPostImg = document.querySelector('#postCreate-image');
let createPostBtn = document.querySelector('#createPost-btn');
console.log(createModalBlock, createPostTitle, createPostContent, createPostImg, createPostBtn);

let changeModalBlock = document.querySelector('#postChange-modal-block')
let changePostTitle = document.querySelector('#postChange-title');
let changePostContent = document.querySelector('#postChange-content');
let changePostImg = document.querySelector('#postChange-image');
let changePostBtn = document.querySelector('#changePost-btn');
console.log(changeModalBlock, changePostTitle, changePostContent, changePostImg, changePostBtn);

function checkUserForCreatePost () {
  let user = JSON.parse(localStorage.getItem('user'));

  if(user) return user.id;
  return false
}; 

function showCreatePostBtns () {
  let postBtnsBlock = document.querySelector('#btns-block');

  if(!checkUserForCreatePost()) {
      postBtnsBlock.setAttribute('style', 'display: none !important;')
  } else {
      postBtnsBlock.setAttribute('style', 'display: flex !important;')
  }
};

let POSTS_API = ' http://localhost:8000/posts';

async function getPostsData () {
  let res = await fetch(POSTS_API);
  let posts = await res.json();
  return posts
};

async function createPost () {
  let user = JSON.parse(localStorage.getItem('user'));

  if (
      !createPostTitle.value.trim() ||
      !createPostContent.value.trim() ||
      !createPostImg.value.trim()
  ) {
      alert('Fill all inputs, some of them are empty!')
      return
  };

  let postObj = {
      title: createPostTitle.value,
      content: createPostContent.value,
      url: createPostImg.value,
      likes: 0,
      author: {
          id: user.id,
          name: user.username
      }
  };

  fetch(POSTS_API, {
      method: 'POST',
      body: JSON.stringify(postObj),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
  })

  createPostTitle.value = '';
  createPostContent.value = '';
  createPostImg.value = '';

  // render()

};

createPostBtn.addEventListener('click', createPost)

//render 

let postsBlock = document.querySelector('#posts-list');

let like = false;

async function render () {

    postsBlock.innerHTML = '';

    let posts = await getPostsData();
    // console.log(posts);
    if (posts.length === 0) return;

    posts.forEach(item => {
        postsBlock.innerHTML += `
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.content}</p>
                <p class="card-text"><b>Author</b>: ${item.author.name}</p>
                <img src="${item.url}">
                    <div class="d-flex">
                        <p class="likes-num">${item.likes}</p>
                        <img src="https://cdn-icons-png.flaticon.com/512/1029/1029183.png" width="30" height="30">
                    </div>
                    ${checkUserForCreatePost() == item.author.id? 
                    `<a href="#" class="btn btn-dark btn-edit" id="edit-${item.id}">EDIT</a>
                    <a href="#" class="btn btn-danger btn-delete" id=del-${item.id}>DELETE</a>
                    `
                    :
                    '' 
                    }
                    ${checkUserForCreatePost() ? 
                        `<button class="btn btn-primary like-btn" id="like-${item.id}">Like</button>
                        <button class="btn btn-primary dislike-btn" id="dislike-${item.id}">DisLike</button>
                        `
                        :
                        '' 
                    }
            </div>
        </div>
        `
    });

    addDeleteEvent();
    addEditEvent();
    addLikeEvent();
    addDislikeEvent();
    
};

render()

//delete

function addDeleteEvent () {
  let delBtns = document.querySelectorAll('.btn-delete');
  delBtns.forEach(item => item.addEventListener('click', deletePost))
};

async function deletePost (e) {

  let postId = e.target.id.split('-')[1];

  await fetch (`${POSTS_API}/${postId}`, {
      method: 'DELETE'
  });

  render();

};

//update
// let saveBtn = document.querySelector('#changePost-btn');

// function checkCreateAndSaveBtn() {
//     if(saveBtn.id) {
//         addPostBtn.setAttribute('style', 'display: none;');
//         saveBtn.setAttribute('style', 'display: block;');
//     } else {
//         addPostBtn.setAttribute('style', 'display: block;');
//         saveBtn.setAttribute('style', 'display: none;');
//     };
// };

// checkCreateAndSaveBtn();

function addEditEvent() {
  let editBtns = document.querySelectorAll('.btn-edit');
  editBtns.forEach(item => item.addEventListener('click', addPostDataToForm))
}

async function addPostDataToForm(e) {

  let postId = e.target.id.split('-')[1];

  let res = await fetch (`${POSTS_API}/${postId}`)
  let postObj = await res.json();

  changePostTitle.value = postObj.title;
  changePostContent.value = postObj.content;
  changePostImg.value = postObj.url;

  saveBtn.setAttribute('id', postObj.id);

  checkCreateAndSaveBtn();
};

saveBtn.addEventListener('click', saveChanges)

async function saveChanges(e) {

  let updatedPostObj = {
      id: e.target.id,
      title: changePostTitle.value,
      content: changePostContent.value,
      url: changePostImg.value
  };

  await fetch (`${POSTS_API}/${e.target.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedPostObj),
      headers: {
          'Content-Type': 'application/json;charset=utf-8'}
  })

  changePostTitle.value = '';
  changePostContent.value = '';
  changePostImg.value

  // saveBtn.removeAttribute('id');

  // checkCreateAndSaveBtn();

  render();

}

