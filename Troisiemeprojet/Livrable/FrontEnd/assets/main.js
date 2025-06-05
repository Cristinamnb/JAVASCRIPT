const gallery = document.querySelector(".gallery");                        // Sélectionne l'élément gallery dans le DOM

async function fetchWorks() {                                              // Fonction pour récupérer les travaux depuis l'API
  try {                                                                    // Envoie une requête GET à l'API pour récupérer les œuvres
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();                                   // Convertit la réponse en JSON
    works.forEach(work => {                                                // Pour chaque œuvre reçue, crée dynamiquement une balise <figure>
      const figure = document.createElement("figure");
      figure.classList.add("work-item", `category-id-${work.categoryId}`); // Ajoute des classes pour permettre le filtrage par catégorie
      const img = document.createElement("img");                           // Crée l'image de l'œuvre
      img.src = work.imageUrl;
      img.alt = work.title;
      const caption = document.createElement("figcaption");                // Crée la légende (titre) de l'œuvre
      caption.innerText = work.title;
      figure.appendChild(img);                                             // Ajoute l'image et la légende à la figure
      figure.appendChild(caption);
      gallery.appendChild(figure);                                         // Ajoute la figure complète à la galerie
    });

  } catch (error) {                                                        // Gère les erreurs en cas d'échec de la requête
    console.error("Erreur lors du chargement des travaux :", error);
  }
}
fetchWorks();                                                              // Appelle la fonction pour afficher les travaux dès le chargement


// ----------- Partie filtres par catégories ----------- //

// Fonction asynchrone pour récupérer les catégories et générer les boutons de filtre
async function fetchAndDisplayCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");                           // Appel de l'API pour récupérer les catégories
    if (!response.ok) throw new Error("Erreur de réponse de l'API");                                // Si la réponse n'est pas valide (ex: erreur 404 ou 500), on lance une exception
    const categories = await response.json();                                                       // Conversion de la réponse en objet JavaScript (tableau de catégories)
    categories.unshift({ id: 0, name: 'Tous' });                                                    // Ajout d'une catégorie spéciale "Tous" en première position du tableau
    const filtersContainer = document.querySelector("div.filters");                                 // Sélection de l'élément HTML qui contiendra les boutons de filtre
    categories.forEach(category => {                                                                // Pour chaque catégorie, création d'un bouton de filtre
      const button = document.createElement('button');                                              // Création d’un élément <button>
      button.classList.add('work-filter', 'filters-design');                                        // Ajout des classes CSS pour le style
      if (category.id === 0) {                                                                      // Si la catégorie est "Tous" (id === 0), on l'active par défaut
        button.classList.add('filter-active', 'filter-all');                                        // Active "Tous" par défaut
      }
      button.setAttribute('data-filter', category.id);                                              // Ajout d'un attribut personnalisé contenant l’id de la catégorie
      button.textContent = category.name;                                                           // Définition du texte visible sur le bouton
      filtersContainer.appendChild(button);                                                         // Insertion du bouton dans le conteneur HTML
      button.addEventListener('click', (event) => {                                                 // Ajout d’un gestionnaire d’événement au clic sur le bouton
        event.preventDefault();                                                                     // Empêche le comportement par défaut du clic
        document.querySelectorAll('.work-filter').forEach(filterBtn => {                            // Désactive visuellement tous les boutons de filtre
          filterBtn.classList.remove('filter-active');
        });
      button.classList.add('filter-active');                                                        // Active uniquement le bouton qui vient d’être cliqué
      const categoryId = button.getAttribute('data-filter');                                        // Récupère l’id de la catégorie sélectionnée à partir de l'attribut
      document.querySelectorAll('.work-item').forEach(workItem => {                                 // Parcourt tous les éléments d’œuvres dans la galerie
          if (categoryId === "0" || workItem.classList.contains(`category-id-${categoryId}`)) {     // Affiche ou masque chaque œuvre selon la catégorie sélectionnée
            workItem.style.display = 'block';                                                       // Affiche l’œuvre
          } else {
            workItem.style.display = 'none';                                                        // Masque l’œuvre
          }
        });
      });
    });

  } catch (error) {                                                                                 // En cas d’erreur (réseau, parsing, etc.), affiche un message dans la console
    console.error("Erreur lors du chargement des catégories :", error);
  }
}
fetchAndDisplayCategories();                                                                        // Appel de la fonction pour lancer la récupération et l’affichage des filtres

document.addEventListener('DOMContentLoaded', async function() {                                    // Quand tout le DOM est chargé, on exécute cette fonction asynchrone
  if(localStorage.getItem('token') != null && localStorage.getItem('userId') != null) {             // Vérifie si un token et un userId sont stockés dans localStorage (utilisateur connecté)
    document.querySelector('body').classList.add('connected');                                      // Ajoute la classe 'connected' au body pour modifier l’apparence en mode admin
    let topBar = document.getElementById('top-bar');                                                // Sélectionne la barre du haut (top bar)
    topBar.style.display = "flex";                                                                  // Affiche la barre du haut (mode flex)
    let filters = document.getElementById('all-filters');                                           // Sélectionne la div contenant tous les filtres
    filters.style.display = "none";                                                                 // Cache la div des filtres (mode admin, pas visible)
    let space = document.getElementById('space-only-admin');                                        // Sélectionne l’espace réservé uniquement à l’admin
    space.style.paddingBottom = "100px";                                                            // Ajoute un padding en bas pour laisser de la place (100px)
    let introduction = document.getElementById('space-introduction-in-mode-admin');                 // Sélectionne l’introduction spécifique au mode admin
    introduction.style.marginTop = "-50px";                                                         // Remonte l’introduction vers le haut (-50px de margin-top)
  }
  document.getElementById('nav-logout').addEventListener('click', async function(event) {           // Ajoute un écouteur d'événement sur le bouton déconnexion
    event.preventDefault();                                                                         // Empêche le comportement par défaut du clic (ex: navigation)
    localStorage.removeItem('userId');                                                              // Supprime userId du localStorage pour déconnecter l’utilisateur
    localStorage.removeItem('token');                                                               // Supprime le token du localStorage pour déconnecter l’utilisateur
    document.querySelector('body').classList.remove(`connected`);                                   // Retire la classe 'connected' du body (retour à l’affichage non admin)
    let topBar = document.getElementById('top-bar');                                                // Sélectionne la barre du haut (top bar)
    topBar.style.display = "none";                                                                  // Cache la barre du haut (mode non connecté)
    let filters = document.getElementById('all-filters');                                           // Sélectionne la div des filtres
    filters.style.display = "flex";                                                                 // Affiche la div des filtres en mode non admin (flex)
    let space = document.getElementById('space-only-admin');                                        // Sélectionne l’espace réservé à l’admin
    space.style.paddingBottom = "0";                                                                // Remet le padding bottom à 0
  });
});

