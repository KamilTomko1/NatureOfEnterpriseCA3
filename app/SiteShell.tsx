"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelView, setPanelView] = useState("main");
  const [textSize, setTextSize] = useState(100);

  const accessibilityButtonRef = useRef<HTMLButtonElement | null>(null);
  const accessibilityPanelRef = useRef<HTMLElement | null>(null);
  const closePanelButtonRef = useRef<HTMLButtonElement | null>(null);
  const textSizeButtonRef = useRef<HTMLButtonElement | null>(null);
  const keyboardNavigationButtonRef = useRef<HTMLButtonElement | null>(null);
  const highContrastButtonRef = useRef<HTMLButtonElement | null>(null);
  const resetSettingsButtonRef = useRef<HTMLButtonElement | null>(null);
  const backToMainPanelButtonRef = useRef<HTMLButtonElement | null>(null);
  const backFromKeyboardNavigationButtonRef = useRef<HTMLButtonElement | null>(null);
  const backFromHighContrastButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const savedTextSize = localStorage.getItem("selectedTextSize");

    if (savedTextSize) {
      setTextSize(Number(savedTextSize));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedTextSize", String(textSize));
    document.documentElement.style.fontSize = textSize + "%";
  }, [textSize]);

  function openPanel() {
    setIsPanelOpen(true);
  }

  function closePanel() {
    setIsPanelOpen(false);
    setPanelView("main");

    setTimeout(() => {
      accessibilityButtonRef.current?.focus();
    }, 0);
  }

  function goBackOneStep() {
    if (panelView === "textSize") {
      setPanelView("main");

      setTimeout(() => {
        textSizeButtonRef.current?.focus();
      }, 0);

      return;
    }

    if (panelView === "keyboardNavigation") {
      setPanelView("main");

      setTimeout(() => {
        keyboardNavigationButtonRef.current?.focus();
      }, 0);

      return;
    }

    if (panelView === "highContrast") {
      setPanelView("main");

      setTimeout(() => {
        highContrastButtonRef.current?.focus();
      }, 0);
    }
  }

  function resetSettings() {
    setTextSize(100);
    setPanelView("main");

    setTimeout(() => {
      resetSettingsButtonRef.current?.focus();
    }, 0);
  }

  function increaseTextSize() {
    setTextSize((currentSize) => {
      if (currentSize >= 200) {
        return currentSize;
      }

      return currentSize + 10;
    });
  }

  function decreaseTextSize() {
    setTextSize((currentSize) => {
      if (currentSize <= 10) {
        return currentSize;
      }

      return currentSize - 10;
    });
  }

  function setLightMode() {
    const pageTheme = document.querySelector(".theme-dark, .theme-light");

    if (pageTheme) {
      pageTheme.classList.remove("theme-dark");
      pageTheme.classList.add("theme-light");
    }
  }

  function setDarkMode() {
    const pageTheme = document.querySelector(".theme-dark, .theme-light");

    if (pageTheme) {
      pageTheme.classList.remove("theme-light");
      pageTheme.classList.add("theme-dark");
    }
  }

  function trapFocus(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const panel = accessibilityPanelRef.current;

    if (!panel) {
      return;
    }

    const focusableElements = Array.from(
      panel.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])"
      )
    ).filter((element) => element.offsetParent !== null);

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  useEffect(() => {
    if (isPanelOpen) {
      setTimeout(() => {
        closePanelButtonRef.current?.focus();
      }, 50);
    }
  }, [isPanelOpen]);

  useEffect(() => {
    function handleKeyboardShortcuts(event: KeyboardEvent) {
      if (event.altKey && event.key.toLowerCase() === "a") {
        event.preventDefault();

        if (isPanelOpen) {
          closePanel();
        } else {
          openPanel();
        }

        return;
      }

      if (event.key === "Escape" && isPanelOpen) {
        event.preventDefault();

        if (panelView !== "main") {
          goBackOneStep();
        } else {
          closePanel();
        }

        return;
      }

      if (event.altKey && event.key === "ArrowLeft" && isPanelOpen) {
        event.preventDefault();
        goBackOneStep();
      }
    }

    document.addEventListener("keydown", handleKeyboardShortcuts);

    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcuts);
    };
  }, [isPanelOpen, panelView]);

  if (pathname === "/events") {
    return <>{children}</>;
  }

  return (
    <>
      <button
        id="accessibilityButton"
        ref={accessibilityButtonRef}
        type="button"
        aria-label="Open accessibility panel"
        aria-controls="accessibilityPanel"
        aria-expanded={isPanelOpen}
        onClick={openPanel}
      >
        Accessibility
      </button>

      {isPanelOpen && <div id="panelOverlay" onClick={closePanel}></div>}

      <aside
        id="accessibilityPanel"
        ref={accessibilityPanelRef}
        aria-label="Accessibility panel"
        tabIndex={-1}
        hidden={!isPanelOpen}
        className={isPanelOpen ? "open" : ""}
        onKeyDown={trapFocus}
      >
        <button
          id="closePanelButton"
          ref={closePanelButtonRef}
          type="button"
          aria-label="Close accessibility panel"
          onClick={closePanel}
        >
          Close
        </button>

        {panelView === "main" && (
          <div id="mainPanelView">
            <h2 id="panelTitle">Accessibility settings</h2>

            <button
              id="textSizeButton"
              ref={textSizeButtonRef}
              type="button"
              onClick={() => {
                setPanelView("textSize");

                setTimeout(() => {
                  backToMainPanelButtonRef.current?.focus();
                }, 50);
              }}
            >
              Text size
            </button>

            <button
              id="keyboardNavigationButton"
              ref={keyboardNavigationButtonRef}
              type="button"
              onClick={() => {
                setPanelView("keyboardNavigation");

                setTimeout(() => {
                  backFromKeyboardNavigationButtonRef.current?.focus();
                }, 50);
              }}
            >
              Keyboard navigation
            </button>

            <button
              id="highContrastButton"
              ref={highContrastButtonRef}
              type="button"
              onClick={() => {
                setPanelView("highContrast");

                setTimeout(() => {
                  backFromHighContrastButtonRef.current?.focus();
                }, 50);
              }}
            >
              High contrast
            </button>

            <button
              id="resetSettingsButton"
              ref={resetSettingsButtonRef}
              type="button"
              onClick={resetSettings}
            >
              Reset settings
            </button>
          </div>
        )}

        {panelView === "textSize" && (
          <div id="textSizePanelView">
            <button
              id="backToMainPanelButton"
              ref={backToMainPanelButtonRef}
              type="button"
              onClick={goBackOneStep}
            >
              Back
            </button>

            <h2 id="textSizePanelTitle">Text size</h2>

            <button type="button" onClick={decreaseTextSize}>
              Decrease
            </button>

            <p id="textSizeValue" aria-live="polite">
              {textSize}%
            </p>

            <button type="button" onClick={increaseTextSize}>
              Increase
            </button>
          </div>
        )}

        {panelView === "keyboardNavigation" && (
          <div id="keyboardNavigationPanelView">
            <button
              id="backFromKeyboardNavigationButton"
              ref={backFromKeyboardNavigationButtonRef}
              type="button"
              onClick={goBackOneStep}
            >
              Back
            </button>

            <h2 id="keyboardNavigationPanelTitle">Keyboard navigation</h2>

            <p>Alt plus A opens or closes the accessibility panel.</p>
            <p>Escape closes the panel or goes back one step.</p>
            <p>Alt plus Left Arrow goes back one step.</p>
            <p>Tab moves to the next control.</p>
            <p>Shift plus Tab moves to the previous control.</p>
            <p>Enter activates a button.</p>
            <p>Space activates a button.</p>
          </div>
        )}

        {panelView === "highContrast" && (
          <div id="highContrastPanelView">
            <button
              id="backFromHighContrastButton"
              ref={backFromHighContrastButtonRef}
              type="button"
              onClick={goBackOneStep}
            >
              Back
            </button>

            <h2 id="highContrastPanelTitle">High contrast</h2>

            <button type="button" onClick={setLightMode}>
              Light mode
            </button>

            <button type="button" onClick={setDarkMode}>
              Dark mode
            </button>
          </div>
        )}
      </aside>

      {children}
    </>
  );
}