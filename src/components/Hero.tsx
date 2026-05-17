import SkinViewer from "./SkinViewer";

export default function Hero() {
  return (
    <div className="card hero-card">
      <div className="hero-layout">
        <div className="hero-copy">
          <h1>Hello! I&apos;m rezn1r</h1>
          <p>
            I am a Minecraft enthusiast and an add-on developer, and I also work
            with WanMine Studios.
            <br />
            I created this page to share my projects, updates, and links in one
            place. Feel free to explore and get in touch if you want to
            collaborate or just say hi!
          </p>
          <div className="hero-actions">
            <a className="button button-secondary" href="#contact">
              Get in Touch
            </a>
          </div>
        </div>
        <SkinViewer />
      </div>
    </div>
  );
}
