// Création des boutons et des modales
const openModalBtn = document.getElementById('openModal'); // Bouton pour ouvrir la première modale (Galerie)
const tousBtn = document.getElementById('Tous'); // Bouton pour afficher tous les projets
const addPhotoModalBtn = document.getElementById('addPhotoModalBtn'); // Bouton pour ouvrir la modale "Ajouter une photo"
const validerPhotoBtn = document.getElementById("validerModal"); // Bouton pour valider l'ajout d'une photo
const closeBtns = document.getElementsByClassName("close-modal"); // Boutons pour fermer les modales
const firstModal = document.getElementById("firstModal"); // Première modale (Galerie photo)
const addPhotoModal = document.getElementById("addPhotoModal"); // Modale pour ajouter une photo

// Récupération des catégories depuis l'API
const categoriesReponse = await fetch("http://localhost:5678/api/categories");
const categories = await categoriesReponse.json(); // Conversion de la réponse en JSON

// Récupération des projets (works) depuis l'API
const worksReponse = await fetch("http://localhost:5678/api/works");
const works = await worksReponse.json(); // Conversion de la réponse en JSON

// Ajout d'événements sur les boutons

// Afficher tous les projets lors du clic sur "Tous"
tousBtn.addEventListener("click", () => {
    galleryDisplay(); // Affiche tous les projets dans la galerie
});

// Ouvrir la modale de la galerie
openModalBtn.addEventListener("click", () => {
    openingModal(true); // Affiche la première modale (Galerie photo)
});

// Ouvrir la modale pour ajouter une photo
addPhotoModalBtn.addEventListener("click", () => {
    openAddPhotoModal(); // Affiche la modale pour ajouter une photo
});

// Valider l'ajout d'une photo
validerPhotoBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    saveNewPhoto(); // Sauvegarde la nouvelle photo ajoutée
});

// Appels de fonctions pour l'affichage initial
galleryDisplay(); // Affiche la galerie avec tous les projets
showButtonIfLoggedin(); // Affiche des boutons spécifiques si l'utilisateur est connecté
setLoginLogoutlink(); // Change le bouton "login" en "logout" si l'utilisateur est connecté
loginLogoutLinkHandler(); // Gère la redirection entre login et logout
addCategoriesButtons(); // Ajoute dynamiquement les boutons de catégories
filtresLoggedIn(); // Cache ou affiche certains éléments selon la connexion de l'utilisateur
closingModals(); // Ajoute des événements pour fermer les modales
addEventListenersToModalInputs(); // Gère les inputs dans la modale "Ajouter une photo"

// Afficher tous les projets dans la galerie
async function galleryDisplay() { 
    const gallery = document.getElementById("gallery_id");
    let gallery_contents = "";

    // Itération sur la liste des projets (works)
    for(let i = 0; i < works.length; i++) { 
        // Construction de l'affichage des projets avec leur catégorie et image
        gallery_contents += `<figure categorie= ${works[i].category.name} > 
                             <img src='${works[i].imageUrl}' alt='${works[i].title}'>
                             <figcaption>${works[i].title}</figcaption>
                             </figure>`;
    }
    
    // Injection du contenu dans le DOM pour afficher la galerie
    gallery.innerHTML = gallery_contents;
}

// Ajouter dynamiquement les boutons de catégories
async function addCategoriesButtons() {
    const categories_element = document.getElementById("categories_id");

    // Création des boutons pour chaque catégorie
    for (let i = 0; i < categories.length; i++) { 
        const cat = document.createElement("button");
        cat.innerText = categories[i].name; // Nom de la catégorie
        cat.id = categories[i].name; // ID correspondant à la catégorie
        cat.classList.add('categoriesTravaux'); // Ajouter une classe pour le style

        // Ajout d'un événement pour filtrer les projets par catégorie
        cat.addEventListener("click", (event) => {
            galleryDisplayCategorie(event.currentTarget.id); // Affiche les projets de la catégorie sélectionnée
        });

        // Ajout du bouton de catégorie au DOM
        categories_element.appendChild(cat);
    }
}

// Afficher les projets d'une catégorie spécifique
function galleryDisplayCategorie(categorie) {
    const gallery = document.getElementById("gallery_id");
    let gallery_contents = "";

    // Filtrer les projets par catégorie
    for (let i = 0; i < works.length; i++) { 
        if (works[i].category.name === categorie) { 
            // Ajoute les projets correspondant à la catégorie sélectionnée
            gallery_contents += `<figure categorie= ${works[i].category.name} > 
                                 <img src='${works[i].imageUrl}' alt='${works[i].title}'>
                                 <figcaption>${works[i].title}</figcaption>
                                 </figure>`;
        }
    }
    
    // Injection du contenu filtré dans le DOM
    gallery.innerHTML = gallery_contents;
}

// Changer le texte "login" en "logout" si l'utilisateur est connecté
function setLoginLogoutlink() {
    const authText = document.getElementById('authText');
    if (window.localStorage.getItem("token") == null) {
        authText.innerText = 'login'; // Si l'utilisateur n'est pas connecté
    } else {
        authText.innerText = 'logout'; // Si l'utilisateur est connecté
        openModalBtn.style.display = 'block'; // Affiche le bouton "modifier"
        tousBtn.style.display = 'none'; // Masque le bouton "Tous"
    }
}

// Gérer la redirection vers la page login ou effectuer la déconnexion
function loginLogoutLinkHandler() {
    const loginLink = document.getElementById("authText");
    loginLink.addEventListener("click", () => {
        if (window.localStorage.getItem("token") == null) {
            window.location.href = "login.html"; // Rediriger vers login si non connecté
        } else {
            window.localStorage.removeItem("token"); // Supprimer le token de session
            window.location.href = "index.html"; // Rediriger vers la page d'accueil
        }
    });
}

// Cacher ou afficher des éléments en fonction de la connexion de l'utilisateur
function filtresLoggedIn() {
    const bandeau = document.getElementById("bandeau-edition");
    if (window.localStorage.getItem("token") != null) {
        const categoriesTravaux = document.querySelectorAll('.categoriesTravaux');
        categoriesTravaux.forEach(c => c.style.display = 'none'); // Masquer les filtres si connecté
        bandeau.style.display = "block"; // Afficher le bandeau d'édition
    }
}

// Afficher le bouton "modifier" si l'utilisateur est connecté
function showButtonIfLoggedin() {
    if (window.localStorage.getItem("token") != null) {
        const openModal = document.getElementById("openModal");
        openModal.style.display = "block"; // Afficher le bouton "modifier"
    }
}

// Ouvrir la modale pour la galerie photo
async function openingModal(displayFirstModal) {
    const worksReponse = await fetch("http://localhost:5678/api/works");
    const works = await worksReponse.json(); // Récupérer la liste des travaux depuis l'API
    
    if (displayFirstModal) {
        firstModal.style.display = "flex"; // Afficher la première modale
    }

    const gallery = document.getElementById("mini_gallery_id");
    let gallery_contents = "";

    // Générer le contenu de la mini galerie avec les boutons de suppression
    for (let i = 0; i < works.length; i++) { 
        gallery_contents += `<figure categorie= ${works[i].category.name}> 
                             <img src='${works[i].imageUrl}'><i workid='${works[i].id}' class='close close-mini-gallery fa-solid fa-trash-can'></i>
                             </figure>`;
    }

    // Injection du contenu dans le DOM
    gallery.innerHTML = gallery_contents;

    // Ajout des événements de suppression pour chaque projet
    const deleteButtons = document.getElementsByClassName("close-mini-gallery");
    for (let i = 0; i < deleteButtons.length; i++) { 
        deleteButtons[i].addEventListener("click", async (event) => {
            event.preventDefault();
            let url = "http://localhost:5678/api/works/" + deleteButtons[i].getAttribute("workid"); // URL pour supprimer un projet
            const result = await fetch(url, {
                method: "DELETE",
                headers: {"Content-Type": "application/json", Authorization: 'Bearer ' + window.localStorage.getItem("token")}
            });

            if (result.status === 204) {
                console.log('Photo supprimée avec succès');
                
                // Recharger les données de l'API pour mettre à jour les travaux après la suppression
                await updateWorksData(); // Mettre à jour la liste des travaux
                await galleryDisplay(); // Rafraîchir la galerie principale
                openingModal(true); // Réouvrir la modale mise à jour
            } else {
                console.error('Erreur lors de la suppression de la photo.');
            }
        });
    }
}

// Fonction pour mettre à jour les données des travaux
async function updateWorksData() {
    const updatedWorksResponse = await fetch("http://localhost:5678/api/works");
    const updatedWorks = await updatedWorksResponse.json();

    // Mise à jour de la variable globale works avec les nouvelles données
    works.length = 0; // Vider l'ancien tableau
    works.push(...updatedWorks); // Ajouter les nouveaux travaux
}

// Ouvrir la modale pour ajouter une photo
function openAddPhotoModal() {
    addPhotoModal.style.display = "flex"; // Afficher la modale "Ajouter une photo"
    firstModal.style.display = "none"; // Masquer la première modale

    // Gérer le bouton retour dans la modale "Ajouter une photo"
    const returnBtn = addPhotoModal.querySelector('.return-button');
    returnBtn.onclick = function() {
        addPhotoModal.style.display = "none"; // Masquer la modale "Ajouter une photo"
        firstModal.style.display = "flex"; // Réafficher la première modale
    };
}

// Sauvegarder la photo ajoutée et rafraîchir la galerie principale
async function saveNewPhoto() {
    let url = "http://localhost:5678/api/works/";
    const formData = new FormData();
    formData.append("title", document.getElementById("titrePhoto").value); // Titre de la photo
    formData.append("category", document.getElementById("categoriePhoto").value); // Catégorie de la photo
    formData.append("image", document.getElementById("imageUrl").files[0]); // Image sélectionnée

    const result = await fetch(url, {
        method: "POST",
        headers: {'Authorization': 'Bearer ' + window.localStorage.getItem("token")},
        body: formData
    });

    if (result.ok) {
        console.log('Photo ajoutée avec succès');
        
        // Recharger les données de l'API pour mettre à jour les travaux
        const worksReponse = await fetch("http://localhost:5678/api/works");
        const updatedWorks = await worksReponse.json();

        // Mettre à jour la variable globale "works" avec les nouvelles données
        works.length = 0; // Vider l'ancien tableau
        works.push(...updatedWorks); // Ajouter les nouveaux travaux

        await galleryDisplay(); // Rafraîchir la galerie principale

        // Fermer la modale après l'ajout de la photo
        firstModal.style.display = "none";
        addPhotoModal.style.display = "none";
        
        resetForm(); // Réinitialiser le formulaire
    } else {
        console.error('Erreur lors de l\'ajout de la photo.');
    }
}

// Réinitialiser le formulaire "Ajouter une photo"
function resetForm() {
    const photoPost = document.getElementById("photoPost");
    const successMessage = document.getElementById("success-message");
    const fileInput = document.getElementById("imageUrl");
    const imagePreview = document.getElementById("imagePreview");
    const photoIcon = document.getElementById("photo-icon");
    const buttonAddPhoto = document.getElementById("button-add-photo");
    const subTextAddPhoto = document.getElementById("subtext-add-photo");
    const inputZone = document.getElementById("grey-input-zone");

    photoPost.reset(); // Réinitialiser le formulaire
    successMessage.style.display = "block"; // Afficher le message de succès
    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000); // Masquer le message après 3 secondes

    // Réinitialiser l'aperçu de l'image et les autres éléments
    fileInput.value = "";
    imagePreview.src = "";
    imagePreview.style.display = "none";
    photoIcon.style.display = "block";
    buttonAddPhoto.style.display = "block";
    subTextAddPhoto.style.display = "block";
    inputZone.style.flexDirection = "column"; 

    // Désactiver le bouton de soumission
    const submitButton = document.getElementById("validerModal");
    submitButton.disabled = true;
    submitButton.classList.add("disabled");
    submitButton.classList.remove("enabled");

    // Cacher les messages d'erreur
    const errorMessage = document.getElementById("champsRequis");
    errorMessage.style.display = "none";
}

// Gérer la fermeture des modales
function closingModals() {
    let modals = document.getElementsByClassName("modal");

    // Ajouter l'événement de fermeture sur chaque bouton
    for (let i = 0; i < closeBtns.length; i++) {
        closeBtns[i].addEventListener("click", () => {
            firstModal.style.display = "none";
            addPhotoModal.style.display = "none";
        });

        // Fermer la modale si on clique en dehors de celle-ci
        window.addEventListener("click", (event) => {
            for (let i = 0; i < modals.length; i++) {
                if (event.target == modals[i]) {
                    modals[i].style.display = "none";
                }
            }
        });
    }

    galleryDisplay(); // Réafficher la galerie à la fermeture
}

// Gérer la validation des champs du formulaire dans la modale "Ajouter une photo"
function addEventListenersToModalInputs() {
    let fileInput = document.getElementById("imageUrl");
    let textInput = document.getElementById("titrePhoto");
    let selectInput = document.getElementById("categoriePhoto");

    fileInput.addEventListener("change", handleFileInput); // Gérer l'aperçu de l'image
    textInput.addEventListener("input", checkInputs); // Vérifier les champs de texte
    selectInput.addEventListener("change", checkInputs); // Vérifier la sélection de la catégorie
}

// Gérer l'affichage de l'aperçu de l'image ajoutée
function handleFileInput() {
    let fileInput = document.getElementById("imageUrl");
    let imagePreview = document.getElementById("imagePreview");
    let photoIcon = document.getElementById("photo-icon");
    let buttonAddPhoto = document.getElementById("button-add-photo");
    let subTextAddPhoto = document.getElementById("subtext-add-photo");
    let inputZone = document.getElementById("grey-input-zone");

    if (fileInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result; // Affiche l'image sélectionnée
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(fileInput.files[0]);
        photoIcon.style.display = "none";
        buttonAddPhoto.style.display = "none";
        subTextAddPhoto.style.display = "none";
        inputZone.style.flexDirection = "row";
    } else {
        imagePreview.style.display = "none";
        imagePreview.src = ""; // Réinitialise l'image si aucun fichier n'est sélectionné
    }

    checkInputs(); // Vérifier les autres champs après l'ajout d'une image
}

// Vérifier que tous les champs du formulaire sont remplis avant d'activer le bouton de validation
function checkInputs() {
    let fileInput = document.getElementById("imageUrl");
    let textInput = document.getElementById("titrePhoto");
    let selectInput = document.getElementById("categoriePhoto");
    let submitButton = document.getElementById("validerModal");
    let errorMessage = document.getElementById("champsRequis");

    // Vérification des conditions
    if (fileInput.files.length > 0 && textInput.value.trim() !== "" && selectInput.value !== "0") {
        submitButton.disabled = false;
        submitButton.classList.add("enabled");
        submitButton.classList.remove("disabled");
        errorMessage.style.display = "none";
        console.log('Button enabled');
        galleryDisplay(); // Optionnel : Rafraîchir la galerie
    } else {
        errorMessage.style.display = "block"; // Afficher un message d'erreur si des champs manquent
        submitButton.disabled = true;
        submitButton.classList.add("disabled");
        submitButton.classList.remove("enabled");
    }
}
