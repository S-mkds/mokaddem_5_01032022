//--------------------------------URLSearchParams---------------------
const queryString = window.location.search;
let productId = new URL(window.location.href).searchParams.get("id"); // on récupére l'id avec les paramétres de l'url
// console.log({ productId }); // console log

fetch(`http://localhost:3000/api/products/${productId}`) // L'appel de fetch avec URL search param permet de placer l'ID
  .then((response) => response.json())
  .then((res) => showData(res));

//-----------Récuperation des produits des détails de l'api et affichage des élements--------------
// Création des  éléments
function showData(objectData) {
  const colors = objectData.colors;
  const description = objectData.description;
  const imageUrl = objectData.imageUrl;
  const altTxt = objectData.altTxt;
  const name = objectData.name;
  const price = objectData.price;

  showImg(imageUrl, altTxt);
  showTitle(name);
  showPrice(price);
  showDescription(description);
  showColors(colors);
}

// Fonction pour afficher les éléments dans le HTML
function showImg(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector(".item__img");
  parent.appendChild(image);
}

// Affichage du nom du produit
function showTitle(name) {
  const h1Title = document.querySelector("#title");
  h1Title.textContent = name;
}

// Affichage du prix du produit
function showPrice(price) {
  const spanPrice = document.querySelector("#price");
  spanPrice.textContent = price;
}

// Affichage de la description du produit
function showDescription(description) {
  const txtDescription = document.querySelector("#description");
  txtDescription.textContent = description;
}

// Affichage des couleurs
function showColors(colors) {
  const optColors = document.querySelector("#colors");
  if (optColors != null) {
    colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      optColors.appendChild(option);
    });
  }
}

//----------------evenement au click, mettre les élements dans le localStorage------------------
const btn = document.querySelector("#addToCart");
if (btn != null) {
  btn.addEventListener("click", () => {
    const color = document.querySelector("#colors").value;
    const quantity = document.querySelector("#quantity").value;
    const price = document.querySelector("#price").innerHTML;
    const name = document.querySelector("#title").innerHTML;
    const imageUrl = document.querySelector(".item__img").innerHTML;
    const description = document.querySelector("#description").innerHTML;
    const id = productId;
    // Constante Storage qui récupere les valeurs
    const storage = {
      productId: id,
      color: color,
      quantity: Number(quantity),
      price: Number(price),
      name: name,
      imageUrl: imageUrl,
      description: description,
      //basketId: Math.floor(Math.random() * 100000),
    }; // Stockage de ces élements dans le local storage

    // Annonce message d'erreur si:
    if (
      color == null ||
      color === "" ||
      quantity == null ||
      quantity == "" ||
      quantity == 0 ||
      quantity >= 101 ||
      quantity <= 0
    ) {
      alert(
        "Veuillez choisir une couleur et le nombre de produit que vous voulez entre 1 et 100"
      );
      location.reload();
      return;
    }
    //Initialisation du local storage
    let produitLocalStorage = JSON.parse(localStorage.getItem("storage"));

    //si le panier est  vide
    if (!produitLocalStorage) {
      // si panier vide on l'initialise
      produitLocalStorage = [];
      produitLocalStorage.push(storage);
      localStorage.setItem("storage", JSON.stringify(produitLocalStorage));
      window.location.href = "cart.html";
    }

    //sinon
    else {
      let alreadyExistInBasket = false;
      for (let i = 0; i < produitLocalStorage.length; i++) {
        //je verifie si l'objet en question existe deja dans le panier
        if (
          produitLocalStorage[i].color == storage.color &&
          produitLocalStorage[i].productId == storage.productId
        ) {
          alreadyExistInBasket = true;
          alert(
            "Vous avez ajouté (" +
              storage.quantity +
              ") à vos (" +
              produitLocalStorage[i].quantity +
              ") canapés déjà dans votre panier."
          );
          produitLocalStorage[i].quantity += storage.quantity;

          localStorage.setItem("storage", JSON.stringify(produitLocalStorage));
          window.location.href = "cart.html";
        }
      }
      if (alreadyExistInBasket == false) {
        produitLocalStorage.push(storage);
        localStorage.setItem("storage", JSON.stringify(produitLocalStorage));
        alert("Un article est ajoutée au panier");
        window.location.href = "cart.html";
      }
    }
  });
}
