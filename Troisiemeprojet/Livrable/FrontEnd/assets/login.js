// Exécution du code JavaScript une fois que tout le HTML est chargé
document.addEventListener('DOMContentLoaded', function() {

	// Ajout d'un écouteur d'événement sur la soumission du formulaire de connexion
	document.getElementById('user-login-form').addEventListener('submit', function(event) {
		// Empêche le rechargement de la page lors de la soumission du formulaire
		event.preventDefault();

		// Récupération des données saisies par l'utilisateur dans le formulaire
		const user = {
			email: document.querySelector('#email').value,      // Champ email
			password: document.querySelector('#password').value // Champ mot de passe
		};

		// Envoi de la requête POST vers l'API pour authentifier l'utilisateur
		fetch('http://localhost:5678/api/users/login', {
			method: 'POST', // Méthode HTTP
			headers: {
				'Content-Type': 'application/json' // Type de contenu envoyé
			},
			body: JSON.stringify(user) // Conversion de l'objet utilisateur en JSON
		})
		.then(function(response) {
			// Vérification du statut de la réponse pour gérer les différents cas
			
            switch(response.status) {
				case 500:
				case 503:
					// Erreur côté serveur (ex: API indisponible)
					alert("Erreur côté serveur!");
					break;

				case 401:
				case 404:
					// Identifiants incorrects ou utilisateur non trouvé
					const formEl = document.getElementById('user-login-form');
                    const errorEl = formEl.nextSibling;
                    errorEl.classList.remove("not-error");
					break;

				case 200:
					// Connexion réussie, on passe à la lecture du corps de la réponse
					console.log("Authentification réussie.");
					return response.json(); // Renvoie les données de réponse (token, userId)
					break;
			}
		})
		.then(function(data) {
			// Vérifie que les données ont bien été récupérées avant d'agir
			if (!data) return;

			// Affiche les données reçues dans la console (facultatif pour debug)
			console.log(data);

			// Stocke le token et l'identifiant de l'utilisateur dans le localStorage
			localStorage.setItem('token', data.token);
			localStorage.setItem('userId', data.userId);

			// Redirige l'utilisateur vers la page d'accueil ou tableau de bord
			location.href = 'index.html';
		})
		.catch(function(err) {
			// Capture et affiche les erreurs réseau ou JavaScript
			console.log(err);
		});
	});
});
