//Récuperation du lien de la barre URL
let url = new URL(window.location.href);
//Récuperation de orderId avec searchParams.get
let orderId = url.searchParams.get("orderId");

// j'intègre l'orederId dans le DOM
let insertOrderId = document.getElementById("orderId");
insertOrderId.innerHTML = orderId;

// delete du localStorage
function deleteLocalStorage() {
  const cache = window.localStorage;
  cache.clear();
}
deleteLocalStorage();
