let basket = JSON.parse(localStorage.getItem("data"));
if (basket == null) {
  basket = [];
}

const _id = new URLSearchParams(window.location.search);
let api = "http://localhost:3000/api/products/" + _id.get("id");
console.log(api); // test pour voir si on a la bonne URL de l'API

//déclaration class products
class products {
  constructor(colors, _id, name, price, imageUrl, description, altTxt) {
    this.colors = colors;
    this._id = _id;
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this.altTxt = altTxt;
  }
}

// génération du produit
fetch(api) // promise API
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (value) {
    // Création d'un objet product, définition des variables titre,prix, desc ...
    let produit = new products(
      value.colors,
      value._id,
      value.name,
      value.price,
      value.imageUrl,
      value.description,
      value.altTxt
    );

    const title = document.getElementById("title");
    const price = document.getElementById("price");
    const description = document.getElementById("description");
    const colors = document.getElementById("colors");
    const itemImage = document.getElementsByClassName("item__img")[0];

    //génération de la fiche produit
    let generateProd = (produit) => {
      let image = document.createElement("img");
      image.src = produit.imageUrl; // attri src
      image.alt = produit.altTxt; // artric alt
      itemImage.appendChild(image);
      title.innerText = produit.name; //  met le nom
      price.innerText = produit.price; // met le prix
      description.innerText = produit.description; // met la description
      //boucle pour le tableau colors
      for (let i = 0; i < produit.colors.length; i++) {
        let option = document.createElement("option");
        option.innerText = produit.colors[i];
        option.value = produit.colors[i];
        colors.appendChild(option);
      }
    };

    let addToCart = () => {
      // on ajoute au panier l'objet..
      const quantity = document.getElementById("quantity");
      var qty;
      if (colors.selectedIndex != 0 && quantity.value != 0 && quantity.value > 0 && quantity.value <= 100) {
        // Vérification couleur et quantitées
        for (let i = 0; i < basket.length; i++) {
          if (value._id == basket[i].id && colors.value == basket[i].colors) {
            alert("PRODUIT SIMILAIRE");
            console.log(i);
            qty = +basket[i].quantity + +quantity.value;
            console.log(basket[i].quantity);
            console.log(quantity.value);
            console.log(qty);
            basket[i].quantity = qty;
          }
        }
        if (qty == null || qty <= 0) {
          alert("PAS DE PRODUIT SIMILAIRE DANS LA PANIER");
          basket.push({
            id: value._id,
            name: value.name,
            colors: colors.value,
            quantity: quantity.value,
          });
        }
        localStorage.setItem("data", JSON.stringify(basket));
        alert("Produits ajouté(s) au panier !");
      } else {
        alert("Vérifier la couleur ou la quantité du produit !");
      }
    };
    generateProd(produit);
    let btn = document.getElementById("addToCart");
    btn.addEventListener("click", (event) => {
      // quand on clique sur le bouton
      addToCart();
    });
  })
  .catch(function (err) {
    //si erreur
    console.log("ERREUR");
  });
