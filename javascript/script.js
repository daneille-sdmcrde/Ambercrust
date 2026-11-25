var menuButton = document.getElementById("menu-button");
var mainNav = document.getElementById("main-nav");

function closeMenu() {
  mainNav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

if (menuButton && mainNav) {
  menuButton.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  var navLinks = mainNav.querySelectorAll("a");
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", closeMenu);
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth > 700) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  var pageLinks = mainNav.querySelectorAll("a:not(.nav-cta)");
  var pageSections = [];

  for (var j = 0; j < pageLinks.length; j++) {
    var target = document.querySelector(pageLinks[j].getAttribute("href"));
    if (target) {
      pageSections.push({ link: pageLinks[j], section: target });
    }
  }

  function highlightActiveLink() {
    var position = window.scrollY + 120;
    var current = null;

    for (var a = 0; a < pageSections.length; a++) {
      if (pageSections[a].section.offsetTop <= position) {
        current = pageSections[a].link;
      }
    }

    for (var b = 0; b < pageSections.length; b++) {
      pageSections[b].link.classList.remove("active");
    }

    if (current) {
      current.classList.add("active");
    }
  }

  window.addEventListener("scroll", highlightActiveLink);
  highlightActiveLink();
}

var feedbackForm = document.getElementById("feedback-form");
var feedbackMessage = document.getElementById("feedback-message");
var feedbackList = document.getElementById("feedback-list");
var ratingSummary = document.getElementById("rating-summary");
var allFeedback = [];

if (feedbackForm && feedbackMessage && feedbackList && ratingSummary) {
  allFeedback = loadFeedback();

  for (var k = 0; k < allFeedback.length; k++) {
    showFeedback(allFeedback[k]);
  }
  updateSummary();

  feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("fb-name").value.trim();
    var rating = document.getElementById("fb-rating").value;
    var comment = document.getElementById("fb-comment").value.trim();

    if (name === "" || rating === "" || comment === "") {
      showMessage(feedbackMessage, "Please enter your name, a rating, and a comment.", "error");
      return;
    }

    var entry = { name: name, rating: Number(rating), comment: comment };
    allFeedback.push(entry);
    saveFeedback();
    showFeedback(entry);
    updateSummary();

    showMessage(feedbackMessage, "Thank you for your feedback!", "success");
    feedbackForm.reset();
  });
}

function loadFeedback() {
  try {
    var saved = localStorage.getItem("ambercrustFeedback");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    return [];
  }
  return [];
}

function saveFeedback() {
  try {
    localStorage.setItem("ambercrustFeedback", JSON.stringify(allFeedback));
  } catch (error) {
    return;
  }
}

function showFeedback(entry) {
  var item = document.createElement("div");
  item.className = "feedback-item";

  var title = document.createElement("strong");
  title.textContent = entry.name + " - " + entry.rating + " / 5";

  var text = document.createElement("p");
  text.textContent = entry.comment;

  item.appendChild(title);
  item.appendChild(text);
  feedbackList.insertBefore(item, feedbackList.firstChild);
}

function updateSummary() {
  if (allFeedback.length === 0) {
    ratingSummary.textContent = "No ratings yet. Be the first to leave one.";
    return;
  }

  var total = 0;
  for (var i = 0; i < allFeedback.length; i++) {
    total = total + allFeedback[i].rating;
  }

  var average = total / allFeedback.length;
  ratingSummary.textContent =
    "Average rating: " + average.toFixed(1) + " / 5 (" + allFeedback.length + " review" +
    (allFeedback.length === 1 ? "" : "s") + ")";
}

function showMessage(element, text, type) {
  element.textContent = text;
  element.className = "form-message " + type;
}