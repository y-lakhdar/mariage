# Direction de défilement

## Accueil — composition grand écran

- Conteneur centré plafonné à 1360 px, resserré sur les fenêtres peu hautes. Colonne texte de 420 px maximum, gouttière de 48 px et photo occupant toute sa colonne.
- L’ellipse inclinée reprend le tracé de l’ancien ornement ; elle constitue le masque de la photo. Le masque s’ouvre au défilement.
- Le « oui. » et son léger dégradé de contraste sont à l’intérieur de la photo. Leur taille dépend du cadre, et le déplacement de la photo est calculé par rapport au conteneur, pas à la largeur de l’écran.
- Sous 900 px, composition empilée et largeur limitée à 640 px ; défilement natif sans immobilisation.

Fondements UX consultés : [web.dev — responsive design](https://web.dev/articles/responsive-web-design-basics) préconise une largeur maximale sur grand écran et des points de rupture dictés par le contenu ; [NN/g — proximité](https://www.nngroup.com/articles/gestalt-proximity/) recommande de rapprocher les éléments liés ; [NN/g — design visuel](https://www.nngroup.com/articles/principles-visual-design/) détaille hiérarchie, échelle, équilibre et contraste. Les dimensions ci-dessus sont des choix propres à cette composition.

## Références étudiées

- [Quechua Lookbook 2016 / Akaru](https://www.awwwards.com/inspiration/quechua-lookbook-2016) : GIF de démonstration consulté dans le navigateur. Grands aplats, compositions asymétriques, superposition de photos et blocs de contenu. La fiche cite « parallax », « moving background » et « mouse parallax ».
- [Le Col de Claudine](https://www.awwwards.com/inspiration/le-col-de-claudine) : vidéo de démonstration consultée à plusieurs instants. Photographies rectangulaires décalées, grandes lettres au premier plan et transitions entre fonds pastel. La fiche cite « parallax », « typography » et « fashion ».

Les anciennes destinations des sites ne sont pas prises comme dépendances. Les démonstrations Awwwards servent de références de composition, pas de contenu à reproduire.

## Traduction pour l’invitation

1. **Ouverture** : la photo quitte son arche et s’agrandit pendant que le texte se retire ; un grand « oui. » apparaît au premier plan. Scène sticky sur ordinateur.
2. **Invitation** : deux photos sur des plans différents accompagnent le mot aux invités. Un aplat sauge et le mot « amour » traversent la composition à des vitesses différentes.
3. **Histoire** : photo principale et gros plan se déplacent indépendamment, sans cadre d’album.
4. **Fin de semaine** : un fond photographique se déploie en plein cadre ; une deuxième photo passe au premier plan, derrière les dates en contour. Les informations pratiques suivent dans le flux normal.
5. **Lieu** : image verticale et typographie géante font la transition vers les détails.
6. **Calendrier** : les actions de réservation de date terminent la page, à côté de la photographie de conclusion.

Pas de galerie autonome. La section 2 utilise sur mobile une rangée horizontale inspirée de [#89 Portfolio Horizontal Parallax](https://webflow.com/made-in-webflow/website/089-100dwfix) : cadres espacés, aperçu de la photo suivante et déplacement horizontal lié au scroll vertical. Le texte reste hors des photos pour préserver les visages. Sur desktop, les deux plans superposés restent en place.

## Système

`src/scripts/scroll-experience.ts` utilise GSAP / ScrollTrigger avec des timelines réversibles synchronisées au scroll natif. `src/styles/scroll-experience.css` définit les scènes ; `src/components/ScrollPhoto.astro` expose profondeur, rotation et un mode `natural` qui conserve l’image entière. Les cinq photos supplémentaires sont configurables dans `scrollPhotos`, dans `src/content/wedding.ts`.

Sur mobile : réduction des amplitudes, mise en page recomposée, ouverture sans immobilisation. Avec mouvement réduit ou sans JavaScript : les mêmes textes et images restent accessibles dans un parcours statique.

## Revue mobile

- **Lecture** : texte courant à 1rem / 1.7 ; informations secondaires à 12–14 px ; hiérarchie serif conservée. Les tailles et espacements sont vérifiés dès 320 px.
- **Toucher** : actions de 44 px minimum, boutons calendrier de 52 px, retour tactile discret et focus dirigé vers la section choisie dans le menu.
- **Mouvement** : chorégraphie mobile dédiée, réversible. L’ellipse d’accueil s’ouvre en plein bord avec apparition du « oui. ». Les photos entières passent de 90 % à 100 % de leur taille, se redressent de 2–3 degrés et parcourent 80–110 px ; l’aplat sauge se déplace indépendamment. Les accents typographiques arrivent latéralement. Le lac et la conclusion s’ouvrent par masque avec parallaxe interne. Le carrousel à trois images ajoute un contre-mouvement de ±8 px dans chaque cadre, avec navigation précédente/suivante et clavier. Les textes de lecture restent stables.
- **Confort** : préférence de mouvement réduit et fenêtres de moins de 480 px de haut utilisent une rangée à scroll horizontal natif, sans scène sticky. Les autres animations sont désactivées avec le mouvement réduit.
- **Chargement** : dimensions intrinsèques de toutes les photos, WebP responsive, priorité à l’image d’accueil, chargement du carrousel à proximité et calculs du scroll suspendus hors zone.

Recommandations consultées : [web.dev — animations performantes](https://web.dev/articles/animations-guide) (transform/opacity, usage limité de `will-change`), [W3C — taille des cibles](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) (minimum AA de 24 px ; choix projet plus confortable de 44 px), [W3C — animations déclenchées par interaction](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) (désactivation des mouvements non essentiels).
