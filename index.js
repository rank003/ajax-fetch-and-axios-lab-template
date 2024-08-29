import * as Carousel from "./Carousel.js"; // Import Carousel functions
import axios from "axios"; // Import Axios for HTTP requests

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_gD9KL7fWH23YikQO6cxjJF7CHCn5k17Q21rIkpvNGNrfFbaHv3NArobb7UjLIrnO"; // Replace with your actual API key

// Set up Axios defaults
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using axios.
 * - Create new <option> elements for each breed and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
async function initialLoad() {
  try {
    // Fetching the breeds data from the API
    const response = await axios.get("/breeds");
    const breeds = response.data;

    // Populate breedSelect with options
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Call the breed selection handler to initialize the carousel
    handleBreedSelect();

    // Attach the event listener to the breedSelect element
    breedSelect.addEventListener("change", handleBreedSelect);
  } catch (error) {
    console.error("Error loading breeds:", error);
  }
}

// Call initialLoad immediately
initialLoad();

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using axios.
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
async function handleBreedSelect() {
  try {
    const breedSelect = document.getElementById("breedSelect");
    const breedId = breedSelect.value;

    // Fetch breed images and information from the Cat API
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );
    const images = response.data;

    // Log the images data to inspect its structure
    console.log("Images data:", images);

    // Clear existing carousel images and information
    Carousel.clear();
    const infoDump = document.getElementById("infoDump");
    infoDump.innerHTML = ""; // Clear previous information

    // Process each object in the response array
    images.forEach((imageData) => {
      // Log imageData to inspect its structure
      console.log("Image data:", imageData);

      const imageUrl = imageData.url;
      const breedInfo = imageData.breeds ? imageData.breeds[0] : null;

      if (breedInfo) {
        // Create a carousel item
        const carouselItem = Carousel.createCarouselItem(
          imageUrl,
          `Image of ${breedInfo.name}`,
          imageData.id
        );
        Carousel.appendCarousel(carouselItem);

        // Create informational elements
        const breedInfoElement = document.createElement("div");
        breedInfoElement.classList.add("breed-info");

        // Populate breed information creatively
        breedInfoElement.innerHTML = `
          <h3>${breedInfo.name}</h3>
          <p>${breedInfo.description}</p>
          <ul>
            <li><strong>Temperament:</strong> ${breedInfo.temperament}</li>
            <li><strong>Origin:</strong> ${breedInfo.origin}</li>
            <li><strong>Life Span:</strong> ${breedInfo.life_span} years</li>
          </ul>
        `;
        infoDump.appendChild(breedInfoElement);
      } else {
        console.warn("Breed information is not available for this image.");
      }
    });
  } catch (error) {
    console.error("Error fetching  the breed information:", error);
  }
}

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */
axios.interceptors.request.use((config) => {
  console.log("Request started:", config.url);
  document.body.style.cursor = "progress";
  progressBar.style.width = "0%"; // Reset progress bar

  return config;
});

axios.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.config.url);
    document.body.style.cursor = "default";

    return response;
  },
  (error) => {
    console.error("Request error:", error);
    document.body.style.cursor = "default";

    return Promise.reject(error);
  }
);

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */
function updateProgress(event) {
  const percentage = Math.round((event.loaded * 100) / event.total);
  progressBar.style.width = `${percentage}%`;
}

axios.defaults.onDownloadProgress = updateProgress;

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  try {
    const response = await axios.get("/favourites");
    const favourites = response.data;
    console.log(favourites);
    const existingFavourite = favourites.find((fav) => fav.image_id === imgId);

    if (existingFavourite) {
      // If already favourited, delete
      await axios.delete(`/favourites/${existingFavourite.id}`);

      // Optionally, remove the image from the carousel and details
      removeImageFromCarousel(imgId);
      removeBreedDetails(imgId);
    } else {
      // If not, post as a new favourite
      await axios.post("/favourites", { image_id: imgId });

      // Optionally, re-fetch and update the carousel to include the new favourite
      updateCarousel();
    }
  } catch (error) {
    console.error("Error in favouriting image:", error);
  }
}

// Helper function to remove image from the carousel
function removeImageFromCarousel(imgId) {
  const carouselItem = document.querySelector(`[data-image-id="${imgId}"]`);
  if (carouselItem) {
    carouselItem.remove();
  }
}

// Helper function to remove breed details from the page
function removeBreedDetails(imgId) {
  const breedInfoElement = document.querySelector(
    `.breed-info[data-image-id="${imgId}"]`
  );
  if (breedInfoElement) {
    breedInfoElement.remove();
  }
}

// Helper function to update the carousel (e.g., re-fetch data)
async function updateCarousel() {
  try {
    // Fetch the updated list of favourites
    const response = await axios.get("/favourites");
    const favourites = response.data;

    // Clear the current carousel
    Carousel.clear();

    if (favourites.length === 0) {
      // Display a message if there are no favourites
      displayNoFavouritesMessage();
    } else {
      // Populate with updated favourites
      favourites.forEach((fav) => {
        const carouselItem = Carousel.createCarouselItem(
          fav.image.url,
          "Favorite Image",
          fav.image_id
        );
        Carousel.appendCarousel(carouselItem);
      });
    }
  } catch (error) {
    console.error("Error updating carousel:", error);
  }
}

// Helper function to display a message when there are no favourites
function displayNoFavouritesMessage() {
  const infoDump = document.getElementById("infoDump");
  infoDump.innerHTML = "<p>No favourites added.</p>";
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */
getFavouritesBtn.addEventListener("click", getFavourites);

async function getFavourites() {
  try {
    const response = await axios.get("/favourites");
    const favourites = response.data;

    // Clear the current carousel
    Carousel.clear();

    // Populate with favourites
    favourites.forEach((fav) => {
      const carouselItem = Carousel.createCarouselItem(
        fav.image.url,
        "Favorite Image",
        fav.image_id
      );
      Carousel.appendCarousel(carouselItem); // Updated from Carousel.add to Carousel.appendCarousel
    });
  } catch (error) {
    console.error("Error fetching favourites:", error);
  }
}
/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If you notice something strange here, check your work above and in the API documentation.
 *  - Your code should be robust enough to handle what happens here.
 * - Check your console logs to ensure your interceptors are working as expected.
 * - Check your favourites to ensure you are getting what you expect.
 * - Experiment with creative ways to display breed data within the infoDump element.
 * - Commit your changes to CodeSandbox and submit the assignment in your learning management system.
 */
