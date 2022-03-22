//-------------------------------------------fetch-------------------------------------------/
// récuperation des donéees de l'API
const fetchData = () => {
  fetch("http://localhost:3000/api/products") // on va chercher l'API avec fetch
    .then((response) => {
      //réponse de l'API
      if (response.ok) {
        return response.json();
      }
    })
    .then((responseJson) => {
      data = responseJson; // Une promesse en renvoyant la réponse au format JSON
      // console.log(responseJson); // console log resJSON
      // Boucle des produits "data = responseJSON"
      for (product of data) {
        // Affichage de la fonction 'displayProductByInsert'
        displayProductByInsert(product);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//------------------------------------- insert HTML -------------------------------------------/
function displayProductByInsert(product) {
  const items = document.getElementById("items");
  items.insertAdjacentHTML(
    "beforeend", //'beforeend' : Juste à l'intérieur de l'element , après son dernier enfant.
    `<a href="./product.html?id=${product._id}">
      <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
      </article>
    </a>`
  );
}
fetchData();
