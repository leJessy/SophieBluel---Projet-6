function showGallery() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      works = data;
      const gallery = document.querySelector(".gallery");
      gallery.innerHTML = "";
      const figures = data.map((item) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        img.src = item.imageUrl;
        img.alt = item.title;
        figure.classList.add(item.category.name.replace(/\s+/g, "_"));
        figure.setAttribute("data-category", item.category.name);
        figure.setAttribute("data-id", item.id);
        figcaption.textContent = item.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        return figure;
      });
      // Ajout de chaque "figure" à la balise gallery
      gallery.append(...figures);

      // Séléction des différents boutons
      const filterBtnAll = document.querySelector("#filter-btnAll");
      const filterBtnObjets = document.querySelector("#filter-btnObjets");
      const filterBtnAppartements = document.querySelector(
        "#filter-btnAppartements"
      );
      const filterBtnHotels = document.querySelector("#filter-btnHotels");

      // Event listener sur chaque bouton
      filterBtnAppartements.addEventListener("click", () => {
        filterFigures("Appartements");
      });

      filterBtnObjets.addEventListener("click", () => {
        filterFigures("Objets");
      });

      filterBtnHotels.addEventListener("click", () => {
        filterFigures("Hotels & restaurants");
      });

      filterBtnAll.addEventListener("click", () => {
        filterFigures("All");
      });
      // Filtrage de mes catégories pour pouvoir afficher que certaines catégories lors du clique sur les boutons
      function filterFigures(categoryName) {
        if (categoryName === "All") {
          gallery.HinnerTML = "";
          gallery.append(...figures);
        } else {
          // Selection du nom de chaque catégorie pour afficher seulement 1 catégorie par bouton
          const filteredFigures = figures.filter((figure) => {
            return figure.getAttribute("data-category") === categoryName;
          });

          // Reset de la gallery pour que chaque éléments soit de nouveau disponible lorsque je clique sur un autre bouton
          gallery.innerHTML = "";
          gallery.append(...filteredFigures);
        }
      }
    });
}
showGallery();

const token = sessionStorage.getItem("token");
const loginlogout = document.getElementById("loginlogout");
const edit = document.querySelector(".edit");
const modifier = document.querySelector(".modifier1");
const modifier2 = document.querySelector(".modifier2");
const modalwrapper = document.querySelector(".modal-wrapper");
const firstmodal = document.getElementById("modal");
const secondmodal = document.getElementById("modal2");
const croix = document.querySelector(".exit1");
const secondcroix = document.querySelector(".exit2");
const addproject = document.querySelector(".newproject");
const backarrow = document.querySelector(".arrow");
const galleryContainer = document.querySelector(".gallery-container");
const optionCategory = document.getElementById("categorie");
let preview = document.getElementById("preview");
const imageTitle = document.getElementById("titre");
// random
const form = document.querySelector(".valid");

// Changement login en logout si token
if (token) {
  loginlogout.innerText = "logout";
} else {
  loginlogout.innerText = "login";
}

// Suppression du token lorsque je clique sur login et que le token est présent
loginlogout.addEventListener("click", function (event) {
  if (token) {
    event.preventDefault();
    sessionStorage.removeItem("token");
    location.reload();
  }
});

//Affichage des boutons modifier si le token est présent
if (token) {
  edit.style = "display: flex";
  modifier.style = "display: block";
  modifier2.style = "display: block";
}

// Ouverture de la modal
function openModal() {
  modifier2.addEventListener("click", function () {
    modalwrapper.style.display = "flex";
    firstmodal.style.display = "flex";
  });
}
openModal();

// Fermeture de la modal au clique sur le wrapper (toute la page)
document.addEventListener("click", function (event) {
  if (event.target === modalwrapper) {
    modalwrapper.style.display = "none";
    secondmodal.style.display = "none";
    imageTitle.value = "";
    preview.value = "";
  }
});

// Fermeture de la modal au clique sur la croix
function closeModal() {
  croix.addEventListener("click", function () {
    modalwrapper.style.display = "none";
    secondmodal.style.display = "none";
  });
}
closeModal();

// Boutton pour ajouter un nouveau projet
addproject.addEventListener("click", function () {
  firstmodal.style.display = "none";
  secondmodal.style.display = "flex";
});

// Fermeture second modal au clique sur la croix
function closeModal2() {
  secondcroix.addEventListener("click", function () {
    modalwrapper.style.display = "none";
    secondmodal.style.display = "none";
    imageTitle.value = "";
    preview.value = "";
  });
}
closeModal2();

// Revenir à la première modal
backarrow.addEventListener("click", function () {
  firstmodal.style.display = "flex";
  secondmodal.style.display = "none";
  imageTitle.value = "";
  preview.value = "";
});

// --- Affichage de la galerie dans la modale ---
let modalGallery = [];

async function getModalGallery() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

async function showGalleryInModal() {
  modalGallery = await getModalGallery();
  modalGallery.forEach((work) => {
    const figureModal = document.createElement("figure");
    const imgModal = document.createElement("img");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    imgModal.src = work.imageUrl;
    imgModal.alt = work.title;
    editButton.innerText = "Éditer";
    editButton.classList.add("edition");
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", function (e) {
      e.preventDefault();
      confirmDeleteWork(work.id);
    });
    galleryContainer.appendChild(figureModal);
    figureModal.append(imgModal, editButton, deleteButton);
  });
}

// fonction pour supprimer une image
async function deleteWork(workId) {
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// fonction de confirmation pour supprimer une image
async function confirmDeleteWork(workId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer le projet ?")) {
    await deleteWork(workId);
    galleryContainer.innerHTML = "";
    showGalleryInModal();
    showGallery();
  }
}

showGalleryInModal();

// Preview de l'image
function previewImage(event) {
  preview.src = "";
  const file = event.target.files[0];
  const imageUrl = URL.createObjectURL(file);
  preview.src = imageUrl;
}

// fetch des catégories
async function getCategories() {
  return fetch("http://localhost:5678/api/categories").then((response) =>
    response.json()
  );
}

// Appel le fetch des catégories et les mets dans optionCategory avec appenchild
async function getExactCategories() {
  const category = await getCategories();

  for (let i = 0; i < category.length; i++) {
    const option = document.createElement("option");
    option.textContent = category[i].name;
    option.value = category[i].id;
    optionCategory.appendChild(option);
  }
}

getExactCategories();

// Changement du boutton valider si les conditions sont rempli (4mo, titre, catégorie)
const uploadImg = document.getElementById(`uploadImg`);

const checkConditions = () => {
  if (
    uploadImg.files[0]?.size < 4000000 &&
    imageTitle.value !== "" &&
    optionCategory.value !== ""
  ) {
    form.classList.add("validok");
  } else {
    form.classList.remove("validok");
  }
};
imageTitle.addEventListener("input", checkConditions);
optionCategory.addEventListener("input", checkConditions);
uploadImg.addEventListener("input", checkConditions);

// Utilisation de post et formdata pour envoyer un nouveau projet sur l'api
form.addEventListener("click", async (e) => {
  e.preventDefault();
  const formData = new FormData(document.getElementById("sendImg"));
  formData.append("image", uploadImg.files[0]);
  formData.append("title", imageTitle.value);
  formData.append("category", optionCategory.value);
  if (form.classList.contains("validok")) {
    const response = await fetch(
      "http://localhost:5678/api/works",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    modalwrapper.style.display = "none";
    secondmodal.style.display = "none";
    galleryContainer.innerHTML = "";
    showGalleryInModal();
    showGallery();
    imageTitle.value = "";
    uploadImg.files[0] = "";
    preview.src = "";
  }
});
