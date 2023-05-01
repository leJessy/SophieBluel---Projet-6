fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    const gallery = document.querySelector('.gallery');

    const figures = data.map(item => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      img.src = item.imageUrl;
      img.alt = item.title;
      figure.classList.add(item.category.name.replace(/\s+/g, '_'));
      figure.setAttribute('data-category', item.category.name);

      figcaption.textContent = item.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);

      return figure;
    });

    // Ajout de chaque "figure" à la balise gallery
    gallery.append(...figures);

    // Séléction des différents boutons
    const filterBtnAll = document.querySelector('#filter-btnAll');
    const filterBtnObjets = document.querySelector('#filter-btnObjets');
    const filterBtnAppartements = document.querySelector('#filter-btnAppartements');
    const filterBtnHotels = document.querySelector('#filter-btnHotels');
    
    // Event listener sur chaque bouton
    filterBtnAppartements.addEventListener('click', () => {
      filterFigures('Appartements');
    });

    filterBtnObjets.addEventListener('click', () => {
      filterFigures('Objets');
    });

    filterBtnHotels.addEventListener('click', () => {
      filterFigures('Hotels & restaurants');
    });

    filterBtnAll.addEventListener('click', () => {
      filterFigures('All');
    });
    // Filtrage de mes catégories pour pouvoir afficher que certaines catégories lors du clique sur les boutons
    function filterFigures(categoryName) {
      if (categoryName === 'All') {
        gallery.innerHTML = '';
        gallery.append(...figures);
      } else {
        // Selection du nom de chaque catégorie pour afficher seulement 1 catégorie par bouton
        const filteredFigures = figures.filter(figure => {
          return figure.getAttribute('data-category') === categoryName;
        });
    
        // Reset de la gallery pour que chaque éléments soit de nouveau disponible lorsque je clique sur un autre bouton
        gallery.innerHTML = '';
        gallery.append(...filteredFigures);
      }
    }
  });




  


