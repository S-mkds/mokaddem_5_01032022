// get aray on storage
let produitLocalStorage = JSON.parse(localStorage.getItem("storage") || "[]");
console.table(produitLocalStorage); // console tableau des produits
const numberOfItems = produitLocalStorage.length;
// console.log(numberOfItems); // console log nombre de produit
const cart = [];
const item = produitLocalStorage;
cart.push(item);

async function updatePrice() {
  for (let i = 0; i < produitLocalStorage.length; i++) {
    await fetch(
      `http://localhost:3000/api/products/${produitLocalStorage[i].productId}`
    ) // L'appel de fetch pour chaque item dans le panier
      .then((response) => response.json())
      .then((res) => {
        produitLocalStorage[i].price = res.price;
      });
  }
}
updatePrice();
//------------------------------------start display cart------------------------------------/
function displayCart() {
  // Si le panier est vide tu affiche <p>le panier est vide</p>
  if (produitLocalStorage === null || produitLocalStorage == 0) {
    const empty = document.querySelector("#cart__items");
    const emptyCart = `<p>Le panier est vide, retourner à la page d'accueil</p>`;
    empty.innerHTML = emptyCart;
    empty.style.textAlign = "center";
    empty.style.padding = "1rem";
  } else {
    // sinon création de l'article HTML avec les élements du localStorage
    const getCartItem = document.getElementById("cart__items");
    for (let i = 0; i < produitLocalStorage.length; i++) {
      const product = produitLocalStorage[i];
      const displayItem = document.createElement("div");
      displayItem.innerHTML = `
    <article class="cart__item" data-id="${product.productId}" data-color="${product.color}">
    <div class="cart__item__img">
    ${product.imageUrl}
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${product.name}</h2>
        <p>${product.color}</p>
        <p>${product.price}</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Quantité : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}" oninput="quantityModify(${i}, this)">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" onclick="deleteProduct(${i})">Supprimer</p>
        </div>
      </div>
    </div>
  </article>
    `;
      getCartItem.appendChild(displayItem);
    }
  }
}
displayCart();
//------------------------------------end display cart------------------------------------

//---------------------------start function { price, quantity, delete}--------------------
//calcule la quantité total en fonction des entrées de l'array cart
function totalProduct() {
  // Récupération du total des quantités
  let elemsQtt = document.getElementsByClassName("itemQuantity");
  let myLength = elemsQtt.length,
    totalQtt = 0,
    totalPrice = 0;

  for (var i = 0; i < myLength; ++i) {
    totalQtt += elemsQtt[i].valueAsNumber;
    totalPrice += elemsQtt[i].valueAsNumber * produitLocalStorage[i].price;
  }
  let productTotalQuantity = document.getElementById("totalQuantity");
  productTotalQuantity.innerHTML = totalQtt;
  let productTotalPrice = document.getElementById("totalPrice");
  productTotalPrice.innerHTML = totalPrice;
}
totalProduct();

// Modification d'une quantité de produit
function quantityModify(i, input) {
  produitLocalStorage[i].quantity = parseInt(input.value);
  localStorage.setItem("storage", JSON.stringify(produitLocalStorage));
  totalProduct();
}

// Suppression d'un produit

function deleteProduct(i) {
  // supression d'un article selon la couleur et l'id
  let idDelete = produitLocalStorage[i].productId;
  let colorDelete = produitLocalStorage[i].color;
  produitLocalStorage = produitLocalStorage.filter(
    (el) => el.productId != idDelete || el.color != colorDelete
  );
  localStorage.setItem("storage", JSON.stringify(produitLocalStorage));
  //Alerte produit supprimé et reload
  alert("Ce produit a bien été supprimé du panier");
  location.reload();
}

//---------------------------end function {price, quantity, delete}--------------------

//---------------------------Start Function ValidForm-----------------------------------
function validForm() {
  let orderbtn = document.getElementById("order"); // Selection du bouton commander afin de pour l'annuler
  let formChange = document.querySelector(".cart__order__form");
  formChange.firstName.addEventListener("input", () => {
    valideFirstNameRegex(this);
  });
  formChange.lastName.addEventListener("input", () => {
    valideLastNameRegex(this);
  });
  formChange.address.addEventListener("input", () => {
    valideAddressRegex(this);
  });
  formChange.city.addEventListener("input", () => {
    valideCityRegex(this);
  });
  formChange.email.addEventListener("input", () => {
    valideEmailRegex(this);
  });

  // REGEXP FIRSTNAME
  const valideFirstNameRegex = function () {
    let firstNameReg = new RegExp("^[A-Z][a-zA-Z -]+$");
    let firstNameErrMsg =
      document.getElementById("firstName").nextElementSibling;

    if (firstNameReg.test(formChange.firstName.value)) {
      firstNameErrMsg.innerHTML = "prénom Valide";
      firstNameErrMsg.style.color = "#c8f217";
      orderbtn.disabled = ""; // dans le cas ou le bouton est désactivé, on le réactive
    } else {
      firstNameErrMsg.innerHTML = "prénom non Valide";
      firstNameErrMsg.style.color = "#fbbcbc";
      orderbtn.disabled = "disabled"; // Si on entre dans le 'else' le bouton commander est désactivé
    }
  };
  // REGEXP LASTNAME
  const valideLastNameRegex = function () {
    let lastNameReg = new RegExp("^[A-Z][a-zA-Z -]+$");
    let lastNameErrMsg = document.getElementById("lastName").nextElementSibling;

    if (lastNameReg.test(formChange.lastName.value)) {
      lastNameErrMsg.innerHTML = "Nom Valide";
      lastNameErrMsg.style.color = "#c8f217";
      orderbtn.disabled = "";
    } else {
      lastNameErrMsg.innerHTML = "Nom non Valide";
      lastNameErrMsg.style.color = "#fbbcbc";
      orderbtn.disabled = "disabled";
    }
  };

  // REGEXP ADDRESS
  const valideAddressRegex = function () {
    let addressReg = new RegExp("^[0-9a-zA-Z -,]+$");
    let addressErrMsg = document.getElementById("address").nextElementSibling;

    if (addressReg.test(formChange.address.value)) {
      addressErrMsg.innerHTML = "Addresse Valide";
      addressErrMsg.style.color = "#c8f217";
      orderbtn.disabled = "";
    } else {
      addressErrMsg.innerHTML = "Addresse non Valide";
      addressErrMsg.style.color = "#fbbcbc";
      orderbtn.disabled = "disabled";
    }
  };

  // REGEXP CITY
  const valideCityRegex = function () {
    let cityReg = new RegExp("^[0-9a-zA-Z -,]+$");
    let cityErrMsg = document.getElementById("city").nextElementSibling;

    if (cityReg.test(formChange.city.value)) {
      cityErrMsg.innerHTML = "Ville Valide";
      cityErrMsg.style.color = "#c8f217";
      orderbtn.disabled = "";
    } else {
      cityErrMsg.innerHTML = "Ville non Valide";
      cityErrMsg.style.color = "#fbbcbc";
      orderbtn.disabled = "disabled";
    }
  };

  // REGEXP EMAIL
  const valideEmailRegex = function () {
    let emailRegExp = new RegExp(
      "^[A-Za-z0-9.A-Za-z0-9-A-Za-z0-9_A-Za-z0-9]+[@]{1}[a-zA-Z0-9.-_]+$"
    );
    let emailErrMsg = document.getElementById("email").nextElementSibling;

    if (emailRegExp.test(formChange.email.value)) {
      emailErrMsg.innerHTML = "Email Valide";
      emailErrMsg.style.color = "#c8f217";
      orderbtn.disabled = "";
    } else {
      emailErrMsg.innerHTML = "Email non Valide";
      emailErrMsg.style.color = "#fbbcbc";
      orderbtn.disabled = "disabled";
    }
  };
}

validForm();
//---------------------------End Function ValidForm-----------------------------------

//---------------------------start function valid order---------------------------------
//Envoi des informations client au localstorage
function validCommand() {
  const form = document.querySelector(".cart__order__form");
  //evenement au panier submit
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    //Récupération des coordonnées du formulaire
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let Email = document.getElementById("email").value;

    // Si panier vide => return
    if (produitLocalStorage === null || produitLocalStorage == 0) {
      alert("Veuillez rajouter des articles dans le panier");
      return;
    }
    // Si fisrtname, lastname, address, city = vide => return
    if (firstName === "" || lastName === "" || address === "" || city === "") {
      alert("Le champ de formulaire est vide");
      return;
    }
    // sinon je créé un tableau et j'envoi les données
    else {
      // rentre les variables dans un tableau
      let contact = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: Email,
      };
      // boucle du tableau du localStorage afin de récupérer les id et les intégrer dans mon tableau productOrder
      let productOrder = [];
      produitLocalStorage.forEach((order) => {
        productOrder.push(order.productId);
      });
      console.table(productOrder);
      // je fais appel à l'api order pour envoyer mes tableaux
      let pageOrder = { contact: contact, products: productOrder };
      console.log(pageOrder);

      fetch("http://localhost:3000/api/products/order", {
        method: "POST", //requete HTTP post pour envoyer la commande
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(pageOrder),
        mode: "cors",
        credentials: "same-origin",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          alert(
            "Commande validée, cliquez sur OK pour voir votre numéro de commande"
          );
          localStorage.clear(produitLocalStorage);
          window.location.href = "./confirmation.html?orderId=" + data.orderId;
        })
        .catch((error) => {
          alert(error);
        });
    }
  });
}
validCommand();
//---------------------------end function valid order--------------------------------
