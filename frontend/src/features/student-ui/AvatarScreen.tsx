import { useEffect, useMemo, useState } from "react";
import {
  equipAvatarItem,
  getAvatar,
  type AvatarItem,
  type AvatarState,
} from "./avatarApi";

export function AvatarScreen({
  onEnterHub,
}: {
  onEnterHub: () => void;
}) {
  const [avatar, setAvatar] = useState<AvatarState | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("outfit");
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [equipping, setEquipping] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getAvatar()
      .then(setAvatar)
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : "Could not load avatar",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const slots = useMemo(() => {
    const values = new Set(
      (avatar?.inventory ?? []).map((item) => item.slot),
    );

    values.add("outfit");

    return [...values];
  }, [avatar]);

  const items = (avatar?.inventory ?? []).filter(
    (item) => item.slot === selectedSlot,
  );

  const outfitCode =
    avatar?.equipped.outfit?.code ?? "STARTER_TEE";

  const badgeEquipped = avatar?.equipped.badge;

  async function equip(item: AvatarItem) {
    try {
      setEquipping(item.code);
      setError("");

      const updated = await equipAvatarItem(item.code);
      setAvatar(updated);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not equip item",
      );
    } finally {
      setEquipping("");
    }
  }

  return (
    <div className="avatar-page">
      {/* Matches Learn/Profile style hero */}
      <section className="avatar-page-hero">
        <div className="avatar-page-decoration avatar-page-decoration-one" />
        <div className="avatar-page-decoration avatar-page-decoration-two" />

        <div className="avatar-page-brand-row">
          <span className="avatar-page-brand">alumable</span>

          <button
            type="button"
            className="avatar-page-icon-button"
            aria-label="Avatar settings"
          >
            <span className="material-symbols-outlined">
              accessibility_new
            </span>
          </button>
        </div>

        <div className="avatar-page-title">
          <h1>My Avatar</h1>
          <p>Make your Alumable journey your own.</p>
        </div>
      </section>

      <main className="avatar-page-content">
        {error && <div className="avatar-page-error">{error}</div>}

        {/* Main avatar card */}
        <section className="avatar-main-card">
          <div className="avatar-card-heading">
            <div>
              <h2>Your avatar</h2>
              <p>Unlocked items can be equipped here.</p>
            </div>

            <span className="avatar-status-chip">
              <span />
              Live
            </span>
          </div>

          <div className="avatar-display">
            <div
              className={`avatar-figure ${outfitCode
                .toLowerCase()
                .replaceAll("_", "-")}`}
            >
              <div className="avatar-head">
                <span className="avatar-hair" />
                <span className="avatar-face">•‿•</span>
              </div>

              <div className="avatar-body">
                <span className="avatar-shirt-mark">A</span>

                {badgeEquipped && (
                  <span className="avatar-badge">★</span>
                )}
              </div>

              <div className="avatar-legs">
                <span />
                <span />
              </div>
            </div>
          </div>

          <div className="avatar-equipped-row">
            <div className="avatar-equipped-icon">
              <span className="material-symbols-outlined">
                checkroom
              </span>
            </div>

            <div>
              <span>Currently wearing</span>
              <strong>
                {avatar?.equipped.outfit?.name ?? "Starter Tee"}
              </strong>
            </div>
          </div>
        </section>

        {/* Main action - same pill/button language */}
        <button
          type="button"
          className="avatar-primary-action"
          onClick={() => setWardrobeOpen((open) => !open)}
        >
          <span className="material-symbols-outlined">
            checkroom
          </span>

          <span>
            {wardrobeOpen ? "Close wardrobe" : "Customise avatar"}
          </span>

          <span className="material-symbols-outlined avatar-action-chevron">
            {wardrobeOpen
              ? "keyboard_arrow_up"
              : "keyboard_arrow_down"}
          </span>
        </button>

        {/* Only appears after customise */}
        {wardrobeOpen && (
          <section className="avatar-wardrobe-card">
            <div className="avatar-section-title">
              <div>
                <h2>Wardrobe</h2>
                <p>
                  {avatar?.inventory.length ?? 0} unlocked items
                </p>
              </div>
            </div>

            <div className="avatar-filter-chips">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={
                    selectedSlot === slot ? "selected" : ""
                  }
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot === "outfit" && (
                    <span className="material-symbols-outlined">
                      checkroom
                    </span>
                  )}

                  {slot === "badge" && (
                    <span className="material-symbols-outlined">
                      workspace_premium
                    </span>
                  )}

                  {slot !== "outfit" && slot !== "badge" && (
                    <span className="material-symbols-outlined">
                      stars
                    </span>
                  )}

                  {slot}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="avatar-empty-state">
                Loading wardrobe...
              </div>
            ) : items.length > 0 ? (
              <div className="avatar-wardrobe-list">
                {items.map((item) => {
                  const equipped =
                    avatar?.equipped[item.slot]?.code === item.code;

                  return (
                    <article
                      key={item.code}
                      className={`avatar-wardrobe-item ${
                        equipped ? "equipped" : ""
                      }`}
                    >
                      <div
                        className={`avatar-item-icon ${item.code
                          .toLowerCase()
                          .replaceAll("_", "-")}`}
                      >
                        <span className="material-symbols-outlined">
                          {item.slot === "badge"
                            ? "workspace_premium"
                            : "checkroom"}
                        </span>
                      </div>

                      <div className="avatar-item-copy">
                        <strong>{item.name}</strong>
                        <span>{item.rarity}</span>
                      </div>

                      <button
                        type="button"
                        disabled={
                          equipped || equipping === item.code
                        }
                        onClick={() => equip(item)}
                      >
                        {equipped
                          ? "Equipped"
                          : equipping === item.code
                            ? "..."
                            : "Equip"}
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="avatar-empty-state">
                <span className="material-symbols-outlined">
                  lock
                </span>

                <strong>No items unlocked yet</strong>

                <p>
                  Complete activities and challenges to unlock
                  more rewards.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Hub kept intentionally lower */}
        <section className="avatar-hub-section">
          <div className="avatar-hub-top">
            <div className="avatar-hub-symbol">
              <span className="material-symbols-outlined">
                home
              </span>
            </div>

            <div>
              <h2>Your Hub</h2>
              <p>Your personal Alumable space.</p>
            </div>
          </div>

          <div className="avatar-hub-links">
            <div>
              <span className="material-symbols-outlined">
                trophy
              </span>
              <span>Rewards</span>
            </div>

            <div>
              <span className="material-symbols-outlined">
                description
              </span>
              <span>Portfolio</span>
            </div>

            <div>
              <span className="material-symbols-outlined">
                auto_stories
              </span>
              <span>Diary</span>
            </div>
          </div>

          <button
            type="button"
            className="avatar-hub-action"
            onClick={onEnterHub}
          >
            Enter Hub

            <span className="material-symbols-outlined">
              arrow_forward
            </span>
          </button>
        </section>
      </main>
    </div>
  );
}