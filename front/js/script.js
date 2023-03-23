let api = "http://localhost:3000/api/products";

fetch(api)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (value) {
    let produits = [];

    for (let i = 0; i < value.length; i++) {
      produits.push(value[i]);
      console.table(produits[i]);
    }
    //fonction de génération de produits sur notre page
    let items = document.getElementById("items");
    for (let i = 0; i < produits.length; i++) {
      let a = document.createElement("a");
      a.href = "./product.html?id=" + produits[i]._id;
    
      let article = document.createElement("article");
      
      let img = document.createElement("img");
      img.src = produits[i].imageUrl;
      img.alt = produits[i].altTxt;
      article.appendChild(img);
    
      let h3 = document.createElement("h3");
      h3.className = "productName";
      h3.innerText = "Kanap " + produits[i].name;
      article.appendChild(h3);
    
      let p = document.createElement("p");
      p.className = "productDescription";
      p.innerText = produits[i].description;
      article.appendChild(p);
    
      a.appendChild(article);
      items.appendChild(a);
    }
  })
  .catch(function (err) {
    console.log(err);
  });

