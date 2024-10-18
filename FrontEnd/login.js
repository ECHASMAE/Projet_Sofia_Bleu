// Récupération des éléments du DOM
const formLogin = document.getElementById('formLogin'); // Le formulaire de connexion
const errorMessage = document.getElementById('error-message'); // Zone d'affichage des messages d'erreur

// Gestion de l'événement "submit" sur le formulaire
formLogin.addEventListener("submit", async (event) => {
    // On empêche le comportement par défaut du formulaire (rechargement de la page)
    event.preventDefault();
    console.log("Il n’y a pas eu de rechargement de page");

    // Récupération des valeurs des champs email et mot de passe
    const email = document.getElementById("email").value; // Email saisi par l'utilisateur
    const password = document.getElementById("password").value; // Mot de passe saisi par l'utilisateur

    // Création de l’objet contenant les données du formulaire
    const loginData = {
        email: email, // Assignation de l'email à l'objet loginData
        password: password // Assignation du mot de passe à l'objet loginData
    };

    // Conversion de l'objet loginData en JSON
    const loginDataJson = JSON.stringify(loginData); // Transformation en chaîne JSON pour l'envoi au serveur

    try {
        // Envoi des informations de connexion à l'API
        const result = await fetch("http://localhost:5678/api/users/login", {
            method: "POST", // Utilisation de la méthode HTTP POST pour envoyer les données
            headers: { "Content-Type": "application/json" }, // Spécifie que les données envoyées sont au format JSON
            body: loginDataJson // Données envoyées dans le corps de la requête
        });

        // Si la requête est réussie
        if (result.ok) {
            const resultValue = await result.json(); // Récupération de la réponse sous forme de JSON
            console.log("Login successful", resultValue); // Affichage d'un message de succès dans la console

            // Masquer le message d'erreur s'il était affiché précédemment
            errorMessage.style.display = 'none';

            // Stockage du token d'authentification dans le localStorage
            window.localStorage.setItem("token", resultValue.token); // Le token est utilisé pour l'authentification des futures requêtes

            // Redirection vers la page d'accueil après connexion réussie
            window.location.href = "index.html"; // Redirection de l'utilisateur après la connexion

        } else {
            // Si l'authentification échoue, afficher un message d'erreur
            const error = await result.json(); // Récupération des détails de l'erreur depuis la réponse
            console.error("Login failed", error); // Affichage de l'erreur dans la console

            // Affichage du message d'erreur pour l'utilisateur
            errorMessage.textContent = "Email ou mot de passe incorrect."; // Texte d'erreur à afficher
            errorMessage.style.display = 'block'; // Affiche la zone de message d'erreur
        }

    } catch (error) {
        // En cas d'erreur lors de la requête (problème réseau, serveur indisponible, etc.)
        console.error("An error occurred", error); // Affichage de l'erreur dans la console
        errorMessage.textContent = "Une erreur est survenue. Veuillez réessayer plus tard."; // Message d'erreur générique pour l'utilisateur
        errorMessage.style.display = 'block'; // Affiche la zone de message d'erreur
    }
});
