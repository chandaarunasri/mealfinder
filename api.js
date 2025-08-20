 const categoriesMenu = document.getElementById("categoriesMenu");
    const categoriesList = document.getElementById("categoriesList");
    const sideMenu = document.getElementById("sideMenu");
    const menuBtn = document.getElementById("menuBtn");
    const closeMenu = document.getElementById("closeMenu");
    const categorySection = document.getElementById("categorySection");
    const categoryDescription = document.getElementById("categoryDescription");
    const mealsContainer = document.getElementById("mealsContainer");
    const mealDetailsSection = document.getElementById("mealDetailsSection");
    const mealDetails = document.getElementById("mealDetails");
    const searchArea = document.getElementById("searchArea");
    const categoriesWithThumb = document.getElementById("categoriesWithThumb");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const searchResultArea = document.getElementById("searchResultArea");

    // Side menu toggle
    menuBtn.addEventListener("click", () => {
      sideMenu.classList.remove("-right-64");
      sideMenu.classList.add("right-0");
    });
    closeMenu.addEventListener("click", () => {
      sideMenu.classList.remove("right-0");
      sideMenu.classList.add("-right-64");
    });

    // Load categories on home
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then(res => res.json())
      .then(data => {
        const categories = data.categories;
        categories.forEach(category => {
          // Side Menu Item
          const listItem = document.createElement("li");
          listItem.className = "block text-gray-700 text-sm px-4 hover:bg-gray-100 cursor-pointer hover:text-orange-500 border-b";
          listItem.textContent = category.strCategory;
          listItem.onclick = () => {
            location.hash = `category=${category.strCategory}`;
          };
          categoriesMenu.appendChild(listItem);

          // Category Thumbnails
          const categoryThumb = document.createElement("div");
          categoryThumb.className = "bg-white shadow-lg relative text-center cursor-pointer hover:shadow-xl rounded";
          const thumbImage = document.createElement("img");
          thumbImage.src = category.strCategoryThumb;
          thumbImage.alt = category.strCategory;
          thumbImage.className = "w-full h-32 object-cover p-2";
          const thumbTitle = document.createElement("div");
          thumbTitle.textContent = category.strCategory;
          thumbTitle.className = "absolute py-1 px-2 text-sm text-white bg-orange-500 rounded top-0 right-0 m-1";
          categoryThumb.appendChild(thumbImage);
          categoryThumb.appendChild(thumbTitle);
          categoryThumb.onclick = () => {
            location.hash = `category=${category.strCategory}`;
          };
          categoriesList.appendChild(categoryThumb);
        });
      });

    // Router
    window.addEventListener("hashchange", handleRoute);
    window.addEventListener("load", handleRoute);
    function handleRoute() {
      const hash = location.hash.substring(1);
      searchResultArea.innerHTML = '';

      
      categoriesWithThumb.classList.remove("hidden");
      if (!hash) {
        searchArea.classList.remove("hidden");
        categorySection.classList.add("hidden");
        mealDetailsSection.classList.add("hidden");
        return;
      }
      const params = new URLSearchParams(hash);
      if (params.has("category")) {
        const category = params.get("category");
        loadCategory(category);
      } else if (params.has("meal")) {
        const mealId = params.get("meal");
        const category = params.get("cat");
        loadMealDetails(mealId, category);
      }
    }

    function loadCategory(category) {
      searchArea.classList.add("hidden");
      categorySection.classList.remove("hidden");
      mealDetailsSection.classList.add("hidden");
      categoriesWithThumb.classList.remove("hidden");
      fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then(res => res.json())
        .then(data => {
          const categ = data.categories.find(c => c.strCategory === category);
          if (categ) {
            categoryDescription.innerHTML = `
              <div class="bg-white shadow rounded p-4">
                <h2 class="text-2xl font-bold text-orange-600">${categ.strCategory}</h2>
                <p class="mt-2 text-gray-700">${categ.strCategoryDescription}</p>
              </div>
            `;
          }
        });
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(res => res.json())
        .then(data => {
          mealsContainer.innerHTML = "";
          data.meals.forEach(meal => {
            const card = document.createElement("div");
            card.className = "bg-white shadow rounded overflow-hidden";
            card.innerHTML = `
              <img src="${meal.strMealThumb}" class="w-full h-40 object-cover" />
              <div class="p-4">
                <h3 class="font-bold">${meal.strMeal}</h3>
                <button class="mt-2 bg-orange-500 text-white px-3 py-1 rounded text-sm">View Details</button>
              </div>
            `;
            card.querySelector("button").onclick = () => {
              location.hash = `meal=${meal.idMeal}&cat=${category}`;
            };
            mealsContainer.appendChild(card);
          });
        });
    }

    function loadMealDetails(id, category) {
      searchArea.classList.add("hidden");
      categorySection.classList.add("hidden");
      mealDetailsSection.classList.remove("hidden");
      categoriesWithThumb.classList.remove("hidden");
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => {
          const meal = data.meals[0];
          const ingredientsArr = [], measuresArr = [];
          for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`], meas = meal[`strMeasure${i}`];
            if (ing && ing.trim() !== "") ingredientsArr.push(ing);
            if (meas && meas.trim() !== "") measuresArr.push(meas);
          }
         
        });
    }

    // Search function  NOT hide categories
    function searchMeals(query) {
      if (!query.trim()) return;
      searchArea.classList.remove("hidden");
      categorySection.classList.add("hidden");
      mealDetailsSection.classList.add("hidden");
      categoriesWithThumb.classList.remove("hidden");
      searchResultArea.innerHTML = '';

      let resultHTML = `<h2 class="text-xl font-bold mt-6 mb-4">MEALS</h2>`;
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (data.meals) {
            resultHTML += `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">`;
            data.meals.forEach(meal => {
              resultHTML += `
                <div class="bg-white shadow rounded overflow-hidden">
                  <img src="${meal.strMealThumb}" class="w-full h-32 object-cover" />
                  <div class="p-3">
                    <h3 class="font-bold">${meal.strMeal}</h3>
                    <span class="block text-sm text-gray-600">${meal.strArea || ''}</span>
                    <button class="mt-2 bg-orange-500 text-white px-3 py-1 rounded text-sm" onclick="location.hash='meal=${meal.idMeal}&cat=${meal.strCategory}'">View Details</button>
                  </div>
                </div>`;
            });
            resultHTML += `</div>`;
          } else {
            resultHTML += `<p class="text-center text-gray-700 text-lg mt-10">No food found</p>`;
          }
          searchResultArea.innerHTML = resultHTML;
        })
        .catch(() => {
          searchResultArea.innerHTML = `<p class="text-center text-gray-700 text-lg mt-10">No food found</p>`;
        });
    }

    searchBtn.addEventListener("click", () => {
      searchMeals(searchInput.value);
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchMeals(searchInput.value);
      }
    });