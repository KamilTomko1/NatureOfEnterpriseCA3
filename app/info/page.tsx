"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type CampusInfoItem = {
  id: number;
  building_name: string;
  room: string;
  room_type: string;
  floor: number;
};

type SocietyItem = {
  id: number;
  name: string;
  category: string;
  description: string;
  meeting_day: string;
};

export default function InfoPage() {
  const [campusInfo, setCampusInfo] = useState<CampusInfoItem[]>([]);
  const [societies, setSocieties] = useState<SocietyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadMessage, setLoadMessage] = useState("");

  useEffect(() => {
    async function loadInfoPageData() {
      const campusInfoResult = await supabase
        .from("campus_info")
        .select("id, building_name, room, room_type, floor")
        .order("building_name", { ascending: true })
        .order("floor", { ascending: true });

      const societiesResult = await supabase
        .from("societies")
        .select("id, name, category, description, meeting_day")
        .order("name", { ascending: true });

      if (campusInfoResult.error || societiesResult.error) {
        setLoadMessage("Campus information could not be loaded from the database.");
        setCampusInfo([]);
        setSocieties([]);
        setIsLoading(false);
        return;
      }

      setCampusInfo((campusInfoResult.data as CampusInfoItem[]) || []);
      setSocieties((societiesResult.data as SocietyItem[]) || []);
      setLoadMessage("");
      setIsLoading(false);
    }

    loadInfoPageData();
  }, []);

  return (
    <div className="theme-dark">
      <header className="site-header">
        <h1>Campus info</h1>

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
        <section className="info-intro" aria-labelledby="info-heading">
          <h2 id="info-heading">Useful campus information</h2>

          <p>
            This page shows campus rooms, buildings, and student societies from the database.
          </p>

          <p aria-live="polite">
            {isLoading
              ? "Loading campus information."
              : loadMessage
              ? loadMessage
              : `Showing ${campusInfo.length} campus locations and ${societies.length} societies.`}
          </p>
        </section>

        <section className="info-section" aria-labelledby="campus-locations-heading">
          <h2 id="campus-locations-heading">Campus locations</h2>

          {campusInfo.length > 0 ? (
            <div className="campus-info-list">
              {campusInfo.map((item) => (
                <article className="campus-info-item" key={item.id}>
                  <h3>{item.building_name}</h3>
                  <p>Room: {item.room}</p>
                  <p>Room type: {item.room_type}</p>
                  <p>Floor: {item.floor}</p>
                </article>
              ))}
            </div>
          ) : (
            !isLoading && <p>No campus location records found.</p>
          )}
        </section>

        <section className="info-section" aria-labelledby="societies-heading">
          <h2 id="societies-heading">Student societies</h2>

          {societies.length > 0 ? (
            <div className="society-list">
              {societies.map((society) => (
                <article className="society-item" key={society.id}>
                  <h3>{society.name}</h3>
                  <p>Category: {society.category}</p>
                  <p>{society.description}</p>
                  <p>Meeting day: {society.meeting_day}</p>
                </article>
              ))}
            </div>
          ) : (
            !isLoading && <p>No society records found.</p>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>Campus Life Companion App</p>
      </footer>
    </div>
  );
}