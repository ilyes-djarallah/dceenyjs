// ============================================================
// LOADING SCREEN
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  window.onload = () => {
    const loadingScreen = document.getElementById("loading-screen");
    const content = document.getElementById("content");

    loadingScreen.style.transition = "opacity 0.5s";
    loadingScreen.style.opacity = "0";

    setTimeout(() => {
      loadingScreen.style.display = "none";
      if (content) content.style.display = "block";
    }, 500);
  };
});

// ============================================================
// PROJECT ORDER OVERLAY
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const orderButton = document.getElementById("projects");
  const orderOverlay = document.getElementById("orderOverlay");
  const closeOverlay = document.getElementById("closeOverlay");

  if (orderButton && orderOverlay && closeOverlay) {
    orderButton.addEventListener("click", () => {
      orderOverlay.style.display = "flex";
    });

    closeOverlay.addEventListener("click", () => {
      orderOverlay.style.display = "none";
    });

    orderOverlay.addEventListener("click", (e) => {
      if (e.target === orderOverlay) orderOverlay.style.display = "none";
    });
  }
});

// ============================================================
// SCROLL-TO-TOP BUTTON
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopBtn = document.getElementById("scrollToTop");

  if (!scrollToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

// ============================================================
// TELEGRAM FORM SUBMISSIONS
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  function handleFormSubmission(formId, botToken, chatId, type) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const fullName = form.querySelector("#fullName")?.value;
      const phoneNumber = form.querySelector("#phoneNumber")?.value;

      let isValid = true;
      const errorMessages = form.querySelectorAll(".error-message");
      errorMessages.forEach((msg) => (msg.style.display = "none"));

      if (!fullName) {
        form.querySelector("#fullName + .error-message").style.display = "block";
        isValid = false;
      }
      if (!phoneNumber) {
        form.querySelector("#phoneNumber + .error-message").style.display = "block";
        isValid = false;
      }

      let message = `*New Submission:*\n- Full Name: ${fullName}\n- Phone Number: ${phoneNumber}`;

      if (type === "order") {
        const city = form.querySelector("#city")?.value;
        const surface = form.querySelector("#surface")?.value;
        if (!city) {
          form.querySelector("#city + .error-message").style.display = "block";
          isValid = false;
        }
        message += `\n- City: ${city}\n- Surface: ${surface || "Not provided"}`;
      } else if (type === "professional") {
        const profession = form.querySelector("#profession")?.value;
        if (!profession) {
          form.querySelector("#profession + .error-message").style.display = "block";
          isValid = false;
        }
        message += `\n- Profession: ${profession}`;
      }

      if (!isValid) return;

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
            const formWrapper = form.closest(".form-wrapper");
            formWrapper.style.height = `${formWrapper.offsetHeight}px`;
            form.style.display = "none";
            formWrapper.querySelector(".thank-you-message").style.display = "block";
          } else {
            alert("An error occurred. Please try again later.");
          }
        })
        .catch(() => {
          alert("An error occurred. Please check your internet connection.");
        });
    });
  }

  const botToken = "7526772728:AAE8xfyUfEb-zq1KL3uE0OdYlq4wLVdoPAc";
  const chatId = "7285884938";

  handleFormSubmission("orderForm", botToken, chatId, "order");
  handleFormSubmission("professionalForm", botToken, chatId, "professional");
});

// ============================================================
// SLIDESHOW
// ============================================================
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlides() {
  slides.forEach((slide) => slide.classList.remove("active"));
  if (slides.length > 0) {
    slides[currentSlide].classList.add("active");
    currentSlide = (currentSlide + 1) % slides.length;
  }
}
setInterval(showSlides, 3000);
window.addEventListener("load", showSlides);

// ============================================================
// NAVBAR DROPDOWN TOGGLE
// ============================================================
function toggleDropdown() {
  const dropdown = document.getElementById("projects-dropdown");
  if (!dropdown) return;

  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

const projectsBtn = document.getElementById("projects-btn");
if (projectsBtn) {
  projectsBtn.addEventListener("click", toggleDropdown);
}

// Force column layout for small screens
if (window.innerWidth <= 768) {
  const navbar = document.querySelector(".navbar");
  if (navbar) navbar.style.flexDirection = "column";
}

// ============================================================
// SMOOTH SCROLL DOWN FUNCTION
// ============================================================
function scrollDown() {
  const scrollTarget = window.innerHeight;
  const startPosition = window.scrollY;
  const distance = scrollTarget - startPosition;
  const duration = 900;
  const startTime = performance.now();

  function smoothScroll(currentTime) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const newPosition = startPosition + distance * progress;
    window.scrollTo(0, newPosition);
    if (progress < 1) requestAnimationFrame(smoothScroll);
  }

  requestAnimationFrame(smoothScroll);
}

// ============================================================
// COURSES PAGE FILTER, SEARCH & LAYOUT TOGGLE
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const searchTop = document.getElementById("search");
  const searchSidebar = document.getElementById("searchSidebar");
  const toggleLayoutBtn = document.getElementById("toggle-layout");
  const optionA = document.getElementById("option-a");
  const optionB = document.getElementById("option-b");
  const coursesGridA = document.getElementById("coursesGridA");
  const coursesGridB = document.getElementById("coursesGridB");

  if (!coursesGridA) return; // Only run if on courses page

  const cards = Array.from(coursesGridA.querySelectorAll(".course-card"));
  cards.forEach((card) => coursesGridB.appendChild(card.cloneNode(true)));

  const selectedSoftwares = new Set();
  let priceFilter = "all";

  function getSoftwareTags(cardEl) {
    const raw = cardEl.getAttribute("data-software") || "";
    return raw.split(",").map((s) => s.trim().toLowerCase());
  }

  function getNumericPrice(cardEl) {
    const priceEl = cardEl.querySelector(".course-price");
    const num = parseFloat(priceEl?.textContent.replace(/[^\d.]/g, "")) || 0;
    return num;
  }

  function matchesSearch(cardEl, q) {
    if (!q) return true;
    q = q.trim().toLowerCase();
    const title = cardEl.querySelector(".course-title")?.textContent.toLowerCase() || "";
    const desc = cardEl.querySelector(".course-desc")?.textContent.toLowerCase() || "";
    return title.includes(q) || desc.includes(q);
  }

  function matchesPrice(cardEl) {
    const price = getNumericPrice(cardEl);
    if (priceFilter === "under50") return price < 50;
    if (priceFilter === "50to80") return price >= 50 && price <= 80;
    if (priceFilter === "80plus") return price > 80;
    return true;
  }

  function matchesSoftware(cardEl) {
    if (selectedSoftwares.size === 0) return true;
    const tags = getSoftwareTags(cardEl);
    return Array.from(selectedSoftwares).some((s) => tags.includes(s));
  }

  function applyFilters(grid, q) {
    const cards = grid.querySelectorAll(".course-card");
    cards.forEach((card) => {
      const show =
        matchesSearch(card, q) && matchesSoftware(card) && matchesPrice(card);
      card.style.display = show ? "" : "none";
    });
  }

  function applyAllFilters() {
    const q1 = searchTop?.value || "";
    const q2 = searchSidebar?.value || "";
    applyFilters(coursesGridA, q1);
    applyFilters(coursesGridB, q2);
  }

  searchTop?.addEventListener("input", applyAllFilters);
  searchSidebar?.addEventListener("input", applyAllFilters);

  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const sof = chip.dataset.sof.toLowerCase();
      if (selectedSoftwares.has(sof)) {
        selectedSoftwares.delete(sof);
        chip.classList.remove("active");
      } else {
        selectedSoftwares.add(sof);
        chip.classList.add("active");
      }
      applyAllFilters();
    });
  });

  const sidebarCheckboxes = Array.from(
    document.querySelectorAll("#option-b .sidebar input[type='checkbox']")
  );
  sidebarCheckboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      selectedSoftwares.clear();
      sidebarCheckboxes.forEach((x) => {
        if (x.checked) selectedSoftwares.add(x.dataset.sof.toLowerCase());
      });
      chips.forEach((chip) => {
        chip.classList.toggle("active", selectedSoftwares.has(chip.dataset.sof));
      });
      applyAllFilters();
    });
  });

  const priceSelect = document.getElementById("priceFilter");
  priceSelect?.addEventListener("change", () => {
    priceFilter = priceSelect.value;
    applyAllFilters();
  });

  const clearBtn = document.getElementById("clearFilters");
  clearBtn?.addEventListener("click", () => {
    selectedSoftwares.clear();
    chips.forEach((c) => c.classList.remove("active"));
    sidebarCheckboxes.forEach((cb) => (cb.checked = false));
    if (priceSelect) priceSelect.value = "all";
    priceFilter = "all";
    if (searchTop) searchTop.value = "";
    if (searchSidebar) searchSidebar.value = "";
    applyAllFilters();
  });

  toggleLayoutBtn?.addEventListener("click", () => {
    const isA = !optionA.classList.contains("hide");
    if (isA) {
      optionA.classList.add("hide");
      optionB.classList.remove("hide");
      toggleLayoutBtn.textContent = "Switch to top-filter layout";
    } else {
      optionB.classList.add("hide");
      optionA.classList.remove("hide");
      toggleLayoutBtn.textContent = "Switch to sidebar layout";
    }
    applyAllFilters();
  });

  // Buy button demo
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".buy-btn");
    if (!btn) return;
    e.preventDefault();
    const card = btn.closest(".course-card");
    const title = card?.querySelector(".course-title")?.textContent || "Course";
    alert(`Buying: ${title}`);
  });

  applyAllFilters();
});
