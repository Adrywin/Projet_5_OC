//génération de la page "token"
document.getElementById("orderId").innerText = new URLSearchParams(
  window.location.search
).get("commande");