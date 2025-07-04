import './style.css'

const catImage = document.getElementById("catImage");
const breedSelect = document.getElementById("breedSelect");
const showCatButton = document.getElementById("showCatButton");
const favoriteButton = document.getElementById("favoriteButton");
const breedInfo = document.getElementById("breedInfo");
const favoritesList = document.getElementById("favorites");

const apiKey = import.meta.env.VITE_CAT_API_KEY;

let breeds = [];
let currentCatData = null;
let currentBreedData = null;

async function loadBreeds() {
  try {
    const response = await fetch("https://api.thecatapi.com/v1/breeds", {
      headers: {
        "x-api-key": apiKey
      }
    });

    breeds = await response.json();

    breeds.forEach(breed => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading breeds:", error);
  }
}

async function fetchCat() {
  const selectedBreedId = breedSelect.value;
  let url = "https://api.thecatapi.com/v1/images/search";

  if (selectedBreedId) {
    url += `?breed_ids=${selectedBreedId}`;
  } else {
    url += "?include_breeds=true";
  }

  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey
      }
    });

    const data = await response.json();
    const cat = data[0];
    currentCatData = cat;

    catImage.src = cat.url;

    let breedData;

    if (selectedBreedId) {
      breedData = breeds.find(b => b.id === selectedBreedId);
    } else if (cat.breeds && cat.breeds.length > 0) {
      breedData = cat.breeds[0];
    }

    currentBreedData = breedData || null;

    breedInfo.innerHTML = "";

    if (breedData) {
      const nameElem = document.createElement("strong");
      nameElem.textContent = breedData.name;

      const temperamentElem = document.createElement("em");
      temperamentElem.textContent = breedData.temperament;

      const descriptionElem = document.createElement("p");
      descriptionElem.textContent = breedData.description;

      breedInfo.appendChild(nameElem);
      breedInfo.appendChild(document.createElement("br"));
      breedInfo.appendChild(temperamentElem);
      breedInfo.appendChild(document.createElement("br"));
      breedInfo.appendChild(descriptionElem);
    } else {
      breedInfo.textContent = "Breed information not available.";
    }
  } catch (error) {
    console.error("Error fetching cat:", error);
    catImage.alt = "Failed to load cat image.";
    breedInfo.textContent = "";
  }
}

function addFavorite() {
  if (!currentCatData) return;

  const listItem = document.createElement("li");

  const thumbnail = document.createElement("img");
  thumbnail.src = currentCatData.url;
  thumbnail.alt = "Favorite cat";
  listItem.appendChild(thumbnail);

  const breedLabel = document.createElement("span");
  if (currentBreedData) {
    breedLabel.textContent = currentBreedData.name;
  } 
  else {
    breedLabel.textContent = "Unknown Breed";
  }
  
  listItem.appendChild(breedLabel);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    listItem.remove();
  });

  listItem.appendChild(deleteButton);
  favoritesList.appendChild(listItem);
}

showCatButton.addEventListener("click", fetchCat);
favoriteButton.addEventListener("click", addFavorite);

loadBreeds();

