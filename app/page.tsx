import Link from "next/link";

export default function HomePage() {
  return (
    <div className="theme-dark">
      <header className="site-header">
        <h1>Campus Life Companion</h1>

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
        <section className="home-hero" aria-labelledby="home-heading">
          <div>
            <p className="home-small-heading">Student support app</p>

            <h2 id="home-heading">Welcome to Campus Life Companion</h2>

            <p>
              This app is designed to help students quickly find the most important campus information in one place.
              You can check events, view timetable information, read campus details, and contact the help desk when you need support.
            </p>

            <Link href="/events" className="primary-home-link">
              Browse campus events
            </Link>
          </div>
        </section>

        <section className="home-overview" aria-labelledby="overview-heading">
          <h2 id="overview-heading">What you can do here</h2>

          <div className="overview-list">
            <section>
              <h3>Find events</h3>
              <p>
                View upcoming college events and use simple recommendations to find similar events based on category.
              </p>
            </section>

            <section>
              <h3>Check timetable information</h3>
              <p>
                Use the timetable page to keep track of class information and important student schedules.
              </p>
            </section>

            <section>
              <h3>Get campus information</h3>
              <p>
                Read useful student information about services, locations, and support available on campus.
              </p>
            </section>

            <section>
              <h3>Contact the help desk</h3>
              <p>
                Use the help page when you need support, contact details, or guidance on who to ask.
              </p>
            </section>
          </div>
        </section>

        <section className="home-updates" aria-labelledby="updates-heading">
          <h2 id="updates-heading">Student notices</h2>

          <div className="notice-list">
            <article>
              <h3>Events are updated regularly</h3>
              <p>
                Check the Events page to see what is happening on campus and find activities linked to your interests.
              </p>
            </article>

            <article>
              <h3>Need help quickly?</h3>
              <p>
                The Help desk page includes contact details and support information for students.
              </p>
            </article>

            <article>
              <h3>Accessibility support included</h3>
              <p>
                The app includes accessibility options to support different users, including text size and contrast settings.
              </p>
            </article>
          </div>
        </section>

        <section className="home-next-steps" aria-labelledby="next-steps-heading">
          <h2 id="next-steps-heading">Where to go next</h2>

          <p>
            Start with the Events page if you want to explore what is happening on campus, or use the navigation at the top of the page to move around the app.
          </p>

          <div className="home-link-row">
            <Link href="/timetable">Open timetable</Link>
            <Link href="/events">Open events</Link>
            <Link href="/info">Open campus info</Link>
            <Link href="/help">Open help desk</Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Campus Life Companion App</p>
      </footer>
    </div>
  );
}