<p align="center">
  <img src="https://raw.githubusercontent.com/Flybrow/lovelace-kiosk-autoscroll/main/assets/logo.png" alt="Kiosk Auto Scroll" width="120">
</p>

# Lovelace Kiosk Auto Scroll

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![Validate](https://github.com/Flybrow/lovelace-kiosk-autoscroll/actions/workflows/validate.yml/badge.svg)](https://github.com/Flybrow/lovelace-kiosk-autoscroll/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

🇫🇷 **[Version française](README.fr.md)**

A Lovelace plugin that **scrolls your Home Assistant views automatically**, top
to bottom then back up, in a loop — a real **kiosk mode** for wall displays,
tablets and control dashboards.

What makes it different: scrolling is enabled by an **invisible card** placed on
the dashboard you choose. No global setting, no unwanted scrolling elsewhere —
it only scrolls **where you added the card**.

![Kiosk Auto Scroll card editor](https://raw.githubusercontent.com/Flybrow/lovelace-kiosk-autoscroll/main/assets/screenshot.png)

## Contents

- [Highlights](#highlights)
- [Installation](#installation)
- [Getting started](#getting-started)
- [All options](#all-options)
  - [Scrolling](#scrolling)
  - [Pauses](#pauses)
  - [Rotating through the dashboard](#rotating-through-the-dashboard)
  - [Activation conditions](#activation-conditions)
  - [Language](#language)
- [When scrolling pauses](#when-scrolling-pauses)
- [Examples](#examples)
- [FAQ](#faq)
- [License](#license)

## Highlights

- 🪶 **Lightweight**: vanilla JavaScript, **no dependencies**, no build step.
- 🎯 **Targeted**: enabled by an invisible card, view by view.
- 🌊 **Smooth**: `requestAnimationFrame` engine, with gentle easing at the ends.
- ⏱️ **Two modes**: constant speed or constant travel duration.
- ↕️ **Vertical or horizontal**.
- 🫥 **Full screen**: optional scrollbar hiding.
- 🔁 **Rotation**: a single card can scroll the whole dashboard.
- 🙅 **Respectful**: pauses as soon as the user touches the screen, then resumes
  where it left off.
- 🔧 **Conditional**: per user, per entity, per time range.
- 🌍 **Multilingual**: English and French, following the Home Assistant language.
- 🖥️ Built-in **graphical editor**.

## Installation

### Through HACS (recommended)

1. HACS → ⋮ menu → **Custom repositories**.
2. Add this repository URL, category **Dashboard**.
3. Install **Kiosk Auto Scroll**, then reload the page (clear the browser cache
   if needed). HACS adds the resource automatically.

### Manual

1. Copy `kiosk-autoscroll.js` into `/config/www/`.
2. Declare a **JavaScript Module** resource pointing to
   `/local/kiosk-autoscroll.js` (Settings → Dashboards → Resources).

## Getting started

1. Open the dashboard you want to scroll.
2. **Edit dashboard** → **Add card** → search for **Kiosk Auto Scroll**.
3. Adjust the options in the graphical editor, then save.
4. That's it: the card is **invisible** in normal use and scrolling starts. To
   disable it, simply delete the card.

> A card only drives the view it sits on. To scroll several views, add a card to
> each — or enable [rotation](#rotating-through-the-dashboard) on a single card.

Minimal YAML configuration:

```yaml
type: custom:kiosk-autoscroll-card
```

Every option has a default: a card with no settings already scrolls correctly.

## All options

| Option               | Type             | Default    | Short description                                |
| -------------------- | ---------------- | ---------- | ------------------------------------------------ |
| `mode`               | `speed`/`duration` | `speed`  | Constant speed or constant travel duration.      |
| `speed`              | number           | `1`        | Speed (`speed` mode). Higher = faster.           |
| `duration`           | number (s)       | `60`       | Duration of one pass (`duration` mode).          |
| `axis`               | `vertical`/`horizontal` | `vertical` | Scrolling direction.                    |
| `easing`             | boolean          | `true`     | Gradual slowdown at the ends.                    |
| `hideScrollbar`      | boolean          | `false`    | Hides the scrollbar.                             |
| `pause`              | number (ms)      | `4000`     | Pause at each end.                               |
| `pauseOnInteraction` | number (ms)      | `8000`     | Pause after a user interaction.                  |
| `rotateViews`        | boolean          | `false`    | Scrolls the whole dashboard, view by view.       |
| `entity`             | entity           | —          | Only scroll while the entity is on.              |
| `activeHours`        | text             | —          | Active time range, e.g. `08:00-20:00`.           |
| `users`              | list             | —          | Restrict to certain people / users.              |
| `language`           | `auto`/`en`/`fr` | `auto`     | Language of the card and its editor.             |

### Scrolling

- **`mode: speed`** (default) — constant speed.
  - **`speed`** sets how fast it goes. Reference points: `0.25` = very slow,
    `1` = normal, `3` = fast. Decimal values are accepted (sub-pixel scrolling,
    so genuinely slower than 1 px per frame).
  - **`easing`** (default `true`) slows down gently near the top and bottom, for
    a less abrupt result.
- **`mode: duration`** — the view is travelled end to end in **`duration`**
  seconds, **whatever its length**. The duration stays stable even if the
  content changes size while scrolling (cards loading, graphs expanding…).
- **`axis`** — `vertical` (up/down, default) or `horizontal` (left/right),
  useful for column views and wide panels.
- **`hideScrollbar`** (default `false`) — hides the view's scrollbar for a
  full-screen look, without changing behaviour: touch, wheel and keyboard
  scrolling still work. The scrollbar is **restored automatically** in edit
  mode, when leaving the view and if you remove the card. Works on
  Chrome/WebView, Firefox and Safari alike.

### Pauses

- **`pause`** — dwell time at each end before heading back the other way (in
  milliseconds; `4000` = 4 s).
- **`pauseOnInteraction`** — when the user acts (touch, click, wheel, arrow
  keys), scrolling pauses for this delay, then **resumes in the direction it was
  going** before the interaction (the position you scrolled to is kept).

### Rotating through the dashboard

With **`rotateViews: true`**, the card no longer just goes back and forth on its
own view: once at the bottom, it **moves to the next view** of the dashboard,
and so on in a loop.

- Scrolling then covers **all pages**, including those **without a card**.
  **Subviews** (`subview: true`) and views **hidden** from the user (`visible`)
  are excluded from the rotation.
- **One card per page**: if another view has its own Kiosk card, that card drives
  its page (local settings take priority).
- When you **leave the dashboard**, rotation stops.

> Only place **one card per view**. If several are present, a warning is shown in
> edit mode and only one is used.

### Activation conditions

All optional, and combinable:

- **`entity`** — scrolling only happens while the given entity is in an active
  state (`on`, `home`, `open` or `true`). Ideal with an `input_boolean` to turn
  kiosk mode on and off from an automation or a button.
- **`activeHours`** — limits scrolling to a time range, in 24 h format
  `HH:MM-HH:MM` (e.g. `08:00-20:00`). Overnight ranges are supported
  (e.g. `22:00-06:00`). An invalid format is flagged in the editor.
- **`users`** — restricts scrolling to certain people. In the editor, pick
  `person` entities. In YAML you can also give user ids/names or `person.*`
  entities (comma separated). Empty = everyone.

### Language

The card and its editor are translated into **English** and **French**.

- By default (`language: auto`), the display follows the **Home Assistant
  language** of the logged-in user: nothing to configure.
- If Home Assistant is set to a language that is not translated, **English** is
  used.
- To force a language, pick it under **Advanced settings → Language**, or in
  YAML:

```yaml
type: custom:kiosk-autoscroll-card
language: en
```

> The language is not asked for at install time: HACS only copies the plugin
> file and offers no configuration form for Lovelace cards. Automatic detection
> replaces that step.

## When scrolling pauses

Scrolling is automatically suspended:

- while **editing** the dashboard;
- during and just after a user **interaction**;
- when the **tab/screen is not visible** (to save resources);
- outside the **time range** (`activeHours`);
- when the condition **entity** (`entity`) is not active;
- when **no card** is active on the view (or the **user** filter does not match).

## Examples

**Wall tablet, slow continuous scrolling:**

```yaml
type: custom:kiosk-autoscroll-card
speed: 0.4
pause: 6000
```

**Travel each view in 45 s, then move to the next one:**

```yaml
type: custom:kiosk-autoscroll-card
mode: duration
duration: 45
rotateViews: true
```

**Kiosk mode during the day only, controlled by a switch:**

```yaml
type: custom:kiosk-autoscroll-card
speed: 1
entity: input_boolean.kiosk_mode
activeHours: "07:30-22:00"
```

**Scroll only for the wall display account:**

```yaml
type: custom:kiosk-autoscroll-card
users:
  - person.living_room_wall
```

## FAQ

**Is the card visible / does it take up space?**
No. In normal use it is **completely invisible and takes no space**: in a
**sections** view, the surrounding grid container is hidden as well, so no empty
cell is left behind. It only shows a box (title and settings summary) in **edit
mode**, so you can still find it.

**How do I change the language?**
It follows the Home Assistant language automatically. To force it, use the
`language` option (`auto`, `en`, `fr`) under **Advanced settings**.

**Can I remove the scrollbar?**
Yes: enable `hideScrollbar` (Advanced settings). It comes back in edit mode and
as soon as the card is removed.

**Nothing scrolls.**
Check that you are not in edit mode, that the page has enough content to scroll,
and that any conditions (`entity`, `activeHours`, `users`) are met. Remember to
clear the browser cache after an update.

**How do I make it slower?**
Lower `speed` (e.g. `0.25`) or switch to `mode: duration` with a large
`duration`.

**Which way does it resume after I touch the screen?**
It resumes in the direction it was going just before you stepped in, from the
position where you left it.

## License

MIT — see [LICENSE](LICENSE).
