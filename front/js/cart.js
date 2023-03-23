// initialisation du panier
let basket = JSON.parse(localStorage.getItem("data"));

//Changement Qty
let changeQty = (basket) => {
  //changement de qty du produit dans le panier (+ ou -)
  let cart = document.querySelectorAll(".cart__item");
  let itemQty = document.getElementsByName("itemQuantity");

  for (let i = 0; i < cart.length; i++) {
    itemQty[i].addEventListener("change", (event) => {
      let qty = basket.findIndex((item) => item.id === cart[i].dataset.id);
      if (itemQty[i].value > 0 && itemQty[i].value <= 100) {
        basket[qty].quantity = itemQty[i].value;
        localStorage.setItem("data", JSON.stringify(basket));
        location.reload();
      }
      else {
        itemQty[i].value = basket[qty].quantity;
        alert("Valeur comprise entre 1 et 100 seulement");
        location.reload();
      }
    });
  }
};

//Suppression des produits
let removeItem = (basket) => {
  //on supprime un objet du localStorage
  let cart = document.querySelectorAll(".cart__item");
  let deleteItem = document.getElementsByClassName("deleteItem");

  for (let i = 0; i < cart.length; i++) {
    deleteItem[i].addEventListener("click", () => {
      let indexId = basket.findIndex((item) => item.id === cart[i].dataset.id && item.colors === cart[i].dataset.color);
      if (basket[indexId]) {
        basket.splice(indexId, 1);
      }
      localStorage.setItem("data", JSON.stringify(basket));
      location.reload();
    });
  }
};

//génération des produits
let generateCart = (basket) => {
  for (let i = 0; i < basket.length; i++) {
    let api = "http://localhost:3000/api/products/" + basket[i].id;
    fetch(api)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (produit) {
        let cartItems = document.getElementById("cart__items");

        // Insertion d'un élément "article"
        let article = document.createElement("article");
        cartItems.appendChild(article);
        article.className = "cart__item";
        article.setAttribute("data-id", basket[i].id);
        article.setAttribute("data-color", basket[i].colors);

        // Insertion d'un élément "div"
        //<div class="cart__item__img"></div>
        let divImg = document.createElement("div");
        article.appendChild(divImg);
        divImg.className = "cart__item__img";

        // Insertion d'un élément "img"
        //<img src="${produit.imageUrl}" alt="Photographie d'un canapé">
        let img = document.createElement("img");
        divImg.appendChild(img);
        img.setAttribute("src", produit.imageUrl);
        img.setAttribute("alt", "Photographie d'un canapé");

        // Insertion d'un élément "div"
        //<div class="cart__item__content"></div>
        let divContent = document.createElement("div");
        article.appendChild(divContent);
        divContent.className = "cart__item__content";

        // Insertion d'un élément "div"
        // <div class="cart__item__content__description"></div>
        let divContentDescription = document.createElement("div");
        divContent.appendChild(divContentDescription);
        divContentDescription.className = "cart__item__content__description";

        // Insertion d'un élément "h2"
        // <h2>${produit.name}</h2>
        let titre = document.createElement("h2");
        divContentDescription.appendChild(titre);
        titre.textContent = produit.name;

        // Insertion d'un élément "p"
        // <p>${basket[i].colors}</p>
        let pColor = document.createElement("p");
        divContentDescription.appendChild(pColor);
        pColor.textContent = basket[i].colors;

        // Insertion d'un élément "p"
        //${produit.price}€
        let pPrice = document.createElement("p");
        divContentDescription.appendChild(pPrice);
        pPrice.textContent = produit.price + "€";

        // Insertion d'un élément "div"
        // <div class="cart__item__content__settings">
        let divContentSettings = document.createElement("div");
        divContent.appendChild(divContentSettings);
        divContentSettings.className = "cart__item__content__settings";

        // Insertion d'un élément "div"
        // <div class="cart__item__content__settings__quantity">
        let divContentSettingsQuantity = document.createElement("div");
        divContentSettings.appendChild(divContentSettingsQuantity);
        divContentSettingsQuantity.className =
          "cart__item__content__settings__quantity";

        // Insertion d'un élément "p"
        // <p>Qté : </p>
        let pQty = document.createElement("p");
        divContentSettingsQuantity.appendChild(pQty);
        pQty.innerText = "Qté : " + basket[i].quantity;

        // Insertion d'un élément "input"
        // <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basket[i].quantity}">
        let inputNumber = document.createElement("input");
        divContentSettingsQuantity.appendChild(inputNumber);
        inputNumber.setAttribute("type", "number");
        inputNumber.className = "itemQuantity";
        inputNumber.setAttribute("name", "itemQuantity");
        inputNumber.setAttribute("min", "1");
        inputNumber.setAttribute("max", "100");
        inputNumber.setAttribute("value", basket[i].quantity);

        // Insertion d'un élément "div"
        // <div class="cart__item__content__settings__delete">
        let divContentSettingsDelete = document.createElement("div");
        divContentSettings.appendChild(divContentSettingsDelete);
        divContentSettingsDelete.className =
          "cart__item__content__settings__delete";

        // Insertion d'un élément "p"
        // <p class="deleteItem">Supprimer</p>
        let pDelete = document.createElement("p");
        divContentSettingsDelete.appendChild(pDelete);
        pDelete.className = "deleteItem";
        pDelete.innerText = "Supprimer";

        removeItem(basket);
        changeQty(basket);
      })
      .catch(function (err) {
        console.log("ERREUR API");
      });
  }
};
generateCart(basket);

//génération du totalPrix
let generateTotalPrix = async (basket) => {
  let totalPrice = document.getElementById("totalPrice");
  let tPrix = 0;
  for (let i = 0; i < basket.length; i++) {
    let api = "http://localhost:3000/api/products/" + basket[i].id;
    try {
      let response = await fetch(api);
      if (response.ok) {
        let produit = await response.json();
        tPrix += +basket[i].quantity * +produit.price;
      }
    } catch (error) {
      alert(error);
    }
  }
  return (totalPrice.innerText = tPrix);
};
generateTotalPrix(basket);

//génération du totalQuantity
let generateTotalQuantity = (basket) => {
  let totalQuantity = document.getElementById("totalQuantity");
  let tQty = 0;
  for (let i = 0; i < basket.length; i++) {
    tQty += +basket[i].quantity;
  }
  totalQuantity.innerText = tQty;
};
generateTotalQuantity(basket);

//formulaire
let formulaire = (basket) => {
  let produits = [];
  for (let i = 0; i < basket.length; i++) {
    produits.push(basket[i].id);
  }

  let commande = {
    contact: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      email: "",
    },
    products: produits,
  };

  commande.contact.firstName = firstName.value;
  commande.contact.lastName = lastName.value;
  commande.contact.address = address.value;
  commande.contact.city = city.value;
  commande.contact.email = email.value;

  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commande),
  })
    .then((response) => response.json())
    .then(
      (data) =>
        (window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`)
    )
    .catch((error) => console.error(error));
};

// vérifier le inputs
let validateInputs = () => {
  let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  let addressErrorMsg = document.getElementById("addressErrorMsg");
  let cityErrorMsg = document.getElementById("cityErrorMsg");
  let emailErrorMsg = document.getElementById("emailErrorMsg");

  var reChar = /^[a-zA-Z]+$/;
  var reAdress = /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/;
  var reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let Valid = true;
  //validation firstname
  if (!reChar.test(firstName.value)) {
    firstNameErrorMsg.innerText = "Veuillez modifier ce champ.";
    Valid = false;
  }
  else {
    firstNameErrorMsg.innerText = "";
  }
  //validation lastname
  if (!reChar.test(lastName.value)) {
    lastNameErrorMsg.innerText = "Veuillez modifier ce champ.";
    Valid = false;
  }
  else {
    lastNameErrorMsg.innerText = "";
  }
  //validation address
  if (!reAdress.test(address.value)) {
    addressErrorMsg.innerText = "Veuillez modifier ce champ.";
    Valid = false;
  }
  else {
    addressErrorMsg.innerText = "";
  }
  //validation city
  if (!reChar.test(city.value)) {
    cityErrorMsg.innerText = "Veuillez modifier ce champ.";
    Valid = false;
  }
  else {
    cityErrorMsg.innerText = "";
  }
  //validation email
  if (!reEmail.test(email.value)) {
    emailErrorMsg.innerText = "Veuillez modifier ce champ.";
    Valid = false;
  }
  else {
    emailErrorMsg.innerText = "";
  }
  return Valid;

};
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // Validation des entrées
  if (!validateInputs()) {
    // Affichage d'un message d'erreur
    alert("Les entrées ne sont pas valides. Veuillez vérifier les champs.");
  } else {
    
    if(!basket.length) {
      alert("Panier vide ! Veuillez ajouter au panier des produits !");
      return;
    }
    // Soumission du formulaire
    formulaire(basket);
  }
});
