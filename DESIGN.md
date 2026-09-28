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
