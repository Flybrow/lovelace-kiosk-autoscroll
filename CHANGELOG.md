# Changelog

🇫🇷 **[Version française](CHANGELOG.fr.md)**

## 2.5.1 — 7 September 2026

- **English is now the default documentation.** HACS performs no language
  negotiation and only ever renders `README.md`, so that file is now the English
  one. The French versions moved to
  [README.fr.md](README.fr.md) and [CHANGELOG.fr.md](CHANGELOG.fr.md), linked at
  the top of each file. No change to the plugin itself.

## 2.5.0 — 7 September 2026

Combines versions 2.3.0 and 2.4.0, released the same day.

### New

- **English and French**: the card and its editor are now translated. The
  display automatically follows the **Home Assistant language** of the logged-in
  user, falling back to **English** for any other language. New **`language`**
  option (`auto` by default, `en`, `fr`) to force a language.
- **New `hideScrollbar` option** (Advanced settings, off by default): hides the
  view's scrollbar for a full-screen look, without preventing manual scrolling.
  Works on Chrome/WebView, Firefox and Safari. The scrollbar is restored
  automatically in edit mode, when changing view and when the card is removed.
- **Completely invisible in production**: in **sections** views (Home Assistant
  2024.3+), the card no longer leaves an empty cell in the grid — the container
  around it is hidden as well. Zero footprint also declared through
  `getGridOptions()`.

### Fixes

- A card that was present but **disabled**, or **not allowed for the current
  user**, did not stop a global rotation inherited from another view; scrolling
  wrongly continued (and bypassed the user filter).
- Dashboard rotation walked through **subviews** (`subview: true`) and **hidden
  views** (`visible`). They are now excluded.
- The pause following an interaction was not reset when changing view, leaving
  the new view frozen for up to 8 s.

### Other

- **Lower resource use**: outside the active time range, with an inactive
  entity, in edit mode or while paused, the animation loop no longer runs at
  60 fps — it switches to a timer (1 s when idle, 250 ms during pauses).
- **Validated configuration**: an invalid configuration (mode, axis, negative
  values, malformed `activeHours`) now raises an explicit error in the editor
  instead of being silently accepted.
- Minimum Home Assistant version raised to **2023.9** (required by the graphical
  editor), and internal documentation refreshed.

## 2.2.1 — 20 June 2026

- After an interaction, scrolling now resumes **in the direction it was going
  before** your gesture (rather than the direction of the gesture), from the
  position where you left it.
- New logo.

## 2.2.0 — 20 June 2026

- Simplified settings panel: only **3 essential settings** stay visible (mode,
  speed/duration, pause). Everything else moved to **Advanced settings**.
- "Speed granularity" field removed (older configurations remain compatible).

## 2.1.1 — 20 June 2026

- Fix: the "Several Kiosk cards on this page" message was wrongly shown when
  entering edit mode with only one card present.

## 2.1.0 — 20 June 2026

- **Whole-dashboard rotation**: with the option enabled, a single card scrolls
  every page, one after another (including pages without a card). A card placed
  on another page keeps priority on that page.
- **Truly constant duration**: in duration mode, travel time stays stable even
  if the page content changes size.
- **Smart resume**: after an interaction, scrolling restarts in the direction of
  your gesture (wheel, arrow keys).
- Optional **horizontal scrolling** (column views, wide panels).
- **User picker** for allowed people, instead of a text field.
- **Error message** when the time range is malformed, and a warning when several
  cards are placed on the same page.
- More reliable detection of the scrolling container across themes and layouts.
- State cleanly reset on every view change.

## 2.0.1 — 20 June 2026

- Clearer card settings panel: every option has a **description**, advanced
  settings are grouped in a collapsible section, and only the fields relevant to
  the chosen mode are displayed.

## 2.0.0 — 20 June 2026

- **Smoother** scrolling, with gentle easing at the top and bottom.
- New **fixed duration** mode: the view is travelled in a chosen time, whatever
  its length (in addition to the classic speed mode).
- **View rotation**: option to automatically move to the next view once at the
  bottom.
- Scrolling can be conditioned on an **entity** (e.g. a switch) and on a **time
  range**.
- Improved card editor (native Home Assistant interface).

## 1.2.0 — 20 June 2026

- Lighter and smoother scrolling (less load on tablets and wall displays).
- Scrolling goes to sleep when the screen/tab is not displayed, to save battery.
- Safety and robustness fixes.

## 1.1.1 — 20 June 2026

- Fix: in dashboard edit mode, the card is properly displayed and scrolling
  stops.

## 1.1.0 — 20 June 2026

- New **graphical editor**: configure the card without touching YAML.
- Ability to scroll **much more slowly** (values below 1).
- In edit mode, the card shows a visible box (title + description); scrolling is
  suspended while editing.
- The plugin now works **only through the card**.

## 1.0.0 — 20 June 2026

- First release: automatic looping view scrolling (kiosk mode), with pauses at
  the top/bottom and while interacting.
- Invisible card to add to the dashboard to enable scrolling.
- Home Assistant user filter.
