"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";

type EventItem = {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  expected_attendance?: number;
};

const fallbackEvents: EventItem[] = [
  {
    title: "First Year Coding Lab",
    category: "Technology",
    date: "25 April 2026",
    time: "14:00",
    location: "Room 101",
  },
  {
    title: "AI and Future Careers Talk",
    category: "Technology",
    date: "27 April 2026",
    time: "12:00",
    location: "Hall 2",
  },
  {
    title: "CV and LinkedIn Drop-in Session",
    category: "Career",
    date: "29 April 2026",
    time: "11:00",
    location: "Room 204",
  },
  {
    title: "Meet Industry Guests Talk",
    category: "Career",
    date: "30 April 2026",
    time: "15:00",
    location: "Hall 1",
  },
  {
    title: "Campus Social Night",
    category: "Social",
    date: "02 May 2026",
    time: "18:00",
    location: "Hall 3",
  },
  {
    title: "Web Development Lab and Q and A",
    category: "Workshops",
    date: "04 May 2026",
    time: "13:00",
    location: "Lab 3",
  },
];

const filters = ["All", "Technology", "Career", "Social", "Workshops"];

function formatDate(dateValue: string) {
  if (!dateValue) {
    return "No date available";
  }

  if (!dateValue.includes("-")) {
    return dateValue;
  }

  const dateParts = dateValue.split("-");

  if (dateParts.length !== 3) {
    return dateValue;
  }

  const year = Number(dateParts[0]);
  const month = Number(dateParts[1]) - 1;
  const day = Number(dateParts[2]);

  const dateObject = new Date(year, month, day);

  return dateObject.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(timeValue: string) {
  if (!timeValue) {
    return "No time available";
  }

  const timeParts = timeValue.split(":");

  if (timeParts.length < 2) {
    return timeValue;
  }

  return timeParts[0] + ":" + timeParts[1];
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelView, setPanelView] = useState("main");
  const [textSize, setTextSize] = useState(100);
  const [theme, setTheme] = useState("light");

  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventLoadError, setEventLoadError] = useState("");

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
    async function loadEventsFromSupabase() {
      const { data, error } = await supabase
        .from("Events")
        .select("title, category, date, time, location, expected_attendance")
        .order("date", { ascending: true });

      if (error || !data || data.length === 0) {
        setEvents(fallbackEvents);
        setEventLoadError("Events could not be loaded from the database, so backup events are being shown.");
        setIsLoadingEvents(false);
        return;
      }

      setEvents(data as EventItem[]);
      setEventLoadError("");
      setIsLoadingEvents(false);
    }

    loadEventsFromSupabase();
  }, []);

  const visibleEvents =
    activeFilter === "All"
      ? events
      : events.filter((event) => event.category === activeFilter);

  function selectEvent(eventTitle: string) {
    setSelectedEvent(eventTitle);
  }

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
    setTheme("light");
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
    const mainContent = document.getElementById("main-content");

    if (isPanelOpen) {
      mainContent?.setAttribute("aria-hidden", "true");
      mainContent?.setAttribute("inert", "");

      setTimeout(() => {
        closePanelButtonRef.current?.focus();
      }, 50);
    } else {
      mainContent?.removeAttribute("aria-hidden");
      mainContent?.removeAttribute("inert");
    }

    return () => {
      mainContent?.removeAttribute("aria-hidden");
      mainContent?.removeAttribute("inert");
    };
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

  return (
    <div className={theme === "dark" ? "theme-dark" : "theme-light"} style={{ fontSize: textSize + "%" }}>
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
              aria-label="Text size settings"
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
              aria-label="Keyboard navigation settings"
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
              aria-label="High contrast settings"
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
              aria-label="Reset accessibility settings"
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
              aria-label="Go back to accessibility settings"
              onClick={goBackOneStep}
            >
              Back
            </button>

            <h2 id="textSizePanelTitle">Text size</h2>

            <button
              id="decreaseTextSizeButton"
              type="button"
              aria-label="Decrease text size"
              onClick={decreaseTextSize}
            >
              Decrease
            </button>

            <p id="textSizeValue" aria-live="polite">
              {textSize}%
            </p>

            <button
              id="increaseTextSizeButton"
              type="button"
              aria-label="Increase text size"
              onClick={increaseTextSize}
            >
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
              aria-label="Go back to accessibility settings"
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
            <p>Enter activates a button or event card.</p>
            <p>Space activates a button or event card.</p>
            <p>H moves between headings in many screen readers.</p>
            <p>B moves between buttons in many screen readers.</p>
            <p>K moves between links in many screen readers.</p>
            <p>G moves between graphics or images in many screen readers.</p>
            <p>F moves between form fields in many screen readers.</p>
          </div>
        )}

        {panelView === "highContrast" && (
          <div id="highContrastPanelView">
            <button
              id="backFromHighContrastButton"
              ref={backFromHighContrastButtonRef}
              type="button"
              aria-label="Go back to accessibility settings"
              onClick={goBackOneStep}
            >
              Back
            </button>

            <h2 id="highContrastPanelTitle">High contrast</h2>

            <button
              id="lightModeButton"
              type="button"
              aria-label="Light mode"
              onClick={() => setTheme("light")}
            >
              Light mode
            </button>

            <button
              id="darkModeButton"
              type="button"
              aria-label="Dark mode"
              onClick={() => setTheme("dark")}
            >
              Dark mode
            </button>
          </div>
        )}
      </aside>

      <main id="main-content">
        <header>
          <h1>Events</h1>
        </header>

        <section aria-labelledby="filter-heading">
          <h2 id="filter-heading">Filter events</h2>

          <div id="filterButtons" role="group" aria-label="Event category filters">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setSelectedEvent("");
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <p id="filterStatus" aria-live="polite">
            {isLoadingEvents
              ? "Loading events from the database."
              : eventLoadError
              ? eventLoadError
              : `Showing ${visibleEvents.length} ${activeFilter === "All" ? "events" : activeFilter + " events"}.`}
            {selectedEvent ? " Selected event: " + selectedEvent + "." : ""}
          </p>
        </section>

        <section aria-labelledby="events-heading">
          <h2 id="events-heading">Upcoming events</h2>

          {visibleEvents.map((event) => {
            const readableDate = formatDate(event.date);
            const readableTime = formatTime(event.time);

            return (
              <article
                key={event.title}
                tabIndex={0}
                role="button"
                aria-label={`${event.title}. Category ${event.category}. Date ${readableDate}. Time ${readableTime}. Location ${event.location}. Press Enter or Space to select this event.`}
                onClick={() => selectEvent(event.title)}
                onKeyDown={(keyboardEvent) => {
                  if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                    keyboardEvent.preventDefault();
                    selectEvent(event.title);
                  }
                }}
              >
                <h3>{event.title}</h3>
                <p>Category: {event.category}</p>
                <p>Date: {readableDate}</p>
                <p>Time: {readableTime}</p>
                <p>Location: {event.location}</p>
                {event.expected_attendance !== undefined && (
                  <p>Expected attendance: {event.expected_attendance}</p>
                )}
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}