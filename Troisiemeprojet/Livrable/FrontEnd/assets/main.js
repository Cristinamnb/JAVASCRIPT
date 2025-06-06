// ----------- Récupération des oeuvres et des catégories ----------- //

const gallery = document.querySelector(".gallery");                                                 // Sélectionne l'élément gallery dans le DOM

async function fetchWorks() {                                                                       // Fonction pour récupérer les travaux depuis l'API
  try {                                                                                             // Envoie une requête GET à l'API pour récupérer les œuvres
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();                                                            // Convertit la réponse en JSON
    works.forEach(work => {                                                                         // Pour chaque œuvre reçue, crée dynamiquement une balise <figure>
      const figure = document.createElement("figure");
      figure.classList.add("work-item", `category-id-${work.categoryId}`);                          // Ajoute des classes pour permettre le filtrage par catégorie
      const img = document.createElement("img");                                                    // Crée l'image de l'œuvre
      img.src = work.imageUrl;
      img.alt = work.title;
      const caption = document.createElement("figcaption");                                         // Crée la légende (titre) de l'œuvre
      caption.innerText = work.title;
      figure.appendChild(img);                                                                      // Ajoute l'image et la légende à la figure
      figure.appendChild(caption);
      gallery.appendChild(figure);                                                                  // Ajoute la figure complète à la galerie
    });

  } catch (error) {                                                                                 // Gère les erreurs en cas d'échec de la requête
    console.error("Erreur lors du chargement des travaux :", error);
  }
}
fetchWorks();                                                                                       // Appelle la fonction pour afficher les travaux dès le chargement


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

// ----------- Partie connexion/déconnexion ----------- //
// Gestion du TOKEN
document.addEventListener('DOMContentLoaded', function() {                                          // Quand tout le DOM est chargé, on exécute cette fonction
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

  // Click sur déconnection pour se déconnecter
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

// ----------- Partie des modales ----------- //
// Fonction asynchrone pour charger les œuvres dans la modale admin
// Déclaration d'une fonction asynchrone pour charger les œuvres dans la modale
async function loadWorksIntoModal() {
	try {
		const response = await fetch("http://localhost:5678/api/works");                            // Envoie une requête GET à l'API pour récupérer les œuvres
		if (!response.ok) throw new Error("Erreur lors du chargement des œuvres.");                 // Vérifie si la réponse n’est pas correcte, et lève une erreur personnalisée si c’est le cas
		const works = await response.json();                                                        // Convertit la réponse JSON en tableau d’objets (chaque œuvre)

        // Suppression des anciennes œuvres
		document.querySelector('#modal-works.modal-gallery .modal-content').innerText = '';         // Supprime le contenu actuel de la modale pour éviter les doublons
		works.forEach(work => {                                                                     // Parcourt toutes les œuvres récupérées
			const figure = document.createElement('figure');                                        // Crée un élément <figure> pour représenter visuellement l’œuvre
			figure.className = `work-item category-id-0 category-id-${work.categoryId}`;            // Ajoute des classes pour catégoriser l’œuvre par son ID de catégorie
			figure.id = `work-item-popup-${work.id}`;                                               // Attribue un ID unique à l’élément figure (spécifique à la modale popup)
			const img = document.createElement('img');                                              // Crée un élément <img> pour afficher l’image de l’œuvre
			img.src = work.imageUrl;                                                                // Définit l’URL de l’image de l’œuvre
			img.alt = work.title;                                                                   // Définit le texte alternatif de l’image (important pour l’accessibilité)
			figure.appendChild(img);                                                                // Ajoute l’image à l’intérieur du bloc figure
			const caption = document.createElement('figcaption');                                   // Crée un élément <figcaption> pour ajouter la légende "éditer"
			caption.textContent = 'éditer';                                                         // Définit le texte du figcaption
			figure.appendChild(caption);                                                            // Ajoute le figcaption au bloc figure
			const dragIcon = document.createElement('i');                                           // Crée une icône de déplacement (utilisable pour un éventuel drag & drop)
			dragIcon.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'cross');            // Ajoute les classes Font Awesome pour l'icône de déplacement
			figure.appendChild(dragIcon);                                                           // Ajoute l'icône de déplacement au bloc figure
			const trashIcon = document.createElement('i');                                          // Crée une icône de corbeille pour supprimer l’œuvre
			trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash');                           // Ajoute les classes Font Awesome pour l’icône de suppression
			figure.appendChild(trashIcon);                                                          // Ajoute l’icône de suppression au bloc figure


			// Suppression d'une œuvre
            trashIcon.addEventListener('click', async function (event) {                            // Ajoute un écouteur d'événement "click" sur l’icône de corbeille
                event.preventDefault();                                                             // Empêche le comportement par défaut du lien ou bouton (au cas où)
                if (confirm("Voulez-vous supprimer cet élément ?")) {                               // Demande confirmation à l’utilisateur avant de supprimer
                    try {                                                                           
                        const deleteResponse = await fetch(`http://localhost:5678/api/works/${work.id}`, { // Envoie une requête DELETE à l’API pour supprimer l’œuvre
                            method: 'DELETE',                                                       // Méthode HTTP pour la suppression
                            headers: {
                                'Content-Type': 'application/json',                                 // Indique que le corps de la requête est au format JSON
                                'Authorization': 'Bearer ' + localStorage.getItem('token')          // Envoie le token d’authentification stocké localement pour valider les droits d’accès
                            }
                        });

                        switch (deleteResponse.status) {                                            // Analyse la réponse en fonction du code HTTP retourné
                            case 500:                                                               // Erreurs serveur (interne ou indisponibilité)
                            case 503:
                                alert("Comportement inattendu!");
                                break;

                            case 401:                                                               // Erreur d’authentification (token invalide ou inexistant)
                                alert("Suppression impossible!");
                                break;

                            case 200:                                                               
                            case 204:
                                console.log("Projet supprimé.");                                    // Succès : suppression confirmée
                                document.getElementById(`work-item-${work.id}`)?.remove();          // Supprime l’œuvre de la galerie principale (si présente)
                                document.getElementById(`work-item-popup-${work.id}`)?.remove();    // Supprime l’œuvre de la modale (si présente)
                                break;

                            default:
                                alert("Erreur inconnue!");                                          // Si aucun des cas prévus ne s’applique
                        }
                    } catch (err) {
                        console.error("Erreur lors de la suppression :", err);                      // Gère toute autre erreur inattendue pendant la requête
                    }
                }
            });

			document.querySelector("div.modal-content").appendChild(figure);                        // Ajoute le bloc <figure> (contenant l’image, les icônes et la légende) à l'intérieur de la galerie de la modale

			// Affichage de la modale
			document.getElementById('modal').style.display = "flex";                                // Affiche la modale principale en la rendant visible en mode "flex"
			document.getElementById('modal-works').style.display = "block";                         // Affiche la section des œuvres à l’intérieur de la modale
		});                                                                                         // Fin de la boucle forEach – toutes les œuvres sont maintenant affichées dans la modale
	} catch (error) {
		console.error("Erreur lors de la récupération des œuvres :", error);                        // Gère les erreurs survenues pendant la récupération ou l'affichage des œuvres
	}
}

// Écouteur pour le bouton "modifier"
document.getElementById('update-works').addEventListener('click', function (event) {                // Ajoute un écouteur d'événement au clic sur le bouton avec l'ID "update-works"
	event.preventDefault();	                                                                        // Empêche le comportement par défaut du bouton (ex. : soumission d'un formulaire ou navigation)
	loadWorksIntoModal(); 	                                                                        // Appelle la fonction qui charge et affiche dynamiquement les œuvres dans la modale
});

// Fermeture des modales
document.querySelectorAll('#modal-works').forEach(modalWorks => {                                   // Sélectionne tous les éléments avec l'ID 'modal-works' (théoriquement unique) et boucle dessus
	modalWorks.addEventListener('click', event => event.stopPropagation());                         // Empêche la propagation du clic à l'extérieur de la modale pour éviter une fermeture accidentelle

	document.querySelectorAll('#modal-edit').forEach(modalEdit => {                                	// Sélectionne tous les éléments avec l'ID 'modal-edit' (également supposé unique) et boucle dessus
		modalEdit.addEventListener('click', event => event.stopPropagation()); 		                // Empêche la propagation du clic dans la deuxième modale (édition) pour éviter sa fermeture

		document.getElementById('modal').addEventListener('click', function (event) { 	        	// Ajoute un écouteur d’événement sur le fond noir semi-transparent de la modale
			event.preventDefault();                                                                 // Empêche le comportement par défaut (pas strictement nécessaire ici)
			document.getElementById('modal').style.display = "none";                                // Cache l'overlay de la modale
			document.getElementById('modal-works').style.display = "none";                          // Cache la première fenêtre modale (galerie)
			document.getElementById('modal-edit').style.display = "none";                           // Cache la deuxième fenêtre modale (édition d'œuvre)

			if (document.getElementById('form-image-preview')) {                                    // Si un aperçu d'image est présent, on le supprime du DOM
				document.getElementById('form-image-preview').remove();                             
			}

			document.getElementById('modal-edit-work-form').reset();                                // Réinitialise tous les champs du formulaire d’ajout/modification d’œuvre
			document.getElementById('photo-add-icon').style.display = "block";                      // Réaffiche l’icône pour ajouter une photo
			document.getElementById('new-image').style.display = "block";                           // Réaffiche le bouton pour choisir une nouvelle image
			document.getElementById('photo-size').style.display = "block";                          // Réaffiche le texte indiquant la taille maximale autorisée pour la photo
			document.getElementById('modal-edit-new-photo').style.padding = "30px 0 19px 0";        // Réinitialise le padding autour de la zone d’ajout de photo dans la modale
			document.getElementById('submit-new-work').style.backgroundColor = "#A7A7A7";           // Réinitialise la couleur du bouton de soumission (désactivé/grisé)
		});
	});
});

// Fermeture avec le bouton "x" - première modale
document.getElementById('button-to-close-first-window').addEventListener('click', function (event) { // Ajoute un écouteur d'événement sur le bouton de fermeture de la première fenêtre modale (galerie)
	event.preventDefault();                                                                         // Empêche le comportement par défaut du bouton (par exemple, le rechargement de la page si c'est un lien)
	document.getElementById('modal').style.display = "none"; 	                                    // Cache l'overlay général de la modale
	document.getElementById('modal-works').style.display = "none";                                	// Cache la première modale (celle qui contient la galerie d’œuvres)
});

// Fermeture avec le bouton "x" - deuxième modale
document.getElementById('button-to-close-second-window').addEventListener('click', function (event) { // Ajoute un écouteur d'événement sur le bouton de fermeture de la deuxième fenêtre modale (formulaire d'ajout/modification)
	event.preventDefault();                                                                        	// Empêche le comportement par défaut du bouton (comme recharger la page si c'est un lien)
	document.getElementById('modal').style.display = "none";                                     	// Cache la superposition générale de la modale
	document.getElementById('modal-edit').style.display = "none"; 	                                // Cache la deuxième modale (celle d'édition ou d'ajout de projet)

	if (document.getElementById('form-image-preview')) { 	                                        // Si un aperçu d'image a été ajouté dans le formulaire, on le supprime
		document.getElementById('form-image-preview').remove();
	}

	document.getElementById('modal-edit-work-form').reset();                                        // Réinitialise tous les champs du formulaire d'ajout/modification d’œuvre
	document.getElementById('photo-add-icon').style.display = "block";	                            // Réaffiche l'icône d'ajout de photo
	document.getElementById('new-image').style.display = "block";                                   // Réaffiche le champ d'ajout de nouvelle image
	document.getElementById('photo-size').style.display = "block";                                 	// Réaffiche le texte indiquant la taille maximale autorisée
	document.getElementById('modal-edit-new-photo').style.padding = "30px 0 19px 0";               	// Réinitialise le padding du conteneur d'image de la modale
	document.getElementById('submit-new-work').style.backgroundColor = "#A7A7A7";                   // Grise le bouton de soumission (état désactivé par défaut)
});

// Ouverture de la deuxième fenêtre modale avec le bouton "Ajouter photo"
document.getElementById('modal-edit-add').addEventListener('click', function(event) {               // Sélectionne le bouton "Ajouter photo" et lui associe un écouteur d'événement au clic
  event.preventDefault();                                                                           // Empêche le comportement par défaut du lien (rechargement ou redirection)
  let modalWorks = document.getElementById('modal-works');                                          // Sélectionne la première fenêtre modale (celle des travaux existants)
  modalWorks.style.display = "none";                                                                // Masque la première fenêtre modale
  let modalEdit = document.getElementById('modal-edit');                                            // Sélectionne la deuxième fenêtre modale (formulaire d'ajout de photo)
  modalEdit.style.display = "block";                                                                // Affiche la deuxième fenêtre modale
});

// Retour à la première fenêtre modale avec la flèche
document.getElementById('arrow-return').addEventListener('click', function(event) {                 // Sélectionne la flèche de retour et ajoute un écouteur d’événement au clic
  event.preventDefault();                                                                           // Empêche le comportement par défaut du lien (navigation ou rechargement)
  let modalWorks = document.getElementById('modal-works');                                          // Sélectionne la première fenêtre modale (galerie des œuvres)
  modalWorks.style.display = "block";                                                               // Affiche à nouveau la première fenêtre modale
  let modalEdit = document.getElementById('modal-edit');                                            // Sélectionne la deuxième fenêtre modale (formulaire d’ajout/modification)
  modalEdit.style.display = "none";                                                                 // Masque la deuxième fenêtre modale

  // Réinitialisation de tous les formulaires dans la modalité de modification
  if (document.getElementById('form-image-preview') != null) {                                      // Si un aperçu d'image a déjà été ajouté dans le formulaire, on le supprime
    document.getElementById('form-image-preview').remove();
  }

  document.getElementById('modal-edit-work-form').reset();                                          // Réinitialise tous les champs du formulaire (titre, image, catégorie, etc.)
  document.getElementById('photo-add-icon').style.display = "block";                                // Réaffiche l'icône "ajouter une photo"
  document.getElementById('new-image').style.display = "block";                                     // Réaffiche le bouton permettant de téléverser une nouvelle image
  document.getElementById('photo-size').style.display = "block";                                    // Réaffiche le texte indiquant la taille maximale de l’image
  document.getElementById('modal-edit-new-photo').style.padding = "30px 0 19px 0";                  // Rétablit le padding original du bloc contenant le formulaire de photo
  document.getElementById('submit-new-work').style.backgroundColor = "#A7A7A7";                     // Grise le bouton de soumission pour indiquer qu’il n’est pas encore activé
});

// Fonction async pour récupérer les catégories et les ajouter au select
async function loadCategoriesInModal() {                                                            // Fonction asynchrone pour charger dynamiquement les catégories dans le menu déroulant de la modal
  try {
    const response = await fetch("http://localhost:5678/api/categories");                           // Envoie une requête à l'API pour récupérer la liste des catégories
    if (!response.ok) {                                                                             // Si la réponse n'est pas correcte (code différent de 200), une erreur est levée
      throw new Error("Erreur lors de la récupération des catégories");
    }
    const categories = await response.json();                                                       // Transforme la réponse JSON en tableau d'objets JavaScript

    categories.forEach(category => {                                                                // Pour chaque catégorie, on crée une balise <option> à insérer dans le menu déroulant
      const option = document.createElement('option');                                              // Crée un nouvel élément <option>
      option.setAttribute('value', category.id);                                                    // Attribue l'ID de la catégorie comme valeur
      option.textContent = category.name;                                                           // Affiche le nom de la catégorie comme texte visible
      document.querySelector("select.choice-category").appendChild(option);                         // Sélectionne le <select> avec la classe .choice-category et Ajoute l’<option> créée au menu déroulant
    });
  } catch (err) {                                                                                   // En cas d'erreur (réseau, API, JSON), l’erreur est loggée dans la console
    console.log(err);
  }
}
loadCategoriesInModal();                                                                            // Appelle immédiatement la fonction pour charger les catégories dès que le script est lu

});    

