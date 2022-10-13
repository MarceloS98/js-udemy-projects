const cart = document.querySelector("#carrito tbody");
const addItemBtns = document.querySelectorAll("a[data-id]");
const emptyCart = document.querySelector("#vaciar-carrito");

// Funcion constructora del curso a comprar
function Course({ id, name, image, price, quantity }) {
  this.id = id;
  this.name = name;
  this.image = image;
  this.price = price;
  this.quantity = quantity;
}

// El carrito de vacia al presionar 'Vaciar Carrito'
emptyCart.addEventListener("click", () => (cart.innerHTML = ""));

// Funcion que permite eliminar los items individuales del carrito de compras
function deleteThisCourse() {
  this.closest("tr").remove();
}

// Al clickear el boton, hace traversing hasta el padre con clase .card y crea un objeto con la url de la imagen, el nombre del curso, y el precio. Retorna el objeto.
function addItem(e) {
  let card = e.target.closest(".card");
  let cardInfo = new Course({
    id: card.querySelector("[data-id]").getAttribute("data-id"),
    image: card.firstElementChild.src,
    name: card.querySelector(".info-card > h4").textContent,
    price: card.querySelector(".precio > span").textContent,
  });
  return cardInfo;
}

// Verifica si el item agregado al carrito es repetido
function itemIsRepeated(cardInfo) {
  const cartItems = cart.querySelectorAll("tr");
  if (cartItems.length === 0) return false;
  for (let i = 0; i < cartItems.length; i++) {
    let itemId = cartItems[i].getAttribute("data-id");
    if (itemId === cardInfo.id) return true;
  }
}

// Si es repetido, aumenta la cantidad
function increaseQuantity(cardInfo) {
  const cartItems = cart.querySelectorAll("tr");
  cartItems.forEach((item) => {
    let itemId = item.getAttribute("data-id");
    if (itemId === cardInfo.id) {
      const repeatedItem = cart.querySelector(`[data-id='${cardInfo.id}']`);
      let repeatedItemQuantityElement =
        repeatedItem.querySelector("td:nth-child(4)");
      let repeatedItemQuantity = +repeatedItemQuantityElement.textContent;
      repeatedItemQuantityElement.textContent = ++repeatedItemQuantity;
    }
  });
}

// Funcion creadora del cartItem
function createCartItem(cardInfo) {
  let courseImgContainer = document.createElement("td");
  let courseImg = document.createElement("img");
  courseImg.src = cardInfo.image;
  courseImg.setAttribute("width", "150");
  courseImgContainer.appendChild(courseImg);
  let courseName = document.createElement("td");
  courseName.textContent = cardInfo.name;
  let coursePrice = document.createElement("td");
  coursePrice.textContent = cardInfo.price;
  let courseQuantity = document.createElement("td");
  cardInfo.quantity = 1;
  courseQuantity.textContent = cardInfo.quantity;
  let deleteCourse = document.createElement("td");
  let deleteButton = document.createElement("a");
  deleteButton.textContent = "X";
  deleteButton.classList.add("borrar-curso");
  deleteButton.setAttribute("href", "#");
  deleteButton.addEventListener("click", deleteThisCourse);
  deleteCourse.appendChild(deleteButton);

  let courseContainer = document.createElement("tr");
  courseContainer.dataset.id = cardInfo.id;
  courseContainer.append(
    courseImgContainer,
    courseName,
    coursePrice,
    courseQuantity,
    deleteCourse
  );
  cart.appendChild(courseContainer);
}

// Si el item añadido es repetido, llama a increaseQuantity(), sino crea el item llamando a createCartItem()
function addToCart(e) {
  let cardInfo = addItem(e);

  if (itemIsRepeated(cardInfo)) {
    increaseQuantity(cardInfo);
  } else {
    createCartItem(cardInfo);
  }
}

// Añade la funcionalidad de addToCart() en todos los botones de "Agregar al carrito"
addItemBtns.forEach((btn) => {
  btn.addEventListener("click", addToCart);
});
