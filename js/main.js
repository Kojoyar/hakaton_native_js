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
