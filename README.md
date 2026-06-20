<p align="center">
  <img src="https://raw.githubusercontent.com/Flybrow/lovelace-kiosk-autoscroll/main/assets/logo.png" alt="Kiosk Auto Scroll" width="120">
</p>

# Lovelace Kiosk Auto Scroll

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![Validate](https://github.com/Flybrow/lovelace-kiosk-autoscroll/actions/workflows/validate.yml/badge.svg)](https://github.com/Flybrow/lovelace-kiosk-autoscroll/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Plugin Lovelace qui fait **défiler automatiquement vos vues Home Assistant**, de
haut en bas puis de bas en haut, en boucle — un vrai **mode kiosque** pour écrans
muraux, tablettes et tableaux de bord de supervision.

Sa particularité : le défilement s'active par une **carte invisible** posée sur
le tableau de bord voulu. Pas de réglage global, pas de défilement intempestif
ailleurs — ça ne défile **que** là où vous avez ajouté la carte.

![Éditeur de la carte Kiosk Auto Scroll](https://raw.githubusercontent.com/Flybrow/lovelace-kiosk-autoscroll/main/assets/screenshot.png)

## Sommaire

- [Points forts](#points-forts)
- [Installation](#installation)
- [Prise en main](#prise-en-main)
- [Toutes les options](#toutes-les-options)
  - [Défilement](#défilement)
  - [Pauses](#pauses)
  - [Rotation de tout le tableau de bord](#rotation-de-tout-le-tableau-de-bord)
  - [Conditions d'activation](#conditions-dactivation)
- [Quand le défilement se met en pause](#quand-le-défilement-se-met-en-pause)
- [Exemples](#exemples)
- [FAQ](#faq)
- [Licence](#licence)

## Points forts

- 🪶 **Léger** : JavaScript natif, **aucune dépendance**, aucun build.
- 🎯 **Ciblé** : activé par une carte invisible, vue par vue.
- 🌊 **Fluide** : moteur `requestAnimationFrame`, avec ralenti doux aux extrémités.
- ⏱️ **Deux modes** : vitesse constante ou durée de parcours constante.
- ↕️ **Vertical ou horizontal**.
- 🔁 **Rotation** : une seule carte peut faire défiler tout le tableau de bord.
- 🙅 **Respectueux** : se met en pause dès que l'utilisateur touche l'écran,
  puis reprend là où il en était.
- 🔧 **Conditionnel** : par utilisateur, par entité, par plage horaire.
- 🖥️ **Éditeur graphique** intégré, en français.

## Installation

### Via HACS (recommandé)

1. HACS → menu ⋮ → **Custom repositories**.
2. Ajoutez l'URL de ce dépôt, catégorie **Tableau de bord** (Dashboard).
3. Installez **Kiosk Auto Scroll**, puis rechargez la page (videz le cache du
   navigateur si besoin). HACS ajoute la ressource automatiquement.

### Manuelle

1. Copiez `kiosk-autoscroll.js` dans `/config/www/`.
2. Déclarez une ressource de type **Module JavaScript** pointant vers
   `/local/kiosk-autoscroll.js` (Paramètres → Tableaux de bord → Ressources).

## Prise en main

1. Ouvrez le tableau de bord à faire défiler.
2. **Modifier le tableau de bord** → **Ajouter une carte** → cherchez
   **Kiosk Auto Scroll**.
3. Réglez les options dans l'éditeur graphique, puis enregistrez.
4. C'est tout : la carte est **invisible** en utilisation normale et le
   défilement démarre. Pour désactiver, supprimez simplement la carte.

> Une carte ne pilote que la vue où elle se trouve. Pour faire défiler plusieurs
> vues, ajoutez une carte sur chacune — ou activez la
> [rotation](#rotation-de-tout-le-tableau-de-bord) sur une seule carte.

Configuration minimale en YAML :

```yaml
type: custom:kiosk-autoscroll-card
```

Toutes les options ont une valeur par défaut : une carte sans réglage défile
déjà correctement.

## Toutes les options

| Option               | Type            | Défaut     | Description courte                                  |
| -------------------- | --------------- | ---------- | -------------------------------------------------- |
| `mode`               | `speed`/`duration` | `speed` | Vitesse constante ou durée de parcours constante.  |
| `speed`              | nombre          | `1`        | Vitesse (mode `speed`). Plus grand = plus rapide.  |
| `duration`           | nombre (s)      | `60`       | Durée d'un aller (mode `duration`).                |
| `axis`               | `vertical`/`horizontal` | `vertical` | Sens du défilement.                       |
| `easing`             | booléen         | `true`     | Ralenti progressif aux extrémités.                 |
| `pause`              | nombre (ms)     | `4000`     | Pause à chaque extrémité.                          |
| `pauseOnInteraction` | nombre (ms)     | `8000`     | Pause après une interaction utilisateur.           |
| `rotateViews`        | booléen         | `false`    | Fait défiler tout le tableau de bord, vue par vue. |
| `entity`             | entité          | —          | N'active le défilement que si l'entité est allumée.|
| `activeHours`        | texte           | —          | Plage horaire d'activité, ex. `08:00-20:00`.       |
| `users`              | liste           | —          | Limite à certaines personnes / utilisateurs.       |

### Défilement

- **`mode: speed`** (défaut) — vitesse constante.
  - **`speed`** règle la rapidité. Repères : `0.25` = très lent, `1` = normal,
    `3` = rapide. Les valeurs décimales sont acceptées (défilement sous-pixel,
    donc réellement plus lent que 1 px par image).
  - **`easing`** (défaut `true`) ralentit en douceur en approchant du haut et du
    bas, pour un rendu moins brusque.
- **`mode: duration`** — la vue est parcourue d'un bout à l'autre en
  **`duration`** secondes, **quelle que soit sa longueur**. La durée reste stable
  même si le contenu change de taille pendant le défilement (cartes qui se
  chargent, graphiques qui s'agrandissent…).
- **`axis`** — `vertical` (haut/bas, défaut) ou `horizontal` (gauche/droite),
  utile pour les vues en colonnes ou les panneaux larges.

### Pauses

- **`pause`** — temps d'arrêt à chaque extrémité avant de repartir dans l'autre
  sens (en millisecondes ; `4000` = 4 s).
- **`pauseOnInteraction`** — quand l'utilisateur agit (toucher, clic, molette,
  flèches), le défilement se met en pause pendant ce délai, puis **reprend dans
  le sens où il allait** avant l'interaction (la position atteinte manuellement
  est conservée).

### Rotation de tout le tableau de bord

Avec **`rotateViews: true`**, la carte ne se contente plus de faire des
allers-retours sur sa vue : arrivée en bas, elle **passe à la vue suivante** du
tableau de bord, et ainsi de suite en boucle.

- Le défilement couvre alors **toutes les pages**, y compris celles **sans
  carte**.
- **Une carte par page** : si une autre vue possède sa propre carte Kiosk, c'est
  elle qui pilote cette page (réglages locaux prioritaires).
- Quand on **quitte le tableau de bord**, la rotation s'arrête.

> Ne posez qu'**une seule carte par vue**. Si plusieurs sont présentes, un
> avertissement s'affiche en mode édition et une seule est utilisée.

### Conditions d'activation

Toutes optionnelles, et cumulables :

- **`entity`** — le défilement n'a lieu que si l'entité indiquée est dans un état
  actif (`on`, `home`, `open` ou `true`). Idéal avec un `input_boolean` pour
  activer/couper le mode kiosque depuis une automatisation ou un bouton.
- **`activeHours`** — limite le défilement à une tranche horaire, au format 24 h
  `HH:MM-HH:MM` (ex. `08:00-20:00`). Les plages de nuit sont gérées
  (ex. `22:00-06:00`). Un format invalide est signalé dans l'éditeur.
- **`users`** — restreint le défilement à certaines personnes. Dans l'éditeur,
  sélectionnez des entités `person`. En YAML, vous pouvez aussi indiquer des
  identifiants/noms d'utilisateurs ou des entités `person.*` (séparés par des
  virgules). Vide = tout le monde.

## Quand le défilement se met en pause

Le défilement est automatiquement suspendu :

- pendant l'**édition** du tableau de bord ;
- pendant et juste après une **interaction** utilisateur ;
- quand l'**onglet/écran n'est pas visible** (économie de ressources) ;
- en dehors de la **plage horaire** (`activeHours`) ;
- quand l'**entité** de condition (`entity`) n'est pas active ;
- quand **aucune carte** n'est active sur la vue (ou que le filtre
  **utilisateur** ne correspond pas).

## Exemples

**Tablette murale, défilement lent et continu :**

```yaml
type: custom:kiosk-autoscroll-card
speed: 0.4
pause: 6000
```

**Parcourir chaque vue en 45 s, puis passer à la suivante :**

```yaml
type: custom:kiosk-autoscroll-card
mode: duration
duration: 45
rotateViews: true
```

**Mode kiosque uniquement en journée et pilotable par un interrupteur :**

```yaml
type: custom:kiosk-autoscroll-card
speed: 1
entity: input_boolean.mode_kiosque
activeHours: "07:30-22:00"
```

**Défiler seulement pour le compte de l'écran mural :**

```yaml
type: custom:kiosk-autoscroll-card
users:
  - person.mur_salon
```

## FAQ

**La carte est visible / prend de la place ?**
Non, elle est invisible en utilisation normale. Elle n'affiche un encart (titre
et résumé des réglages) qu'en **mode édition**, pour rester repérable.

**Rien ne défile.**
Vérifiez que vous n'êtes pas en mode édition, que la page contient assez de
contenu pour défiler, et que les éventuelles conditions (`entity`, `activeHours`,
`users`) sont remplies. Pensez à vider le cache du navigateur après une mise à
jour.

**Comment ralentir davantage ?**
Diminuez `speed` (ex. `0.25`) ou passez en `mode: duration` avec une grande
`duration`.

**Dans quel sens le défilement reprend-il après que j'ai touché l'écran ?**
Il reprend dans le sens où il allait juste avant votre intervention, depuis la
position où vous l'avez laissé.

## Licence

MIT — voir [LICENSE](LICENSE).
