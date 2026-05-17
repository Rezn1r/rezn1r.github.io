import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Addons from "@/components/Addons";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="home">
        <section className="container">
          <Hero />
          <hr className="no-padding" />
          <h2 id="features" className="section-title">
            My Addons
          </h2>
          <Addons />
          <div className="align-center section-title">
            <a
              className="button button-secondary"
              href="https://www.curseforge.com/members/rezn1r/projects"
              target="_blank"
              rel="noreferrer"
            >
              View All Add-Ons
            </a>
          </div>
          <hr style={{ margin: "40px 0" }} />
          <Contact />
          <p className="footer-note">
            Built with{" "}
            <a href="https://github.com/Jiyath5516F/Minecraft-CSS">
              Minecraft CSS
            </a>
            . Not affiliated with Mojang or Microsoft.
          </p>
        </section>
      </main>
    </>
  );
}
