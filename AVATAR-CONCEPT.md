# Alumable Avatar & Virtual Campus — Proof-of-Concept

## Concept

The avatar system extends the existing Alumable gamification loop:

Activity / Challenge / Achievement
→ XP Engine evaluates completion
→ XP and level progression are awarded
→ Cosmetic reward rules are checked
→ unlocked item is added to the student's inventory
→ student equips the item
→ equipped appearance is visible in a shared Campus Hub.

Cosmetics should initially be status/identity rewards rather than paid items.

## Suggested reward examples

| Trigger | XP outcome | Cosmetic outcome |
|---|---:|---|
| Complete Employer Assessment | Existing task XP | Career Blazer |
| Earn Career Starter achievement | Achievement bonus XP | Career Star Pin |
| Reach Level 5 | Level progression | Gold Jacket |
| Complete Portfolio Sprint | Challenge XP | Portfolio Backpack |
| Complete first placement | Activity/achievement reward | Industry Jacket |
| Mentor milestone | Achievement | Mentor Lanyard |

## Avatar asset starting specification

Ask Alumable's designers to create assets by SLOT, not as complete pre-rendered characters.

Suggested first slots:
- base/body
- skin tone
- hair
- outfit/top
- bottoms (optional in MVP)
- hat/headwear
- glasses
- badge/pin
- handheld/accessory

Each cosmetic should have:
- item code
- display name
- slot
- asset key / file path
- rarity (optional)
- unlock rule
- thumbnail
- avatar sprite/layer

For a 2D MVP, PNG/WebP layers with transparent backgrounds are enough.
Keep every layer on the same canvas size and anchor point so items stack correctly.

## Virtual space starting point

The HTML demo implements a small 2D "Campus Hub":
- keyboard movement
- visible remote avatar mock-ups
- names/levels
- simple chat
- locations such as Resource Library and Employer Lounge

For a real multi-user version, add a realtime service:
React Native / React web
→ Laravel authentication
→ WebSocket/realtime presence service
→ avatar position / chat events

MySQL should store inventory and equipped items.
Do NOT write every avatar movement to MySQL. Use ephemeral realtime state
(WebSockets + Redis or an equivalent managed realtime layer) for positions.

## Recommended MVP boundaries

Sprint A:
1. Avatar profile and inventory.
2. Equip/unequip cosmetics.
3. Reward items from Activity/Achievement/Level events.
4. Display equipped avatar on student profile.

Sprint B:
1. One shared 2D room.
2. Presence for a small group of users.
3. Movement and display names.
4. Basic safe/limited chat or emotes.

Later:
- multiple rooms
- employer branded spaces
- events
- private cohort rooms
- richer avatars / animation
- moderation controls
- social privacy settings

## Important product decisions for Alumable

- Are cosmetics purely earned, or can employers sponsor branded items?
- Can an employer reward be visible outside that employer's challenge?
- Are custom employer graphics allowed, and who approves them?
- Can students hide their avatar or online presence?
- Will chat be free text, moderated text, or preset emotes initially?
- What reporting/moderation tools are required?
- Are cosmetics permanent if an XP rule is later recalculated?
- Do level downgrades remove a previously unlocked cosmetic? Recommended: no.
