const form = document.querySelector("#formulario");
const tweetBox = document.querySelector("#tweet");
const tweetList = document.querySelector("#lista-tweets");

// Capturar el tweet cuando se envia el formulario y agregar el texto al localStorage
form.addEventListener("submit", addTweetItem);

// Agregar los tweets en el LocalStorage y generar la lista de tweets a partir de sus valores
function addTweetItem(e) {
  e.preventDefault();
  let tweet = tweetBox.value;
  if (tweet == "") return;
  let index = localStorage.length;
  localStorage.setItem(index, tweet);
  tweetBox.value = "";
  addTweet(index);
  console.log(localStorage);
}

// Render all tweets on DOM Loading
function renderTweets() {
  for (let i = 0; i < localStorage.length; i++) {
    addTweet(i);
  }
}

// Cada tweet agregado va a ser un list item con texto y un boton que permita eliminar el tweet
function addTweet(index) {
  const li = document.createElement("li");
  li.textContent = localStorage[index];
  const span = document.createElement("span");
  span.classList.add("borrar-tweet");
  span.textContent = "X";
  span.addEventListener("click", (e) => deleteTweet(e, index));
  li.appendChild(span);
  tweetList.appendChild(li);
}

// El boton elimina el li al que corresponde
function deleteTweet(e, index) {
  localStorage.removeItem(index);
  e.target.closest("li").remove();
  console.log(localStorage);
}

// Genera todos los tweets desde el localstorage, no esta en un DOMContentLoaded porque esto genera parte del DOM
renderTweets();
