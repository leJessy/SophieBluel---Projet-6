let works = [];


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
  });
}
closeModal2();

// Revenir à la première modal
backarrow.addEventListener("click", function () {
  firstmodal.style.display = "flex";
  secondmodal.style.display = "none";
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
      debugger;
      e.preventDefault();
      confirmDelWork(work.id);
    });
    galleryContainer.appendChild(figureModal);
    figureModal.append(imgModal, editButton, deleteButton);
  });
}

async function delWork(workId) {
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // const result = await response.json();
  // console.log(result);
}

async function confirmDelWork(workId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    await delWork(workId);
    galleryContainer.innerHTML = "";
    showGalleryInModal();
    showGallery();
  }
}

showGalleryInModal();
