// script.js
document.addEventListener("DOMContentLoaded", () => {
  // Wait for the page to load all assets
  window.onload = () => {
    const loadingScreen = document.getElementById("loading-screen");
    const content = document.getElementById("content");

    // Add a fade-out effect (optional)
    loadingScreen.style.transition = "opacity 0.5s";
    loadingScreen.style.opacity = "0";

    // Wait for the fade-out effect to finish before hiding
    setTimeout(() => {
      loadingScreen.style.display = "none";
      content.style.display = "block"; // Show the content
    }, 500); // Match the fade-out duration
  };
});
document.addEventListener("DOMContentLoaded", () => {
  const orderButton = document.getElementById("projects");
  const orderOverlay = document.getElementById("orderOverlay");
  const closeOverlay = document.getElementById("closeOverlay");

  // Show the overlay when the order button is clicked
  orderButton.addEventListener("click", () => {
    orderOverlay.style.display = "flex"; // Display as flex to center content
  });

  // Hide the overlay when the close button is clicked
  closeOverlay.addEventListener("click", () => {
    orderOverlay.style.display = "none";
  });

  // Hide overlay if user clicks outside the form
  orderOverlay.addEventListener("click", (e) => {
    if (e.target === orderOverlay) {
      orderOverlay.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopBtn = document.getElementById("scrollToTop");

  // Show or hide the button when scrolling
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  // Scroll smoothly to the top when the button is clicked
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Enables smooth scrolling
    });
  });
});

/*============================================================================================================================*/
document.addEventListener("DOMContentLoaded", function () {
  // Function to handle form submissions
  function handleFormSubmission(formId, botToken, chatId, type) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission behavior

      // Collect form data
      const fullName = form.querySelector("#fullName").value;
      const phoneNumber = form.querySelector("#phoneNumber").value;

      let isValid = true;
      const errorMessages = form.querySelectorAll(".error-message");
      errorMessages.forEach((msg) => (msg.style.display = "none")); // Hide all error messages initially

      // Validate required fields
      if (!fullName) {
        form.querySelector("#fullName + .error-message").style.display =
          "block";
        isValid = false;
      }
      if (!phoneNumber) {
        form.querySelector("#phoneNumber + .error-message").style.display =
          "block";
        isValid = false;
      }

      let message = `*New Submission:*\n- Full Name: ${fullName}\n- Phone Number: ${phoneNumber}`;

      if (type === "order") {
        const city = form.querySelector("#city").value;
        const surface = form.querySelector("#surface").value;
        if (!city) {
          form.querySelector("#city + .error-message").style.display = "block";
          isValid = false;
        }
        message += `\n- City: ${city}\n- Surface: ${surface || "Not provided"}`;
      } else if (type === "professional") {
        const profession = form.querySelector("#profession").value;
        if (!profession) {
          form.querySelector("#profession + .error-message").style.display =
            "block";
          isValid = false;
        }
        message += `\n- Profession: ${profession}`;
      }

      if (!isValid) return; // Stop if validation fails

      // Send the message using Telegram's Bot API
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      })
        .then((response) => {
          if (response.ok) {
            // Get the current height of the form-wrapper and fix it
            const formWrapper = form.closest(".form-wrapper");
            formWrapper.style.height = `${formWrapper.offsetHeight}px`;

            // Hide the form and show the thank-you message
            form.style.display = "none";
            formWrapper.querySelector(".thank-you-message").style.display =
              "block";
          } else {
            console.error("Failed to send message to Telegram:", response);
            alert("An error occurred. Please try again later.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred. Please check your internet connection.");
        });
    });
  }

  // Replace with your actual bot token and chat IDpreventDefault
  const botToken = "7526772728:AAE8xfyUfEb-zq1KL3uE0OdYlq4wLVdoPAc";
  const chatId = "7285884938";

  // Attach handlers for each form
  handleFormSubmission("orderForm", botToken, chatId, "order");
  handleFormSubmission("professionalForm", botToken, chatId, "professional");
});

/*============================================================================================================================*/

// Function to fetch translations from lang.json (for later use)
async function fetchTranslations() {
  const response = await fetch("lang.json");
  return await response.json();
}

// Initialize the current slide index
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

// Function to show slides every 3 seconds
function showSlides() {
  // Remove 'active' class from all slides
  slides.forEach((slide) => slide.classList.remove("active"));

  // Add 'active' class to the current slide
  slides[currentSlide].classList.add("active");

  // Increment slide index or reset if at the end
  currentSlide = (currentSlide + 1) % slides.length;
}

// Run slideshow every 3 seconds
setInterval(showSlides, 3000);

// Start the slideshow on load
window.addEventListener("load", showSlides);

// Function to toggle the dropdown visibility on small screens
function toggleDropdown() {
  var dropdown = document.getElementById("projects-dropdown");

  // Toggle the dropdown visibility by adjusting display property
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none"; // Hide it if it's visible
  } else {
    dropdown.style.display = "block"; // Show it if it's hidden
  }
}

// Add event listener to the "Projects" button
document
  .getElementById("projects-btn")
  .addEventListener("click", toggleDropdown);

// Inline JS to force column layout on mobile screens
if (window.innerWidth <= 768) {
  document.querySelector(".navbar").style.flexDirection = "column";
}

// Function to scroll down with a smooth and slow effect
function scrollDown() {
  const scrollTarget = window.innerHeight; // The distance to scroll (one full screen height)
  const startPosition = window.scrollY; // Current scroll position
  const distance = scrollTarget - startPosition; // The total distance to scroll
  const duration = 900; // Duration of the scroll in milliseconds (slower scroll)
  const startTime = performance.now(); // Start time for the animation

  // Function for smooth scrolling
  function smoothScroll(currentTime) {
    const timeElapsed = currentTime - startTime; // Time passed since animation started
    const progress = Math.min(timeElapsed / duration, 1); // Progress of the scroll (0 to 1)

    // Calculate the new scroll position
    const newPosition = startPosition + distance * progress;

    window.scrollTo(0, newPosition); // Scroll to the new position

    if (progress < 1) {
      requestAnimationFrame(smoothScroll); // Continue the animation
    }
  }

  // Start the animation
  requestAnimationFrame(smoothScroll);
}
