const addons = [
  {
    title: "Vanilla Extended",
    description:
      "[Achievements] Expands the vanilla experience with new gear, materials, and structures with being achievement-friendly!",
    link: "https://www.curseforge.com/minecraft-bedrock/addons/vanilla-extended",
  },
  {
    title: "Better NightVision",
    description:
      "Toggle Night Vision Instantly, No Commands Needed! The lightweight Night Vision solution for Minecraft Bedrock (1.21+).",
    link: "https://www.curseforge.com/minecraft-bedrock/addons/better-nightvision",
  },
  {
    title: "Simple AutoSmelt",
    description:
      "Instant smelting without furnaces or lag. Smelt ores automatically the moment they drop with no waiting, no fuel, and no command spam.",
    link: "https://www.curseforge.com/minecraft-bedrock/addons/simple-autosmelt",
  },
];

export default function Addons() {
  return (
    <div className="grid">
      {addons.map((addon) => (
        <article key={addon.title} className="col-12 col-sm-6 col-md-4">
          <div className="card feature-card">
            <div className="card-header">{addon.title}</div>
            <div className="card-body">
              <p>{addon.description}</p>
            </div>
            <div className="card-footer">
              <a
                className="button button-primary"
                href={addon.link}
                target="_blank"
                rel="noreferrer"
              >
                View Add-On
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
