"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function HelpPage() {
  const [studentName, setStudentName] = useState("");
  const [category, setCategory] = useState("timetable");
  const [issue, setIssue] = useState("");
  const [formStatus, setFormStatus] = useState("");

  async function submitHelpTicket(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormStatus("Submitting your help request.");

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("helpdesk_tickets").insert([
      {
        student_name: studentName,
        category: category,
        issue: issue,
        status: "submitted",
        date_submitted: today,
      },
    ]);

    if (error) {
      setFormStatus("There was a problem submitting your help request.");
      return;
    }

    setStudentName("");
    setCategory("timetable");
    setIssue("");
    setFormStatus("Your help request has been submitted.");
  }

  return (
    <div className="theme-dark">
      <header className="site-header">
        <h1>Help desk</h1>

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
        <section className="help-intro" aria-labelledby="help-heading">
          <h2 id="help-heading">Student help desk</h2>

          <p>
            Use this page to send a help request if you are having a problem
            with timetable information, events, campus information,
            accessibility, or another student support issue.
          </p>

          <p>Phone number: +353 1 220 5000</p>

          <p>Email: helpdesk@campus.ie</p>
        </section>

        <section className="help-options" aria-labelledby="help-options-heading">
          <h2 id="help-options-heading">Quick help areas</h2>

          <div className="help-option-list">
            <section>
              <h3>Timetable</h3>
              <p>
                Use this category if your timetable information is missing,
                unclear, or incorrect.
              </p>
            </section>

            <section>
              <h3>Events</h3>
              <p>
                Use this category if you need help with campus events or event
                details.
              </p>
            </section>

            <section>
              <h3>Campus info</h3>
              <p>
                Use this category if you need help finding campus information.
              </p>
            </section>

            <section>
              <h3>Accessibility</h3>
              <p>
                Use this category if something is difficult to use with a screen
                reader, keyboard, contrast, or text size.
              </p>
            </section>
          </div>
        </section>

        <section className="help-form-section" aria-labelledby="help-form-heading">
          <h2 id="help-form-heading">Submit a help request</h2>

          <form onSubmit={submitHelpTicket} className="help-form">
            <div className="form-field">
              <label htmlFor="student_name">Student name</label>
              <input
                id="student_name"
                name="student_name"
                type="text"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              >
                <option value="timetable">Timetable</option>
                <option value="events">Events</option>
                <option value="campus info">Campus info</option>
                <option value="accessibility">Accessibility</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="issue">Issue</label>
              <textarea
                id="issue"
                name="issue"
                value={issue}
                onChange={(event) => setIssue(event.target.value)}
                rows={6}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-help-button">
              Submit help request
            </button>

            <p aria-live="polite">{formStatus}</p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <p>Campus Life Companion App</p>
      </footer>
    </div>
  );
}