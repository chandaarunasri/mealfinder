const categoriesMenu = document.getElementById("categoriesMenu");
    const categoriesList = document.getElementById("categoriesList");
    const sideMenu = document.getElementById("sideMenu");
    const menuBtn = document.getElementById("menuBtn");
    const closeMenu = document.getElementById("closeMenu");
    const searchArea = document.getElementById("searchArea");
    const categoriesWithThumb = document.getElementById("categoriesWithThumb");
    const categorySection = document.getElementById("categorySection");
    const categoryDescription = document.getElementById("categoryDescription");
    const mealsContainer = document.getElementById("mealsContainer");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const searchResultArea = document.getElementById("searchResultArea");
    const mealDetailsSection = document.getElementById("mealDetailsSection");
    const mealDetails = document.getElementById("mealDetails");

    // Side menu
    menuBtn.addEventListener("click", () => {
      sideMenu.classList.remove("-right-64");
      sideMenu.classList.add("right-0");
    });
    closeMenu.addEventListener("click", () => {
      sideMenu.classList.remove("right-0");
      sideMenu.classList.add("-right-64");
    });

    // Load categories 
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((res) => res.json())
      .then((data) => {
        const categories = data.categories;
        categories.forEach((category) => {
          // Side Menu Item
          const listItem = document.createElement("li");
          listItem.className =
            "block text-gray-700 text-sm px-4 hover:bg-gray-100 cursor-pointer hover:text-orange-500 border-b";
          listItem.textContent = category.strCategory;
          listItem.onclick = () => {
            location.hash = `category=${category.strCategory}`;
          };
          categoriesMenu.appendChild(listItem);

          // Category Thumbnails
          const categoryThumb = document.createElement("div");
          categoryThumb.className =
            "bg-white shadow-lg relative text-center cursor-pointer hover:shadow-xl rounded";
          categoryThumb.innerHTML = `
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="w-full h-32 object-cover p-2"/>
            <div class="absolute py-1 px-2 text-xs font-bold text-white bg-orange-500 rounded top-0 right-0 m-1 uppercase">${category.strCategory}</div>
          `;
          categoryThumb.onclick = () => {
            location.hash = `category=${category.strCategory}`;
          };
          categoriesList.appendChild(categoryThumb);
        });
      });

    
    function searchMeals(query) {
      if (!query.trim()) return;

      // clear and hide meal details
      searchResultArea.innerHTML = "";
      mealDetailsSection.classList.add("hidden");
      mealDetails.innerHTML = "";

      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          let resultHTML = `<h2 class="text-xl font-bold mt-6 mb-4 uppercase tracking-wide" style="letter-spacing:2px;">MEALS</h2>`;
          if (data.meals) {
            categoriesWithThumb.classList.remove("hidden"); // Show categories if meals found
            resultHTML += `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">`;
            data.meals.forEach((meal) => {
              resultHTML += `
                <div class="bg-white shadow rounded overflow-hidden">
                  <img src="${meal.strMealThumb}" class="w-full h-32 object-cover" />
                  <div class="p-3">
                    <span class="block text-xs font-bold text-orange-500 mb-1">${meal.strCategory}</span>
                    <span class="block text-xs text-gray-700 mb-2">${meal.strArea || ""}</span>
                    <h3 class="font-bold text-base mb-1">${meal.strMeal}</h3>
                    <button class="mt-2 bg-orange-500 text-white px-3 py-1 rounded text-sm" onclick="location.hash='meal=${meal.idMeal}&cat=${meal.strCategory}'">View Details</button>
                  </div>
                </div>`;
            });
            resultHTML += `</div>`;
          } else {
            categoriesWithThumb.classList.add("hidden"); 
            resultHTML += `<p class="text-center text-gray-800 text-xl mt-10">No food found</p>`;
          }
          searchResultArea.innerHTML = resultHTML;
        })
        .catch(() => {
          categoriesWithThumb.classList.add("hidden"); 
          searchResultArea.innerHTML = `<p class="text-center text-gray-700 text-lg mt-10">No food found</p>`;
        });
    }

    // Load meal details 
    function loadMealDetails(id, category) {
      searchResultArea.innerHTML = "";
      searchArea.classList.add("hidden");
      categoriesWithThumb.classList.add("hidden");
      categorySection.classList.add("hidden");
      mealDetailsSection.classList.remove("hidden");

      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => res.json())
        .then((data) => {
          const meal = data.meals[0];
          const ingredientsArr = [],
            measuresArr = [];
          for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`],
              meas = meal[`strMeasure${i}`];
            if (ing && ing.trim() !== "") ingredientsArr.push(ing);
            if (meas && meas.trim() !== "") measuresArr.push(meas);
          }

          let ingredientsHTML =
            '<div class="bg-orange-600 rounded px-5 py-5"><h3 class="font-bold text-lg mb-3 text-white">Ingredients</h3><div class="grid grid-cols-2 gap-y-2">';
          ingredientsArr.forEach((ing, idx) => {
            ingredientsHTML += `
              <div class="flex items-center mb-2">
                <span class="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-sm mr-2">${idx + 1}</span>
                <span class="text-white">${ing}</span>
              </div>`;
          });
          ingredientsHTML += "</div></div>";

          let measuresHTML =
            '<div class="border border-gray-700 bg-white rounded px-4 py-3"><span class="font-bold block mb-2 text-gray-600">Measure:</span><div class="grid grid-cols-2 gap-y-2">';
          measuresArr.forEach((m) => {
            measuresHTML += `<div class="flex items-center mb-1"><i class="fa-solid fa-spoon text-orange-500 mr-2"></i> ${m}</div>`;
          });
          measuresHTML += "</div></div>";

          let tagHTML = "";
          if (meal.strTags) {
            tagHTML = meal.strTags
              .split(",")
              .map(
                (t) =>
                  `<span class="inline-block rounded bg-orange-50 border border-orange-600 px-2 py-1 text-xs text-orange-600 font-semibold mr-2 mb-1">${t}</span>`
              )
              .join("");
          }

          let instructionsHTML = "";
          if (meal.strInstructions) {
            const steps = meal.strInstructions
              .split(/\r?\n/)
              .filter((step) => step.trim() !== "");
            instructionsHTML = steps
              .map(
                (step) => `
              <p class="flex items-start gap-2 mb-2">
                <i class="fa-regular fa-square-check text-orange-500 mt-1"></i>
                <span>${step}</span>
              </p>
            `
              )
              .join("");
          }

          let sourceHTML = meal.strSource
            ? `<span class="font-bold">Source:</span>
            <a href="${meal.strSource}" target="_blank" class="text-blue-700 underline break-all">${meal.strSource}</a>`
            : "";

          mealDetails.innerHTML = `
            <div class="flex flex-col md:flex-row gap-x-10 gap-y-6">
              <div class="md:w-1/2 flex flex-col items-center">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="rounded w-full max-w-lg" />
                <div class="w-full mt-4">${measuresHTML}</div>
              </div>
              <div class="md:w-1/2 mt-2 md:mt-0 flex flex-col">
                <div>
                  <div class="mb-2"><span class="font-bold">CATEGORY:</span> <span class="uppercase">${meal.strCategory || ""}</span></div>
                  ${sourceHTML ? `<div class="mb-2">${sourceHTML}</div>` : ""}
                  ${meal.strArea ? `<div class="mb-2"><span class="font-bold">Area:</span> <span>${meal.strArea}</span></div>` : ""}
                  ${tagHTML ? `<div class="mb-2"><span class="font-bold">Tags:</span> ${tagHTML}</div>` : ""}
                </div>
                <div class="mt-5">${ingredientsHTML}</div>
              </div>
            </div>
            <h3 class="mt-8 font-semibold text-lg">Instructions</h3>
            <div class="mt-2 text-gray-700 leading-relaxed">${instructionsHTML}</div>
            <div class="mt-10">
              <div class="mb-2 flex items-end gap-2">
                <h3 class="text-lg font-bold tracking-widest uppercase" style="letter-spacing:2px;">CATEGORIES</h3>
              </div>
              <hr class="w-20 h-1 bg-orange-500 mb-6" />
              <div id="mealDetailCategories" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>
            </div>
          `;

          // Load categories for meal details bottom section
          fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
            .then((res) => res.json())
            .then((catData) => {
              const container = document.getElementById("mealDetailCategories");
              container.innerHTML = "";
              catData.categories.forEach((cat) => {
                const catCard = document.createElement("div");
                catCard.className = "bg-white shadow-lg relative text-center cursor-pointer hover:shadow-xl rounded";
                catCard.innerHTML = `
                  <img src="${cat.strCategoryThumb}" class="w-full h-32 object-cover p-2" />
                  <div class="absolute py-1 px-2 text-sm text-white bg-orange-500 rounded top-0 right-0 m-1">${cat.strCategory}</div>
                `;
                catCard.onclick = () => {
                  location.hash = `category=${cat.strCategory}`;
                };
                container.appendChild(catCard);
              });
            });
        });
    }

    // Search functionality
    searchBtn.addEventListener("click", () => {
      searchMeals(searchInput.value);
    });
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchMeals(searchInput.value);
      }
    });

    
    window.addEventListener("hashchange", handleRoute);
    window.addEventListener("load", handleRoute);

    function handleRoute() {
      const hash = location.hash.substring(1);
      searchResultArea.innerHTML = "";
      categoriesWithThumb.classList.remove("hidden");
      mealDetailsSection.classList.add("hidden");
      categorySection.classList.add("hidden");
      if (!hash) {
        searchArea.classList.remove("hidden");
        return;
      }
      searchArea.classList.add("hidden");
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
      categoriesWithThumb.classList.add("hidden");
      mealDetailsSection.classList.add("hidden");
      categorySection.classList.remove("hidden");

      categoryDescription.innerHTML = "";
      mealsContainer.innerHTML = "";

      fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then((res) => res.json())
        .then((data) => {
          const categ = data.categories.find((c) => c.strCategory === category);
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
        .then((res) => res.json())
        .then((data) => {
          mealsContainer.innerHTML = "";
          data.meals.forEach((meal) => {
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