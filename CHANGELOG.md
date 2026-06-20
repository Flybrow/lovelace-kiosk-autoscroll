# Journal des modifications

## 2.2.1 — 20 juin 2026

- Après une interaction, le défilement reprend désormais dans le **sens où il
  allait avant** votre geste (et non plus dans le sens du geste), depuis la
  position où vous l'avez laissé.
- Nouveau logo.

## 2.2.0 — 20 juin 2026

- Panneau de réglages simplifié : seuls **3 réglages essentiels** restent visibles
  (mode, vitesse/durée, pause). Tout le reste est rangé dans **Réglages avancés**.
- Champ « Finesse de la vitesse » retiré (les anciennes configurations restent
  compatibles).

## 2.1.1 — 20 juin 2026

- Correction : le message « Plusieurs cartes Kiosk sur cette page » s'affichait à
  tort en entrant en mode édition alors qu'il n'y avait qu'une seule carte.

## 2.1.0 — 20 juin 2026

- **Rotation sur tout le tableau de bord** : avec l'option activée, une seule
  carte fait défiler toutes les pages, page après page (même celles sans carte).
  Une carte posée sur une autre page reste prioritaire sur cette page.
- **Durée vraiment constante** : en mode durée, le temps de parcours reste stable
  même si le contenu de la page change de taille.
- **Reprise intelligente** : après une interaction, le défilement repart dans le
  sens de votre geste (molette, flèches).
- **Défilement horizontal** en option (vues en colonnes, panneaux larges).
- **Choix des personnes** autorisées via un sélecteur, au lieu d'un champ texte.
- **Message d'erreur** si la plage horaire est mal écrite, et avertissement si
  plusieurs cartes sont posées sur la même page.
- Détection du conteneur à faire défiler plus fiable selon les thèmes/mises en page.
- Comportement remis à zéro proprement à chaque changement de vue.

## 2.0.1 — 20 juin 2026

- Panneau de réglages de la carte plus clair : chaque option a une **description**,
  les réglages avancés sont regroupés dans une section repliable, et seuls les
  champs utiles au mode choisi sont affichés.

## 2.0.0 — 20 juin 2026

- Défilement **plus fluide**, avec un ralenti doux en haut et en bas.
- Nouveau mode **durée fixe** : la vue est parcourue en un temps choisi, quelle
  que soit sa longueur (en plus du mode vitesse classique).
- **Rotation des vues** : possibilité de passer automatiquement à la vue suivante
  une fois en bas.
- Le défilement peut être conditionné à une **entité** (ex. un interrupteur) et
  à une **plage horaire**.
- Éditeur de carte amélioré (interface native Home Assistant).

## 1.2.0 — 20 juin 2026

- Défilement plus léger et plus fluide (moins de charge sur les tablettes et
  écrans muraux).
- Le défilement se met en veille quand l'écran/onglet n'est pas affiché, pour
  économiser la batterie.
- Correctifs de sécurité et de robustesse.

## 1.1.1 — 20 juin 2026

- Correction : en mode édition du tableau de bord, la carte s'affiche bien et le
  défilement s'arrête.

## 1.1.0 — 20 juin 2026

- Nouvel **éditeur graphique** : on règle la carte sans toucher au YAML.
- Possibilité de **ralentir fortement** le défilement (valeurs inférieures à 1).
- En mode édition, la carte affiche un encart visible (titre + description) ;
  le défilement est suspendu pendant qu'on édite.
- Le plugin fonctionne désormais **uniquement via la carte**.

## 1.0.0 — 20 juin 2026

- Première version : défilement automatique des vues en boucle (mode kiosque),
  avec pause en haut/bas et pause pendant l'interaction.
- Carte invisible à ajouter sur le tableau de bord pour activer le défilement.
- Filtre par utilisateur Home Assistant.
