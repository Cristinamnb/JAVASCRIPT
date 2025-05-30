// 1. Sélectionne l'élément gallery dans le DOM
const gallery = document.querySelector(".gallery");

// 2. Fonction pour récupérer les travaux depuis l'API
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();

    // 3. Pour chaque work, crée et insère un élément <figure>
    works.forEach(work => {
      const figure = document.createElement("figure");

      // Ajoute les classes nécessaires pour le filtrage
      figure.classList.add("work-item", `category-id-${work.categoryId}`);
      
      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const caption = document.createElement("figcaption");
      caption.innerText = work.title;

      figure.appendChild(img);
      figure.appendChild(caption);

      gallery.appendChild(figure);
    });

  } catch (error) {
    console.error("Erreur lors du chargement des travaux :", error);
  }
}

// 4. Appelle la fonction pour afficher les travaux
fetchWorks();

// Ajout de filtres de catégories pour filtrer les œuvres dans la galerie
fetch("http://localhost:5678/api/categories")
  .then(function(response) {
    if(response.ok) {
      return response.json();
    }
  })
  .then(function(data) {
    let categories = data;
    categories.unshift({id: 0, name: 'Tous'}); // Ajoute l'option "Tous" au début

    categories.forEach((category) => {
      // Création d'un bouton
      let myButton = document.createElement('button');
      myButton.classList.add('work-filter', 'filters-design');
      if(category.id === 0) myButton.classList.add('filter-active', 'filter-all');
      myButton.setAttribute('data-filter', category.id);
      myButton.textContent = category.name;

      // Ajout du bouton dans la div.filters
      document.querySelector("div.filters").appendChild(myButton);

      // Événement de clic sur le bouton
      myButton.addEventListener('click', function(event) {
        event.preventDefault();

        // Mise à jour des classes actives
        document.querySelectorAll('.work-filter').forEach((workFilter) => {
          workFilter.classList.remove('filter-active');
        });
        event.target.classList.add('filter-active');

        // Récupération de la catégorie cliquée
        let categoryId = myButton.getAttribute('data-filter');

        // Filtrage des éléments
        document.querySelectorAll('.work-item').forEach(workItem => {
          if (categoryId === "0") {
            // Affiche tout
            workItem.style.display = 'block';
          } else {
            // Affiche uniquement ceux de la bonne catégorie
            if (workItem.classList.contains(`category-id-${categoryId}`)) {
              workItem.style.display = 'block';
            } else {
              workItem.style.display = 'none';
            }
          }
        });
      });
    });
  })
  .catch(function(err) {
    console.log("Erreur lors du chargement des catégories :", err);
  });
