export function DesignPrototype() {
  return (
    <div className="design-prototype-page">
      <div className="design-prototype-toolbar">
        <div>
          <p className="prototype-eyebrow">UPDATED UI PROTOTYPE</p>
          <h1>Alumable Gamification UI</h1>
          <p>
            The supplied HTML design is embedded here as the visual reference
            while the live React screens continue to use the existing API
            integrations.
          </p>
        </div>
        {/* <a
          className="prototype-open-button"
          href="/prototype/alumable-gamification.html"
          target="_blank"
          rel="noreferrer"
        >
          Open full prototype
        </a> */}
      </div>
      <iframe
        className="design-prototype-frame"
        src="/prototype/alumable-gamification.html"
        title="Alumable Gamification updated UI prototype"
      />
    </div>
  );
}
