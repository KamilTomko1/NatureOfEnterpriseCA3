const filterButtons = document.querySelectorAll(".filter-button");
const eventCards = document.querySelectorAll(".event-card");
const filterStatus = document.getElementById("filterStatus");

function updateFilterButtons(activeFilter) {
  filterButtons.forEach(function (button) {
    if (button.dataset.filter === activeFilter) {
      button.setAttribute("aria-pressed", "true");
    } else {
      button.setAttribute("aria-pressed", "false");
    }
  });
}

function updateFilterStatus(activeFilter, visibleCount) {
  if (activeFilter === "all") {
    filterStatus.textContent = "Showing all " + visibleCount + " events.";
  } else {
    filterStatus.textContent =
      "Showing " + visibleCount + " " + activeFilter + " events.";
  }
}

function filterEvents(selectedFilter) {
  let visibleCount = 0;

  eventCards.forEach(function (card) {
    const cardCategory = card.dataset.category;

    if (selectedFilter === "all" || cardCategory === selectedFilter) {
      card.hidden = false;
      visibleCount = visibleCount + 1;
    } else {
      card.hidden = true;
      card.classList.remove("selected-event");
      card.setAttribute("aria-pressed", "false");
    }
  });

  updateFilterButtons(selectedFilter);
  updateFilterStatus(selectedFilter, visibleCount);
}

function clearSelectedEvents() {
  eventCards.forEach(function (card) {
    card.classList.remove("selected-event");
    card.setAttribute("aria-pressed", "false");
  });
}

function selectEvent(card) {
  clearSelectedEvents();
  card.classList.add("selected-event");
  card.setAttribute("aria-pressed", "true");

  const eventTitle = card.querySelector("h3").textContent;
  filterStatus.textContent = "Selected event: " + eventTitle + ".";
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const selectedFilter = button.dataset.filter;
    filterEvents(selectedFilter);
  });
});

eventCards.forEach(function (card) {
  card.setAttribute("aria-pressed", "false");

  card.addEventListener("click", function () {
    if (!card.hidden) {
      selectEvent(card);
    }
  });

  card.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (!card.hidden) {
        selectEvent(card);
      }
    }
  });
});

filterEvents("all");