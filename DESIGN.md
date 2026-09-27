# Direction de défilement

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
6. **Calendrier** : photographie panoramique en mouvement derrière les actions de réservation de date.

Pas de section « Ensemble. », de galerie, de carrousel, de légendes de voyage ou d’agrandissement des photos.

## Système

`src/scripts/scroll-experience.ts` utilise GSAP / ScrollTrigger avec des timelines réversibles synchronisées au scroll natif. `src/styles/scroll-experience.css` définit les scènes ; `src/components/ScrollPhoto.astro` expose profondeur, rotation et un mode `natural` qui conserve l’image entière. Les six photos supplémentaires sont configurables dans `scrollPhotos`, dans `src/content/wedding.ts`.

Sur mobile : réduction des amplitudes, mise en page recomposée, ouverture sans immobilisation. Avec mouvement réduit ou sans JavaScript : les mêmes textes et images restent accessibles dans un parcours statique.
