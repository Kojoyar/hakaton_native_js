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
let iconInp = document.querySelector("#reg-icon");
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
    (!usernameInp.value.trim() &&
      !ageInp.value.trim() &&
      !passwordInp.value.trim() &&
      !passwordConfirmInp.value.trim()) ||
    !iconInp.value.trim()
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
    icon: iconInp.value,
    favorites: [],
    saved: [],
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
  iconInp.value = "";
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

function setUserToStorage(username, isAdmin, id, favorites, saved, icon) {
  localStorage.setItem(
    "user",
    JSON.stringify({
      username,
      icon,
      isAdmin,
      favorites,
      saved,
      id,
    })
  );
}

function getUserFromStorage() {
  let products = JSON.parse(localStorage.getItem("user"));
  return products;
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

  setUserToStorage(
    userObj.username,
    userObj.isAdmin,
    userObj.id,
    userObj.favorites,
    userObj.saved,
    userObj.icon
  );

  loginUsernameInp = "";
  passUsernameInp = "";

  checkLoginLogoutStatus();
  showCreatePostBtns();

  closeRegisterModalBtn.click();

  render();
}

loginUserBtn.addEventListener("click", loginUser);

// logout logic
logoutUserBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  checkLoginLogoutStatus();
  render();
});

// logic for CRUD
// create Post
// connecting to elements

let createPostModalBtn = document.querySelector("#createPostModal-btn");
let changePostModalBtn = document.querySelector("#changePostModal-btn");

let createModalBlock = document.querySelector("#postCreate-modal-block");
let createPostTitle = document.querySelector("#postCreate-title");
let createPostContent = document.querySelector("#postCreate-content");
let createPostImg = document.querySelector("#postCreate-image");
let createPostBtn = document.querySelector("#createPost-btn");

let changeModalBlock = document.querySelector("#postChange-modal-block");
let changePostTitle = document.querySelector("#postChange-title");
let changePostContent = document.querySelector("#postChange-content");
let changePostImg = document.querySelector("#postChange-image");
let changePostBtn = document.querySelector("#changePost-btn");

function checkUserForCreatePost() {
  let user = JSON.parse(localStorage.getItem("user"));

  if (user) return user.id;
  return false;
}

function showCreatePostBtns() {
  let postBtnsBlock = document.querySelector("#btns-block");

  if (!checkUserForCreatePost()) {
    postBtnsBlock.setAttribute("style", "display: none !important;");
  } else {
    postBtnsBlock.setAttribute("style", "display: flex !important;");
  }
}

showCreatePostBtns();

let closeModalPostBtn = document.querySelector(".btn-close-postModal");

let POSTS_API = " http://localhost:8000/posts";

async function getPostsData() {
  let res = await fetch(POSTS_API);
  let posts = await res.json();
  return posts;
}

async function createPost() {
  let user = JSON.parse(localStorage.getItem("user"));

  if (
    !createPostTitle.value.trim() ||
    !createPostContent.value.trim() ||
    !createPostImg.value.trim()
  ) {
    alert("Fill all inputs, some of them are empty!");
    return;
  }

  let postObj = {
    title: createPostTitle.value,
    content: createPostContent.value,
    url: createPostImg.value,
    likes: 0,
    author: {
      id: user.id,
      name: user.username,
      icon: user.icon,
    },
    comments: [],
  };

  fetch(POSTS_API, {
    method: "POST",
    body: JSON.stringify(postObj),
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

  createPostTitle.value = "";
  createPostContent.value = "";
  createPostImg.value = "";

  render();

  closeModalPostBtn.click();
}

createPostBtn.addEventListener("click", createPost);

//render
let currentPage = 1;
let search = '';

let postsBlock = document.querySelector("#posts-list");

let like = false;

async function render() {

  postsBlock.innerHTML = "";

  let requestAPI = `${POSTS_API}?q=${search}&_page=${currentPage}&_limit=3`;

  let res = await fetch(requestAPI);
  let posts = await res.json();

  if (posts.length === 0) return;

  posts.forEach((item) => {
    postsBlock.innerHTML += `
      <div class="post mx-2">
        <div class="info">
            <div class="user">
                <div class="profile-pic">
                    <img width='30px' height='30px' src="${
                      item.author.icon
                    }" alt="">
                </div>
                <p class="username">${item.author.name}</p>
            </div>
            <!-- Edit Delete -->
            ${
              checkUserForCreatePost() == item.author.id
                ? `<div class="dropdown">
              <a class="dropdown-toggle" href="#" data-bs-toggle="dropdown">
              <i class="fas fa-ellipsis-h"></i>
              </a>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li><a id="edit-${item.id}" data-bs-toggle="modal"
              data-bs-target="#staticBackdropPost" class="dropdown-item post_edit" href="#">Edit</a></li>
              <li><a class="dropdown-item post_delete" id="del-${item.id}" href="#">Delete</a></li>
              </ul>
              </div>
              `
                : ""
            }
        </div>
        <div class="d-flex flex-wrap justify-content-center align-items-center" >
        <img src="${
          item.url
        }" class="post-image mr-5" width='400' height='400' alt="">
        </div>
        <hr>
        <div class="post-content">
            <div class="reaction-wrapper">
                <img src="assets/img/like.PNG" class="icon" alt="">
                <img src="assets/img/comment.PNG" class="icon" alt="">
                <img src="assets/img/send.PNG" class="icon" alt="">
                <img src="assets/img/save.PNG" class="save icon" alt="">
            </div>
            <p class="likes">${item.likes} likes</p>
            <p>${item.title}</p>
            <p class="description">${item.content}</p>
            <p class="post-time">${new Date()}</p>
        </div>
        <hr>
        <!-- Likes -->
        ${
          checkUserForCreatePost()
            ? `<button class="btn btn-primary like-btn" id="like-${item.id}">Like</button>
          <button class="btn btn-primary dislike-btn" id="dislike-${item.id}">DisLike</button>
          <div class="comment-wrapper">
            <img src="assets/img/smile.PNG" class="icon" alt="">
            <input type="text" class="comment-box" placeholder="Add a comment" id="commentinp-${item.id}">
            <button class="comment-btn" id="commentbtn-${item.id}">Post</button>
          </div>
          <button id='save-${item.id}' class='mt-3 save-post'>Save Post</button>
          `
            : ""
        }
        <div class="comment-container" id="commcontainer-${item.id}">
            <button class="btn btn-secondary read-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" id="read-${item.id}">
              Read all comments to this post
            </button>
        </div>
    </div>
        `;
  });

    addDeleteEvent();
    editModalEvent ();
    addEditEvent();
    addLikeEvent();
    savePostFunc();
    addDislikeEvent();
    likeBtnsChecks();
    addCommentEvent()
    addReadComments()
}


function likeBtnsChecks() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;
  // console.log(user.favorites);

  let dislikeBtns = document.querySelectorAll(".dislike-btn");
  // console.log(dislikeBtns);
  let likeBtns = document.querySelectorAll(".like-btn");
  // console.log(likeBtns);
  let newArrDislike = [];
  let newArrLike = [];

  if (user.favorites) {
    let newArrdisLikeBtns = [...dislikeBtns];
    newArrdisLikeBtns.map(function (item) {
      user.favorites.forEach((i) => {
        if (item.id.split("-")[1] == i.id) {
          console.log(item);
          newArrDislike.push(item);
        }
      });
    });
    // console.log(newArr)
    newArrdisLikeBtns.forEach((item) => {
      item.setAttribute("style", "display: block !important");
    });

    let newArrLikeBtns = [...likeBtns];
    newArrLikeBtns.map(function (item) {
      user.favorites.forEach((i) => {
        if (item.id.split("-")[1] == i.id) {
          newArrLike.push(item);
        }
      });
    });
    console.log(newArrLike);
    newArrLike.forEach((item) => {
      item.setAttribute("style", "display: none !important");
    });
  }
};


changePostModalBtn.addEventListener("click", () => {
  createModalBlock.setAttribute("style", "display: none !important;");
  createPostBtn.setAttribute("style", "display: none !important;");
  changeModalBlock.setAttribute("style", "display: flex !important");
  changePostBtn.setAttribute("style", "display: flex !important");
});

createPostModalBtn.addEventListener("click", () => {
  createModalBlock.setAttribute("style", "display: flex !important;");
  createPostBtn.setAttribute("style", "display: flex !important;");
  changeModalBlock.setAttribute("style", "display: none !important");
  changePostBtn.setAttribute("style", "display: none !important");
});

function editModalEvent() {
  let editBtns = document.querySelectorAll(".post_edit");
  editBtns.forEach((item) =>
    item.addEventListener("click", () => {
      createModalBlock.setAttribute("style", "display: none !important;");
      createPostBtn.setAttribute("style", "display: none !important;");
      changeModalBlock.setAttribute("style", "display: flex !important");
      changePostBtn.setAttribute("style", "display: flex !important");
    })
  );
}

render();

//delete
function addDeleteEvent() {
  let delBtns = document.querySelectorAll(".post_delete");
  delBtns.forEach((item) => item.addEventListener("click", deletePost));
}

async function deletePost(e) {
  let postId = e.target.id.split("-")[1];
  await fetch(`${POSTS_API}/${postId}`, {
    method: "DELETE",
  });

  render();
}

//update
let saveBtn = document.querySelector("#changePost-btn");

function addEditEvent() {
  let editBtns = document.querySelectorAll(".post_edit");
  editBtns.forEach((item) => item.addEventListener("click", addPostDataToForm));
}

async function addPostDataToForm(e) {
  let postId = e.target.id.split("-")[1];

  let res = await fetch(`${POSTS_API}/${postId}`);
  let postObj = await res.json();

  changePostTitle.value = postObj.title;
  changePostContent.value = postObj.content;
  changePostImg.value = postObj.url;

  saveBtn.setAttribute("id", postObj.id);
}

saveBtn.addEventListener("click", saveChanges);

async function saveChanges(e) {
  let updatedPostObj = {
    id: e.target.id,
    title: changePostTitle.value,
    content: changePostContent.value,
    url: changePostImg.value,
  };

  await fetch(`${POSTS_API}/${e.target.id}`, {
    method: "PATCH",
    body: JSON.stringify(updatedPostObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  changePostTitle.value = "";
  changePostContent.value = "";
  changePostImg.value = "";

  saveBtn.removeAttribute("id");
  closeModalPostBtn.click();

  render();
}

// save logic
function setPostsToStorage(product) {
  localStorage.setItem("user", JSON.stringify(product));
}
async function saveBtnToLocaleStorage(e) {
  let postId = e.target.id.split("-")[1];
  let res = await fetch(POSTS_API);
  let posts = await res.json();
  let postObj = await posts.find((item) => item.id == postId);

  let post = await getUserFromStorage();

  if (!postObj) {
    await fetch(`${POSTS_API}/${postId}`, {
      method: "PATCH",
      body: JSON.stringify(postObj),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    let saved = post.saved.filter((item) => item.id != postId);
    post.saved = saved;
    setPostsToStorage(post);
    render();
    return;
  }
  if (postObj) {
    post.saved.push(postObj);
    setPostsToStorage(post);
    await fetch(`${POSTS_API}/${postId}`, {
      method: "PATCH",
      body: JSON.stringify(postObj),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  }
  render();
}

function savePostFunc() {
  let savePostBtns = document.querySelectorAll(".save-post");
  savePostBtns.forEach((item) =>
    item.addEventListener("click", saveBtnToLocaleStorage)
  );
}

let saveContent = document.querySelector("#modal-posts");
async function lookSavedPostsFunc() {
  saveContent.innerHTML = "";
  let user = getUserFromStorage();
  let saved = user.saved;
  saved.forEach((item) => {
    saveContent.innerHTML += `
    <div class="post">
    <div class="info">
        <div class="user">
            <div class="profile-pic">
                <img src="${item.author.image}" alt="">
            </div>
            <p class="username">${item.author.name}</p>
        </div>
        <!-- Edit Delete -->
        ${
          checkUserForCreatePost() == item.author.id
            ? `<div class="dropdown">
          <a class="dropdown-toggle" href="#" data-bs-toggle="dropdown">
          <i class="fas fa-ellipsis-h"></i>
          </a>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <li><a id="edit-${item.id}" data-bs-toggle="modal"
          data-bs-target="#staticBackdropPost" class="dropdown-item post_edit" href="#">Edit</a></li>
          <li><a class="dropdown-item post_delete" id="del-${item.id}" href="#">Delete</a></li>
          </ul>
          </div>
          `
            : ""
        }

    </div>
    <div class="d-flex flex-wrap justify-content-center align-items-center" >
    <img src="${
      item.url
    }" class="post-image mr-5" width='400' height='400' alt="">
    </div>
    <div class="post-content">
        <div class="reaction-wrapper">
            <img src="assets/img/like.PNG" class="icon" alt="">
            <img src="assets/img/comment.PNG" class="icon" alt="">
            <img src="assets/img/send.PNG" class="icon" alt="">
            <img src="assets/img/save.PNG" class="save icon" alt="">
        </div>
        <p class="likes">${item.likes} likes</p>
        <p>${item.title}</p>
        <p class="description">${item.content}</p>
        <p class="post-time">${new Date()}</p>
    </div>
    <div class="comment-wrapper">
        <img src="assets/img/smile.PNG" class="icon" alt="">
        <input type="text" class="comment-box" placeholder="Add a comment">
        <button class="comment-btn">Post</button>
    </div>
    <button id='save-${item.id}' class='mt-3 save-post'>Save Post</button>
</div>
    `;
  });
}

let lookSavedPosts = document.querySelector(".btn-saved");
console.log(lookSavedPosts);
lookSavedPosts.addEventListener("click", lookSavedPostsFunc);

//like

function addLikeEvent() {
  let likeBtns = document.querySelectorAll(".like-btn");
  likeBtns.forEach((item) => item.addEventListener("click", putLike));
}

function addDislikeEvent() {
  let dislikeBtns = document.querySelectorAll(".dislike-btn");
  dislikeBtns.forEach((item) => item.addEventListener("click", putDislike));
}

async function putLike(e) {
  let user = JSON.parse(localStorage.getItem("user"));
  let postId = e.target.id.split("-")[1];

  let posts = await getPostsData();
  let postObj = posts.find((item) => item.id == postId);
  // console.log(postObj);

  function checkIfLiked(favorites, postId) {
    let likedPost = favorites.find((item) => item.id == postId);
    return likedPost;
  }

  if (!checkIfLiked(user.favorites, postId)) {
    postObj.likes += 1;

    user.favorites.push(postObj);
    localStorage.setItem("user", JSON.stringify(user));

    await fetch(`${POSTS_API}/${postId}`, {
      method: "PATCH",
      body: JSON.stringify(postObj),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    await fetch(`${USERS_API}/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify({ favorites: user.favorites }),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  }

  user.favorites.push(postObj);
  render();

  return (like = true);
}

async function putDislike(e) {
  let user = JSON.parse(localStorage.getItem("user"));
  let postId = e.target.id.split("-")[1];

  let posts = await getPostsData();
  let postObj = posts.find((item) => item.id == postId);
  // console.log(postObj);

  function checkIfLiked(favorites, postId) {
    let likedPost = favorites.find((item) => item.id == postId);
    return likedPost;
  }

  if (postObj.likes === 0) return;

  if (checkIfLiked(user.favorites, postId)) {
    postObj.likes -= 1;

    await fetch(`${POSTS_API}/${postId}`, {
      method: "PATCH",
      body: JSON.stringify(postObj),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    let favorites = user.favorites.filter((item) => item.id != postId);
    user.favorites = favorites;

    await fetch(`${USERS_API}/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify({ favorites: user.favorites }),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    localStorage.setItem("user", JSON.stringify(user));
  }
  render();

  return (like = false);
}


function addReadComments () {
  let readBtns = document.querySelectorAll('.read-btn');
  readBtns.forEach(item => item.addEventListener('click', showAllComments))
}

async function showAllComments (e) {

  let postId = e.target.id.split('-')[1];

  let posts = await getPostsData();
  let postObj = posts.find(item => item.id == postId);
  console.log(postObj);

  postObj.comments.forEach(item => {
  
    let card = document.createElement('div');
    card.innerHTML = ''
    
    card.setAttribute('class', 'collapse');
    card.setAttribute('id', 'collapseExample');
    
    card.innerHTML += `
      <div class="card-comment card-body">
        <p>Commentator: ${item.name}</p>
        <p>${item.text}</p>
        <hr>
      </div>
      `
    e.target.parentNode.append(card);
   
  })
 
}


function addCommentEvent() {
  let addCommentBtns = document.querySelectorAll(".comment-btn");
  addCommentBtns.forEach((item) =>
    item.addEventListener("click", addCommentToPosts)
  );
}

async function addCommentToPosts(e) {
  let user = JSON.parse(localStorage.getItem("user"));
  let posts = await getPostsData();
  let postId = e.target.id.split("-")[1];

  let commentInputs = document.querySelectorAll(".comment-box");
  let commentInputsArr = [...commentInputs];

  let commentInp = commentInputsArr.find(
    (item) => item.id.split("-")[1] == postId
  );

  let postObj = posts.find((item) => item.id == postId);

  let commentObj = {
    id: user.id,
    name: user.username,
    text: commentInp.value,
  };

  postObj.comments.push(commentObj);

  await fetch(`${POSTS_API}/${postId}`, {
    method: "PATCH",
    body: JSON.stringify(postObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  localStorage.setItem("user", JSON.stringify(user));

  commentInp.value = "";
}
//search

let searchInp = document.querySelector('#search-inp');

searchInp.addEventListener('input', () => {
  search = searchInp.value;
  currentPage = 1;
  render();
});

//pagination

let prevPageBtn = document.querySelector('#prev-page-btn');
let nextPageBtn = document.querySelector('#next-page-btn');

async function getPagesCount () {
    let res = await fetch(`${POSTS_API}`);
    let products = await res.json();

    let pagesCount = Math.ceil(products.length/3);
    console.log(pagesCount, typeof pagesCount);
    return pagesCount
};

async function checkPages () {
    let maxPageNum = await getPagesCount();

    if(currentPage === 1) {
        prevPageBtn.setAttribute('style', 'display: none;');
        nextPageBtn.setAttribute('style', 'display: block;');
    } else if(currentPage === maxPageNum) {
        nextPageBtn.setAttribute('style', 'display: none;');
        prevPageBtn.setAttribute('style', 'display: block;')
    } else {
        nextPageBtn.setAttribute('style', 'display: block;');
        prevPageBtn.setAttribute('style', 'display: block;')
    };
};

checkPages();

prevPageBtn.addEventListener('click', () => {
    currentPage--;
    checkPages();
    render();
});

nextPageBtn.addEventListener('click', () => {
    currentPage++;
    checkPages();
    render();
});
