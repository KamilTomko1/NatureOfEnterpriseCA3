"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type TimetableItem = {
  id: number;
  Module: string;
  Lecturer: string;
  Day: string;
  Time: string;
  Room: string;
  Coarse: string;
  year: number;
};

export default function TimetablePage() {
  const [timetableItems, setTimetableItems] = useState<TimetableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadMessage, setLoadMessage] = useState("");

  useEffect(() => {
    async function loadTimetable() {
      const { data, error } = await supabase
        .from("Timetable")
        .select("id, Module, Lecturer, Day, Time, Room, Coarse, year")
        .order("Day", { ascending: true })
        .order("Time", { ascending: true });

      if (error) {
        setLoadMessage("Timetable information could not be loaded from the database.");
        setTimetableItems([]);
        setIsLoading(false);
        return;
      }

      setTimetableItems((data as TimetableItem[]) || []);
      setLoadMessage("");
      setIsLoading(false);
    }

    loadTimetable();
  }, []);

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

  return (
    <div className="theme-dark">
      <header className="site-header">
        <h1>Timetable</h1>

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

      <main id="main-content" className="page-content">
        <section className="timetable-intro" aria-labelledby="timetable-heading">
          <h2 id="timetable-heading">Student timetable</h2>

          <p>
            This page shows timetable information from the database so students can check modules, lecturers, rooms, days, and times.
          </p>
        </section>

        <section className="timetable-section" aria-labelledby="timetable-list-heading">
          <h2 id="timetable-list-heading">Timetable details</h2>

          <p aria-live="polite">
            {isLoading
              ? "Loading timetable information."
              : loadMessage
              ? loadMessage
              : `Showing ${timetableItems.length} timetable records.`}
          </p>

          {timetableItems.length > 0 ? (
            <div className="timetable-list">
              {timetableItems.map((item) => (
                <article className="timetable-card" key={item.id}>
                  <h3>{item.Module}</h3>
                  <p>Lecturer: {item.Lecturer}</p>
                  <p>Day: {item.Day}</p>
                  <p>Time: {formatTime(item.Time)}</p>
                  <p>Room: {item.Room}</p>
                  <p>Course: {item.Coarse}</p>
                  <p>Year: {item.year}</p>
                </article>
              ))}
            </div>
          ) : (
            !isLoading && <p>No timetable records found.</p>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>Campus Life Companion App</p>
      </footer>
    </div>
  );
}