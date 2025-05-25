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
