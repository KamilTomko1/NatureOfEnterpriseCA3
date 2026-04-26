const accessibilityButton = document.getElementById("accessibilityButton");
const accessibilityPanel = document.getElementById("accessibilityPanel");
const closePanelButton = document.getElementById("closePanelButton");
const panelOverlay = document.getElementById("panelOverlay");

const mainPanelView = document.getElementById("mainPanelView");

const textSizeButton = document.getElementById("textSizeButton");
const textSizePanelView = document.getElementById("textSizePanelView");
const backToMainPanelButton = document.getElementById("backToMainPanelButton");
const decreaseTextSizeButton = document.getElementById("decreaseTextSizeButton");
const increaseTextSizeButton = document.getElementById("increaseTextSizeButton");
const textSizeValue = document.getElementById("textSizeValue");

const keyboardNavigationButton = document.getElementById("keyboardNavigationButton");
const keyboardNavigationPanelView = document.getElementById("keyboardNavigationPanelView");
const backFromKeyboardNavigationButton = document.getElementById("backFromKeyboardNavigationButton");

const highContrastButton = document.getElementById("highContrastButton");
const highContrastPanelView = document.getElementById("highContrastPanelView");
const backFromHighContrastButton = document.getElementById("backFromHighContrastButton");
const lightModeButton = document.getElementById("lightModeButton");
const darkModeButton = document.getElementById("darkModeButton");

const resetSettingsButton = document.getElementById("resetSettingsButton");

let currentTextSize = 100;
const defaultTextSize = 100;
const minTextSize = 10;
const maxTextSize = 200;
const textSizeStep = 10;

let currentView = "main";
let currentTheme = "light";
let lastFocusedElement = null;

function saveSettings() {
  localStorage.setItem("accessibilityTextSize", String(currentTextSize));
  localStorage.setItem("accessibilityTheme", currentTheme);
}

function loadSettings() {
  const savedTextSize = parseInt(localStorage.getItem("accessibilityTextSize"), 10);
  const savedTheme = localStorage.getItem("accessibilityTheme");

  if (!isNaN(savedTextSize) && savedTextSize >= minTextSize && savedTextSize <= maxTextSize) {
    currentTextSize = savedTextSize;
  } else {
    currentTextSize = defaultTextSize;
  }

  if (savedTheme === "dark" || savedTheme === "light") {
    currentTheme = savedTheme;
  } else {
    currentTheme = "light";
  }
}

function getFocusableElements() {
  return accessibilityPanel.querySelectorAll(
    'button:not([hidden]):not([disabled]), [href]:not([hidden]), input:not([hidden]):not([disabled]), select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), [tabindex]:not([tabindex="-1"]):not([hidden])'
  );
}

function trapFocus(event) {
  if (event.key !== "Tab" || accessibilityPanel.hidden) {
    return;
  }

  const focusableElements = Array.from(getFocusableElements()).filter(function (element) {
    return element.offsetParent !== null;
  });

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

function openPanel() {
  lastFocusedElement = document.activeElement;

  accessibilityPanel.hidden = false;
  panelOverlay.hidden = false;

  requestAnimationFrame(function () {
    accessibilityPanel.classList.add("open");
  });

  accessibilityButton.setAttribute("aria-expanded", "true");
  closePanelButton.focus();
}

function closePanel() {
  accessibilityPanel.classList.remove("open");
  accessibilityButton.setAttribute("aria-expanded", "false");

  setTimeout(function () {
    accessibilityPanel.hidden = true;
    panelOverlay.hidden = true;
    showMainPanelView(false);

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    } else {
      accessibilityButton.focus();
    }
  }, 300);
}

function togglePanel() {
  if (accessibilityPanel.hidden) {
    openPanel();
  } else {
    closePanel();
  }
}

function hideAllSubViews() {
  textSizePanelView.hidden = true;
  keyboardNavigationPanelView.hidden = true;
  highContrastPanelView.hidden = true;
}

function showMainPanelView(moveFocus = true) {
  mainPanelView.hidden = false;
  hideAllSubViews();
  currentView = "main";

  if (moveFocus) {
    closePanelButton.focus();
  }
}

function showTextSizeView() {
  mainPanelView.hidden = true;
  hideAllSubViews();
  textSizePanelView.hidden = false;
  currentView = "textSize";
  backToMainPanelButton.focus();
}

function showKeyboardNavigationView() {
  mainPanelView.hidden = true;
  hideAllSubViews();
  keyboardNavigationPanelView.hidden = false;
  currentView = "keyboardNavigation";
  backFromKeyboardNavigationButton.focus();
}

function showHighContrastView() {
  mainPanelView.hidden = true;
  hideAllSubViews();
  highContrastPanelView.hidden = false;
  currentView = "highContrast";
  backFromHighContrastButton.focus();
}

function goBackOneStep() {
  if (currentView === "textSize") {
    showMainPanelView(false);
    textSizeButton.focus();
    return;
  }

  if (currentView === "keyboardNavigation") {
    showMainPanelView(false);
    keyboardNavigationButton.focus();
    return;
  }

  if (currentView === "highContrast") {
    showMainPanelView(false);
    highContrastButton.focus();
  }
}

function updateTextSize() {
  document.documentElement.style.fontSize = currentTextSize + "%";
  textSizeValue.textContent = currentTextSize + "%";
  saveSettings();
}

function increaseTextSize() {
  if (currentTextSize < maxTextSize) {
    currentTextSize += textSizeStep;
    updateTextSize();
  }
}

function decreaseTextSize() {
  if (currentTextSize > minTextSize) {
    currentTextSize -= textSizeStep;
    updateTextSize();
  }
}

function setStylesForElements(elements, backgroundColor, textColor, borderStyle) {
  elements.forEach(function (element) {
    element.style.backgroundColor = backgroundColor;
    element.style.color = textColor;

    if (borderStyle !== null) {
      element.style.border = borderStyle;
    }
  });
}

function applyTheme(theme) {
  const isDarkMode = theme === "dark";
  const backgroundColor = isDarkMode ? "#000000" : "#ffffff";
  const panelBackgroundColor = isDarkMode ? "#111111" : "#ffffff";
  const textColor = isDarkMode ? "#ffffff" : "#000000";
  const secondaryBackgroundColor = isDarkMode ? "#1a1a1a" : "#f5f5f5";
  const borderStyle = isDarkMode ? "1px solid #ffffff" : "1px solid #000000";

  currentTheme = theme;

  document.documentElement.style.backgroundColor = backgroundColor;
  document.documentElement.style.color = textColor;

  document.body.style.backgroundColor = backgroundColor;
  document.body.style.color = textColor;

  accessibilityPanel.style.backgroundColor = panelBackgroundColor;
  accessibilityPanel.style.color = textColor;
  accessibilityPanel.style.border = borderStyle;

  accessibilityButton.style.backgroundColor = panelBackgroundColor;
  accessibilityButton.style.color = textColor;
  accessibilityButton.style.border = borderStyle;

  closePanelButton.style.backgroundColor = panelBackgroundColor;
  closePanelButton.style.color = textColor;
  closePanelButton.style.border = borderStyle;

  textSizeValue.style.backgroundColor = secondaryBackgroundColor;
  textSizeValue.style.color = textColor;
  textSizeValue.style.border = borderStyle;

  const allButtons = document.querySelectorAll("button");
  setStylesForElements(allButtons, panelBackgroundColor, textColor, borderStyle);

  const allHeadings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  setStylesForElements(allHeadings, "transparent", textColor, null);

  const allParagraphs = document.querySelectorAll("p");
  setStylesForElements(allParagraphs, "transparent", textColor, null);

  const allLinks = document.querySelectorAll("a");
  setStylesForElements(allLinks, "transparent", textColor, null);

  const allInputs = document.querySelectorAll("input, textarea, select");
  setStylesForElements(allInputs, panelBackgroundColor, textColor, borderStyle);

  saveSettings();
}

function applyLightMode() {
  applyTheme("light");
  lightModeButton.focus();
}

function applyDarkMode() {
  applyTheme("dark");
  darkModeButton.focus();
}

function resetSettings() {
  currentTextSize = defaultTextSize;
  currentTheme = "light";

  document.documentElement.style.fontSize = defaultTextSize + "%";
  textSizeValue.textContent = defaultTextSize + "%";

  applyTheme("light");
  saveSettings();

  showMainPanelView(false);

  if (resetSettingsButton) {
    resetSettingsButton.focus();
  }
}

accessibilityButton.addEventListener("click", togglePanel);
closePanelButton.addEventListener("click", closePanel);
panelOverlay.addEventListener("click", closePanel);

textSizeButton.addEventListener("click", showTextSizeView);
backToMainPanelButton.addEventListener("click", goBackOneStep);
increaseTextSizeButton.addEventListener("click", increaseTextSize);
decreaseTextSizeButton.addEventListener("click", decreaseTextSize);

keyboardNavigationButton.addEventListener("click", showKeyboardNavigationView);
backFromKeyboardNavigationButton.addEventListener("click", goBackOneStep);

highContrastButton.addEventListener("click", showHighContrastView);
backFromHighContrastButton.addEventListener("click", goBackOneStep);
lightModeButton.addEventListener("click", applyLightMode);
darkModeButton.addEventListener("click", applyDarkMode);

if (resetSettingsButton) {
  resetSettingsButton.addEventListener("click", resetSettings);
}

document.addEventListener("keydown", function (event) {
  if (event.altKey && event.key.toLowerCase() === "a") {
    event.preventDefault();
    togglePanel();
    return;
  }

  if (event.altKey && event.key === "ArrowLeft" && !accessibilityPanel.hidden) {
    if (currentView !== "main") {
      event.preventDefault();
      goBackOneStep();
    }
    return;
  }

  if (event.key === "Escape" && !accessibilityPanel.hidden) {
    event.preventDefault();

    if (currentView !== "main") {
      goBackOneStep();
    } else {
      closePanel();
    }
    return;
  }

  if (event.key === "Tab" && !accessibilityPanel.hidden) {
    trapFocus(event);
  }
});

loadSettings();
updateTextSize();
applyTheme(currentTheme);