// get aray on storage
let produitLocalStorage = JSON.parse(localStorage.getItem("storage") || "[]");
console.table(produitLocalStorage); // console tableau des produits
const numberOfItems = produitLocalStorage.length;
// console.log(numberOfItems); // console log nombre de produit
const cart = [];
const item = produitLocalStorage;
cart.push(item);

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
        <p>${product.price}€</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Quantité : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${product.quantity}>
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" onclick = "deleteProduct(${i})">Supprimer</p>
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
    totalQtt = 0;

  for (var i = 0; i < myLength; ++i) {
    totalQtt += elemsQtt[i].valueAsNumber;
  }
  let productTotalQuantity = document.getElementById("totalQuantity");
  productTotalQuantity.innerHTML = totalQtt;
  // Récupération du prix total
  totalPrice = 0;
  for (var i = 0; i < myLength; ++i) {
    totalPrice += elemsQtt[i].valueAsNumber * produitLocalStorage[i].price;
  }
  let productTotalPrice = document.getElementById("totalPrice");
  productTotalPrice.innerHTML = totalPrice;
}
totalProduct(); // Appel de la fonction

// Modification d'une quantité de produit
function quantityModify() {
  let qttModif = document.querySelectorAll(".itemQuantity");

  for (let k = 0; k < qttModif.length; k++) {
    qttModif[k].addEventListener("change", (event) => {
      event.preventDefault();
      //Selection de l'element à modifier en fonction de son id ET sa couleur
      let quantityModif = produitLocalStorage[k].quantity;
      let qttModifValue = qttModif[k].valueAsNumber;
      const resultFind = produitLocalStorage.find(
        (el) => el.qttModifValue !== quantityModif
      );
      resultFind.quantity = qttModifValue;
      produitLocalStorage[k].quantity = resultFind.quantity;
      localStorage.setItem("storage", JSON.stringify(produitLocalStorage));
      location.reload();
    });
  }
}
quantityModify(); // Appel de la fonction

// Suppression d'un produit

function deleteProduct(i) {
  //Selection de l'element à supprimer en fonction de son basketId ( random de 0 a 100 000 )
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

//---------------------------end function { price, quantity, delete}--------------------

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
    let contactEmail = document.getElementById("email").value;
    let emailReg = /\S+@\S+\.\S+/;

    // Si panier vide => return
    if (produitLocalStorage === null || produitLocalStorage == 0) {
      alert("Veuillez rajouter des articles dans le panier");
      return;
    }
    // Si email vide et erreur => return
    if (emailReg.test(contactEmail) == false) {
      alert("Veuillez entrer un email valide");
      return;
    }

    // Si fisrtname, lastname, address, city = vide => return
    if (firstName === "" || lastName === "" || address === "" || city === "") {
      alert("Il y a une erreur dans le champ de formulaire");
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
        email: contactEmail,
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
//---------------------------end function valid order---------------------------------

//---------------------------Test with display html with "createElement" ------------
// à mettre dans le else insertion DOM !!!!!!!!!!!!!!!!!!
// for (let produit in produitLocalStorage) {
//   // Creation de la balise <article> qui contiendra les élements HTML à afficher
//   let articleCreate = document.createElement("article");
//   document.querySelector("#cart__items").appendChild(articleCreate);
//   articleCreate.className = "cart__item";
//   articleCreate.setAttribute(
//     "data-id",
//     produitLocalStorage[produit].productId
//   );

//   // Creation de l'élément <div>
//   let divImageCreate = document.createElement("div");
//   articleCreate.appendChild(divImageCreate);
//   divImageCreate.className = "cart__item__img";
//   divImageCreate.innerHTML = produitLocalStorage[produit].imageUrl;

//   // Creation de l'élément <div>
//   let productItemContent = document.createElement("div");
//   articleCreate.appendChild(productItemContent);
//   productItemContent.className = "cart__item__content";

//   // Creation de l'élément <div>
//   let titlePriceDivCreate = document.createElement("div");
//   productItemContent.appendChild(titlePriceDivCreate);
//   titlePriceDivCreate.className = "cart__item__content__titlePrice";

//   // Creation du titre <h3>
//   let titleCreate = document.createElement("h2");
//   titlePriceDivCreate.appendChild(titleCreate);
//   titleCreate.innerHTML = produitLocalStorage[produit].name;

//   // Creation de la couleur <p>
//   let colorCreate = document.createElement("p");
//   titleCreate.appendChild(colorCreate);
//   colorCreate.innerHTML = produitLocalStorage[produit].color;

//   // Creation de la couleur <p>
//   let descriptionCreate = document.createElement("p");
//   titleCreate.appendChild(descriptionCreate);
//   descriptionCreate.innerHTML = produitLocalStorage[produit].description;
//   descriptionCreate.style.fontSize = ".5em";
//   descriptionCreate.style.padding = ".5em .5em .5em 0em";

//   // Creation du prix <p>
//   let priceCreate = document.createElement("p");
//   titlePriceDivCreate.appendChild(priceCreate);
//   priceCreate.innerHTML = produitLocalStorage[produit].price + " €";

//   // Creation de l'élément <div>
//   let itemContentSetting = document.createElement("div");
//   productItemContent.appendChild(itemContentSetting);
//   itemContentSetting.className = "cart__item__content__settings";

//   // Creation de l'élément <div> Quantité
//   let ItemContentSettingQuantity = document.createElement("div");
//   itemContentSetting.appendChild(ItemContentSettingQuantity);
//   ItemContentSettingQuantity.className =
//     "cart__item__content__settings__quantity";

//   // Creation de la balise <p>"Qté : "</p>
//   let productQteP = document.createElement("p");
//   ItemContentSettingQuantity.appendChild(productQteP);
//   productQteP.innerHTML = "Qté : ";

//   // Creation de la quantité <input>
//   let inputQuantity = document.createElement("input");
//   ItemContentSettingQuantity.appendChild(inputQuantity);
//   inputQuantity.value = produitLocalStorage[produit].quantity;
//   inputQuantity.className = "itemQuantity";
//   inputQuantity.setAttribute("type", "number");
//   inputQuantity.setAttribute("min", "1");
//   inputQuantity.setAttribute("max", "100");
//   inputQuantity.setAttribute("name", "itemQuantity");

//   // Creation de l'élément <div>
//   let itemDeleteSettingsDiv = document.createElement("div");
//   itemContentSetting.appendChild(itemDeleteSettingsDiv);
//   itemDeleteSettingsDiv.className = "cart__item__content__settings__delete";

//   // Creation de la balise <p> supprimer
//   let supprimProduct = document.createElement("p");
//   itemDeleteSettingsDiv.appendChild(supprimProduct);
//   supprimProduct.className = "deleteItem";
//   supprimProduct.innerHTML = "Supprimer";
//   supprimProduct.addEventListener("click", () =>
//     deleteItem(produitLocalStorage)
//   );
// }
