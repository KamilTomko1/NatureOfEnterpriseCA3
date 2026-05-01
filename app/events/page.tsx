"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

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

function formatExpectedAttendance(expectedAttendance?: number) {
  if (expectedAttendance === undefined || expectedAttendance === null) {
    return "not available";
  }

  return expectedAttendance + " people";
}

function getEventDateTime(event: EventItem) {
  const dateTime = new Date(event.date + "T" + event.time).getTime();

  if (Number.isNaN(dateTime)) {
    return 0;
  }

  return dateTime;
}

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [panelView, setPanelView] = useState("main");
  const [textSize, setTextSize] = useState(100);
  const [theme, setTheme] = useState("dark");
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
  const resetDialogRef = useRef<HTMLDivElement | null>(null);
  const cancelResetButtonRef = useRef<HTMLButtonElement | null>(null);
  const resetRecommendationsButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const savedEventTitle = localStorage.getItem("selectedEventTitle");

    if (savedEventTitle) {
      setSelectedEventTitle(savedEventTitle);
    }
  }, []);

  useEffect(() => {
    if (selectedEventTitle) {
      localStorage.setItem("selectedEventTitle", selectedEventTitle);
    } else {
      localStorage.removeItem("selectedEventTitle");
    }
  }, [selectedEventTitle]);

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

  const selectedEvent =
    events.find((event) => event.title === selectedEventTitle) || null;

  const visibleEvents =
    activeFilter === "All"
      ? events
      : events.filter((event) => event.category === activeFilter);

  const recommendedEvents = selectedEvent
    ? events
        .filter(
          (event) =>
            event.category === selectedEvent.category &&
            event.title !== selectedEvent.title
        )
        .sort((firstEvent, secondEvent) => {
          return getEventDateTime(firstEvent) - getEventDateTime(secondEvent);
        })
    : [];

  function selectEvent(event: EventItem) {
    setSelectedEventTitle(event.title);
  }

  function openResetDialog() {
    setIsResetDialogOpen(true);

    setTimeout(() => {
      cancelResetButtonRef.current?.focus();
    }, 50);
  }

  function closeResetDialog() {
    setIsResetDialogOpen(false);

    setTimeout(() => {
      resetRecommendationsButtonRef.current?.focus();
    }, 0);
  }

  function resetRecommendations() {
    setSelectedEventTitle("");
    setIsResetDialogOpen(false);
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
    setTheme("dark");
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

  function trapResetDialogFocus(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const dialog = resetDialogRef.current;

    if (!dialog) {
      return;
    }

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>("button:not([disabled])")
    );

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

    if (isPanelOpen || isResetDialogOpen) {
      mainContent?.setAttribute("aria-hidden", "true");
      mainContent?.setAttribute("inert", "");
    } else {
      mainContent?.removeAttribute("aria-hidden");
      mainContent?.removeAttribute("inert");
    }

    if (isPanelOpen) {
      setTimeout(() => {
        closePanelButtonRef.current?.focus();
      }, 50);
    }

    return () => {
      mainContent?.removeAttribute("aria-hidden");
      mainContent?.removeAttribute("inert");
    };
  }, [isPanelOpen, isResetDialogOpen]);

  useEffect(() => {
    function handleKeyboardShortcuts(event: KeyboardEvent) {
      if (event.key === "Escape" && isResetDialogOpen) {
        event.preventDefault();
        closeResetDialog();
        return;
      }

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
  }, [isPanelOpen, isResetDialogOpen, panelView]);

  return (
    <div className={theme === "dark" ? "theme-dark" : "theme-light"} style={{ fontSize: textSize + "%" }}>
      <header className="site-header">
        <h1>Events</h1>

        <nav className="site-nav" aria-label="Main navigation">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/timetable">Timetable</Link>
            </li>
            <li>
              <Link href="/events">Events</Link>
            </li>
            <li>
              <Link href="/info">Info</Link>
            </li>
            <li>
              <Link href="/help">Help</Link>
            </li>
          </ul>
        </nav>
      </header>

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

      {isResetDialogOpen && <div id="resetDialogOverlay"></div>}

      {isResetDialogOpen && (
        <div
          id="resetRecommendationsDialog"
          ref={resetDialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resetDialogTitle"
          tabIndex={-1}
          onKeyDown={trapResetDialogFocus}
        >
          <h2 id="resetDialogTitle">Reset recommendations</h2>

          <p id="resetDialogDescription">
            Are you sure you want to reset recommendations? This will clear the selected event and hide the recommended section.
          </p>

          <div className="reset-dialog-actions">
            <button
              type="button"
              ref={cancelResetButtonRef}
              aria-label="Cancel reset recommendations"
              onClick={closeResetDialog}
            >
              Cancel
            </button>

            <button
              type="button"
              aria-label="Reset recommendations"
              onClick={resetRecommendations}
            >
              Reset recommendations
            </button>
          </div>
        </div>
      )}

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

      <main id="main-content" className="page-content">
        <section className="filter-section" aria-labelledby="filter-heading">
          <h2 id="filter-heading">Filter events</h2>

          <div id="filterButtons" role="group" aria-label="Event category filters">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setSelectedEventTitle("");
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
          </p>
        </section>

        <section className="events-section" aria-labelledby="events-heading">
          <h2 id="events-heading">Upcoming events</h2>

          <div className="events-grid">
            {visibleEvents.map((event) => {
              const readableDate = formatDate(event.date);
              const readableTime = formatTime(event.time);
              const readableAttendance = formatExpectedAttendance(event.expected_attendance);
              const isSelected = selectedEventTitle === event.title;

              return (
                <article
                  key={event.title}
                  className={isSelected ? "event-card selected-event-card" : "event-card"}
                  tabIndex={0}
                  role="button"
                  aria-label={`${event.title}. ${isSelected ? "Selected event. " : ""}Category ${event.category}. Date ${readableDate}. Time ${readableTime}. Location ${event.location}. Expected attendance ${readableAttendance}. Press Enter or Space to select this event.`}
                  onClick={() => selectEvent(event)}
                  onKeyDown={(keyboardEvent) => {
                    if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                      keyboardEvent.preventDefault();
                      selectEvent(event);
                    }
                  }}
                >
                  {isSelected && <p className="selected-event-label">Selected event</p>}
                  <h3>{event.title}</h3>
                  <p>Category: {event.category}</p>
                  <p>Date: {readableDate}</p>
                  <p>Time: {readableTime}</p>
                  <p>Location: {event.location}</p>
                  {event.expected_attendance !== undefined && (
                    <p>Expected attendance: {event.expected_attendance} people</p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {selectedEvent && (
          <section className="recommendations-section" aria-labelledby="recommended-events-heading">
            <h2 id="recommended-events-heading">Recommended events</h2>

            <p>Selected event: {selectedEvent.title}.</p>
            <p>Recommended because these events are in the same category: {selectedEvent.category}.</p>

            <button
              type="button"
              ref={resetRecommendationsButtonRef}
              className="reset-recommendations-button"
              onClick={openResetDialog}
            >
              Reset recommendations
            </button>

            {recommendedEvents.length > 0 ? (
              <div className="recommendations-grid">
                {recommendedEvents.map((event) => {
                  const readableDate = formatDate(event.date);
                  const readableTime = formatTime(event.time);
                  const readableAttendance = formatExpectedAttendance(event.expected_attendance);

                  return (
                    <article
                      key={"recommended-" + event.title}
                      className="event-card"
                      tabIndex={0}
                      role="button"
                      aria-label={`Recommended event. ${event.title}. Category ${event.category}. Date ${readableDate}. Time ${readableTime}. Location ${event.location}. Expected attendance ${readableAttendance}. Press Enter or Space to select this event.`}
                      onClick={() => selectEvent(event)}
                      onKeyDown={(keyboardEvent) => {
                        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                          keyboardEvent.preventDefault();
                          selectEvent(event);
                        }
                      }}
                    >
                      <h3>{event.title}</h3>
                      <p>Category: {event.category}</p>
                      <p>Date: {readableDate}</p>
                      <p>Time: {readableTime}</p>
                      <p>Location: {event.location}</p>
                      {event.expected_attendance !== undefined && (
                        <p>Expected attendance: {event.expected_attendance} people</p>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <p>No similar events found in this category.</p>
            )}
          </section>
        )}
      </main>

      <footer className="site-footer">
        <p>Campus Life Companion App</p>
      </footer>
    </div>
  );
}