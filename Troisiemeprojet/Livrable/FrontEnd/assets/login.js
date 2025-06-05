document.addEventListener('DOMContentLoaded', function () {                                             // Attend que le DOM soit complètement chargé avant d'exécuter le script
    document.getElementById('user-login-form').addEventListener('submit', async function (event) {      // Ajoute un écouteur d'événement sur la soumission du formulaire de connexion
        event.preventDefault();                                                                         // Empêche le comportement par défaut du formulaire (rechargement de la page)
        const errorEl = document.querySelector('.error');                                               // Sélectionne l'élément contenant un message d'erreur, s'il existe
        if (errorEl) {                                                                                  // Vérifie si l'élément d'erreur existe dans le DOM
            errorEl.classList.add('not-error');                                                         // Ajoute une classe CSS pour masquer le message d'erreur
        }
        const user = {                                                                                  // Crée un objet contenant les informations de connexion saisies
            email: document.querySelector('#email').value,                                              // Récupère la valeur du champ email
            password: document.querySelector('#password').value                                         // Récupère la valeur du champ mot de passe
        };

        try {                                                                                           // Tente d'exécuter une requête HTTP et de traiter la réponse
            const response = await fetch('http://localhost:5678/api/users/login', {                     // Envoie une requête POST à l'API de connexion avec les identifiants
                method: 'POST',                                                                         // Utilise la méthode POST pour envoyer les données
                headers: {
                    'Content-Type': 'application/json'                                                  // Indique que le corps de la requête est au format JSON
                },
                body: JSON.stringify(user)                                                              // Convertit l'objet `user` en chaîne JSON pour l'envoi
            });

            let data;                                                                                   // Variable pour stocker les données de la réponse si tout se passe bien
            switch (response.status) {                                                                  // Vérifie le code de statut HTTP pour déterminer l'action à effectuer

                case 500:
                case 503:
                    alert("Erreur côté serveur!");                                                      // Alerte l'utilisateur en cas d'erreur serveur
                    break;

                case 401:
                case 404:
                    const formEl = document.getElementById('user-login-form');                          // Récupère le formulaire de connexion
                    const errorEl = formEl.nextElementSibling;                                          // Récupère l'élément juste après le formulaire (ex: le paragraphe d'erreur)
                    if (errorEl && errorEl.classList.contains('error')) {                               // Vérifie si c’est bien un message d’erreur
                        errorEl.classList.remove("not-error");                                          // Affiche le message d’erreur en supprimant la classe qui le masquait
                    }
                    break;

                case 200:
                    console.log("Authentification réussie.");                                           // Affiche un message dans la console si l'authentification est correcte
                    data = await response.json();                                                       // Parse le corps de la réponse en JSON pour récupérer les données (token, id)
                    break;

                default:
                    alert("Erreur inconnue!");                                                          // Gère les cas de statuts non prévus
                    break;
            }

            if (!data) return;                                                                          // Arrête l'exécution si aucune donnée n’a été reçue (échec de la connexion)

            console.log(data);                                                                          // Affiche les données de réponse (utile pour le débogage)

            localStorage.setItem('token', data.token);                                                  // Stocke le token dans le localStorage du navigateur pour maintenir la session

            localStorage.setItem('userId', data.userId);                                                // Stocke l’identifiant de l’utilisateur pour une éventuelle réutilisation

            location.href = 'index.html';                                                               // Redirige l’utilisateur vers la page d’accueil
        } catch (err) {                                                                                 // Capture les erreurs potentielles (connexion impossible, serveur éteint, etc.)

            console.log(err);                                                                           // Affiche l’erreur dans la console pour faciliter le débogage
        }
    });

});
