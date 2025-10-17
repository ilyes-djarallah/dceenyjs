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
// BUY COURSE OVERLAY — FINAL WORKING VERSION (SAFE FOR DYNAMIC CONTENT)
// ============================================================

function initBuyOverlay() {
  const buyOverlay = document.getElementById("buyOverlay");
  const closeBuyOverlay = document.getElementById("closeBuyOverlay");
  const buyForm = document.getElementById("buyCourseForm");
  const botToken = "7526772728:AAE8xfyUfEb-zq1KL3uE0OdYlq4wLVdoPAc";
  const chatId = "7285884938";

  if (!buyOverlay || !buyForm) {
    console.warn("Buy overlay or form not found in DOM.");
    return;
  }

  console.log("✅ Buy Overlay initialized.");

  // 🟢 Event delegation — works even if course cards are dynamically added
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".buy-btn");
    if (!btn) return;

    e.preventDefault();

    const card = btn.closest(".course-card");
    const title =
      card?.querySelector(".course-title")?.textContent.trim() ||
      "Unknown Course";

    // Fill course name into hidden input
    const titleInput = document.getElementById("buyCourseTitle");
    if (titleInput) titleInput.value = title;

    // Reset form + thank you message
    buyForm.style.display = "block";
    const thankYou = buyOverlay.querySelector(".buy-thank-you");
    if (thankYou) thankYou.style.display = "none";

    // Show overlay
    buyOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";

    console.log(`🛒 Buy clicked for: ${title}`);
  });

  // 🧩 Close overlay manually
  if (closeBuyOverlay) {
    closeBuyOverlay.addEventListener("click", () => {
      buyOverlay.style.display = "none";
      document.body.style.overflow = "";
      console.log("❌ Overlay closed (manual).");
    });
  }

  // 🧩 Close overlay when clicking outside
  buyOverlay?.addEventListener("click", (e) => {
    if (e.target === buyOverlay) {
      buyOverlay.style.display = "none";
      document.body.style.overflow = "";
      console.log("❌ Overlay closed (outside click).");
    }
  });

  // 🧩 Handle form submission
  buyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("buyName").value.trim();
    const phone = document.getElementById("buyPhone").value.trim();
    const type = document.getElementById("buyCourseType").value;
    const course = document.getElementById("buyCourseTitle").value.trim();
    const message = document.getElementById("buyMessage").value.trim();

    let valid = true;
    document
      .querySelectorAll(".buy-error-message")
      .forEach((el) => (el.style.display = "none"));

    if (!name) {
      document.querySelector("#buyName + .buy-error-message").style.display =
        "block";
      valid = false;
    }
    if (!phone) {
      document.querySelector("#buyPhone + .buy-error-message").style.display =
        "block";
      valid = false;
    }
    if (!type) {
      document.querySelector("#buyCourseType + .buy-error-message").style.display =
        "block";
      valid = false;
    }

    if (!valid) return;

    const telegramMsg = `*New Course Purchase:*\n📘 Course: ${course}\n🎓 Type: ${type}\n👤 Name: ${name}\n📞 Phone: ${phone}\n📝 Message: ${
      message || "None"
    }`;

    try {
      console.log("📤 Sending Telegram message...");
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMsg,
            parse_mode: "Markdown",
          }),
        }
      );

      if (response.ok) {
        buyForm.style.display = "none";
        buyOverlay.querySelector(".buy-thank-you").style.display = "block";
        console.log("✅ Telegram message sent successfully.");
      } else {
        alert("Error sending message. Please try again later.");
        console.error("❌ Telegram API responded with error.");
      }
    } catch (err) {
      alert("Connection error. Please check your internet connection.");
      console.error("❌ Network error while sending Telegram message:", err);
    }
  });
}

// 🟢 Initialize overlay AFTER all content loads (including jQuery header/footer)
window.addEventListener("load", () => {
  setTimeout(() => {
    console.log("🚀 Initializing Buy Overlay after full load...");
    initBuyOverlay();
  }, 800); // short delay ensures dynamic content is in DOM
});
