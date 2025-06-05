// 1. Sélectionne l'élément gallery dans le DOM
const gallery = document.querySelector(".gallery");

// 2. Fonction pour récupérer les travaux depuis l'API
async function fetchWorks() {
  try {
    // Envoie une requête GET à l'API pour récupérer les œuvres
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json(); // Convertit la réponse en JSON

    // 3. Pour chaque œuvre reçue, crée dynamiquement une balise <figure>
    works.forEach(work => {
      const figure = document.createElement("figure");

      // Ajoute des classes pour permettre le filtrage par catégorie
      figure.classList.add("work-item", `category-id-${work.categoryId}`);
      
      // Crée l'image de l'œuvre
      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      // Crée la légende (titre) de l'œuvre
      const caption = document.createElement("figcaption");
      caption.innerText = work.title;

      // Ajoute l'image et la légende à la figure
      figure.appendChild(img);
      figure.appendChild(caption);

      // Ajoute la figure complète à la galerie
      gallery.appendChild(figure);
    });

  } catch (error) {
    // Gère les erreurs en cas d'échec de la requête
    console.error("Erreur lors du chargement des travaux :", error);
  }
}

// 4. Appelle la fonction pour afficher les travaux dès le chargement
fetchWorks();

// ----------- Partie filtres par catégories -----------

// Envoie une requête GET pour récupérer toutes les catégories
fetch("http://localhost:5678/api/categories")
  .then(function(response) {
    if(response.ok) {
      return response.json(); // Convertit la réponse en JSON si OK
    }
  })
  .then(function(data) {
    let categories = data;

    // Ajoute une catégorie spéciale "Tous" avec id 0 au début du tableau
    categories.unshift({id: 0, name: 'Tous'});

    // Pour chaque catégorie, crée un bouton de filtre
    categories.forEach((category) => {
      let myButton = document.createElement('button');
      myButton.classList.add('work-filter', 'filters-design');

      // Active par défaut le bouton "Tous"
      if(category.id === 0) myButton.classList.add('filter-active', 'filter-all');

      // Ajoute un attribut personnalisé pour stocker l'id de la catégorie
      myButton.setAttribute('data-filter', category.id);
      myButton.textContent = category.name;

      // Ajoute le bouton dans la div contenant les filtres
      document.querySelector("div.filters").appendChild(myButton);

      // Ajoute un événement au clic sur le bouton
      myButton.addEventListener('click', function(event) {
        event.preventDefault();

        // Supprime la classe active de tous les boutons
        document.querySelectorAll('.work-filter').forEach((workFilter) => {
          workFilter.classList.remove('filter-active');
        });

        // Ajoute la classe active uniquement sur le bouton cliqué
        event.target.classList.add('filter-active');

        // Récupère l'ID de la catégorie sélectionnée
        let categoryId = myButton.getAttribute('data-filter');

        // Parcourt tous les éléments de la galerie pour les filtrer
        document.querySelectorAll('.work-item').forEach(workItem => {
          if (categoryId === "0") {
            // Si "Tous" est sélectionné, tout afficher
            workItem.style.display = 'block';
          } else {
            // Sinon, n'afficher que ceux correspondant à la catégorie
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
    // Gère les erreurs de récupération des catégories
    console.log("Erreur lors du chargement des catégories :", err);
  });
