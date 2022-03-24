// Récupération de l'orderId
const searchParams = new URL(document.location).searchParams;
const orderId = params.get("orderId");

// Affichage du numéro order dans son élement
document.getElementById("orderId").textContent = orderId;

// Suppression du localStorage
function deleteLocalStorage() {
  const cache = window.localStorage;
  cache.clear();
}
deleteLocalStorage();
