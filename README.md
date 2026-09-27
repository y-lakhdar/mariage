# Marie-Audrée & Yassine — Notre invitation

Site public d’annonce du mariage, du **8 au 10 octobre 2027**, avec célébration le **samedi 9**. Astro génère des fichiers statiques : aucun serveur applicatif ni base de données n’est nécessaire.

## Démarrer en local

Node.js 22.12+ (Node 24 recommandé).

```sh
npm install
npm run photos
npm run dev
```

Ouvrir **http://localhost:4321**. Les modifications se rechargent automatiquement.

## Modifier l’invitation

- **`src/content/wedding.ts`** : noms, dates, histoire, programme, informations pratiques, FAQ et date de dernière mise à jour. C’est le point de départ pour enrichir le site.
- **`src/pages/index.astro`** : structure, accroches et mise en page. L’adresse est aussi présentée sur deux lignes dans la section du lieu ; modifier cet affichage si le lieu change.
- **`src/styles/global.css`** : couleurs (variables au début), typographie et informations pratiques. `src/styles/scroll-experience.css` définit les compositions photo, leurs superpositions et les scènes sticky.
- **`src/scripts/scroll-experience.ts`** : timelines GSAP / ScrollTrigger réversibles : ouverture qui se déploie, photos sur plusieurs plans, cadrages, changements d’échelle et typographie traversante. Défilement natif, amplitudes atténuées sur mobile, version statique pour le mouvement réduit.
- **`src/scripts/interactions.ts`** : apparitions, parallaxe interne des photos de l’histoire et menu mobile.
- **`DESIGN.md`** : références étudiées et direction visuelle.
- **`src/lib/calendar.ts`** : descriptif de l’événement exporté. Mettre à jour le texte si les horaires ou la formule changent.

Les tarifs, repas et horaires sont explicitement à confirmer. Cette première version annonce l’événement ; la FAQ indique qu’une méthode de confirmation de présence sera communiquée plus tard.

### Ajouter la preuve de l’UTHC

Déposer l’image dans `public/preuve-uthc.jpg`, puis remplacer `storyProof: null` dans le fichier de contenu par :

```ts
storyProof: { src: '/preuve-uthc.jpg', alt: 'Notre liste avant l’UTHC : aux places 4 et 6, on se marie !' },
```

L’image remplace automatiquement le placeholder. Garder la déclaration de type `as null | { src: string; alt: string }` après la valeur.

### Photos

Les originaux sont dans `photos_mariage/`. `scripts/prepare-photos.mjs` crée des WebP de 640, 1200 et 1800 pixels ainsi que l’aperçu de partage dans `public/photos/`. L’orientation EXIF est appliquée et les métadonnées retirées. Les originaux ne sont pas copiés dans le site publié.

Cinq emplacements photo supplémentaires sont intégrés aux sections de l’invitation, du programme, des détails et à la conclusion. Modifier `scrollPhotos` dans `src/content/wedding.ts` pour remplacer les images actuelles. Pour une nouvelle image, compléter aussi la liste dans le script de préparation, puis relancer `npm run photos`. La préparation est aussi exécutée par `npm run build`.

Le composant `ScrollPhoto` expose `travel` (distance de déplacement), `rotate` (angle) et `natural` (image entière, ratio original, sans zoom interne). La position et la taille sont définies par sa classe CSS. Il peut aussi recevoir directement un `id` et un texte alternatif pour une photo hors de `scrollPhotos`. `img_climbing.JPG` accompagne l’introduction, `img_mtl.jpg` le programme, `amis.jpeg` les détails et `img_end.JPG` termine la page dans un grand cadre portrait. L’histoire suit directement l’accueil avec `img_course.jpg` et `preuve.jpg`. `image_canot.jpg` illustre le point de rendez-vous.

## Vérifier la version de production

```sh
npm run check
npm run build
npm run preview
```

Tests navigateur (desktop et mobile, parallaxe des photos, navigation, mouvements réduits, fonctionnement sans JavaScript, calendrier) :

```sh
npx playwright install chromium
npm test
```

Les captures réalisées par les tests sont dans `test-results/`.

## Déploiement automatique — Cloudflare Workers

Le déploiement cible **https://mariage.yassine-lakhdar.workers.dev**, dans le Worker **`mariage`**.
`wrangler.jsonc` configure l’hébergement des fichiers statiques de `dist/` ; aucun serveur Astro ni adaptateur SSR n’est nécessaire.

### Configuration initiale dans Cloudflare

Ouvrir **Workers & Pages → mariage → Settings → Build**, puis connecter le dépôt GitHub avec ces réglages :

| Réglage | Valeur |
| --- | --- |
| Dépôt | `y-lakhdar/mariage` |
| Branche de production | `main` |
| Build automatique | Activé |
| Racine | Racine du dépôt (laisser le champ par défaut) |
| Commande de build | `npm run check && npm run build` |
| Commande de déploiement | `npm run deploy` |
| API token | Conserver le token géré par Cloudflare, `mariage build token` |
| Variable de build `NODE_VERSION` | `24` |
| Variable de build `SITE_URL` | `https://mariage.yassine-lakhdar.workers.dev` |

**Workers Builds gère l’authentification** : aucun token ni Account ID à copier dans GitHub. Ajouter les variables dans les réglages du build, pas dans les variables d’exécution du Worker. Le dossier de sortie `dist/` est déjà déclaré dans `wrangler.jsonc`.

### À chaque push sur `main`

Cloudflare Workers Builds installe les dépendances, exécute la commande de build (vérification, génération des photos et site), puis `npm run deploy`. Le nom `mariage` dans `wrangler.jsonc` correspond au Worker connecté.

Consulter les journaux dans **Cloudflare → Workers & Pages → mariage → Builds / Deployments**. Après avoir enregistré les réglages, pousser un commit ou relancer un build depuis Cloudflare. Inclure les originaux de `photos_mariage/` dans chaque push qui change les photos. Aucun workflow GitHub Actions de déploiement n’est nécessaire.

### Vérifier ou publier depuis le terminal

```sh
SITE_URL=https://mariage.yassine-lakhdar.workers.dev npm run build
npm run deploy:check
```

La vérification est locale et ne publie rien. Pour publier manuellement après le build :

```sh
npx wrangler login
npm run deploy
```

## Autre option : Cloudflare Pages

Les instructions suivantes concernent Pages, et non le Worker configuré ci-dessus.

### Première publication par téléversement

1. Exécuter `npm run build` : le site prêt à publier se trouve dans **`dist/`**.
2. Dans Cloudflare, ouvrir **Workers & Pages → Create application → Pages → Upload assets** (les libellés peuvent varier).
3. Nommer le projet, par exemple `yassine-marie-audree`, puis téléverser **le contenu de `dist/`**.
4. Cloudflare fournit l’adresse HTTPS gratuite, par exemple `https://yassine-marie-audree.pages.dev` (selon disponibilité).
5. Refaire le build avec cette adresse pour générer un aperçu de partage et une URL canonique absolus, puis téléverser le nouveau `dist/` :

```sh
SITE_URL=https://yassine-marie-audree.pages.dev npm run build
```

À chaque mise à jour, reconstruire puis publier le nouveau dossier `dist/`. L’adresse publique reste la même. Le fichier `.ics` se télécharge depuis la section calendrier ; il bloque les journées du 8, 9 et 10, sans inventer d’heure d’arrivée. Un calendrier déjà importé ne se synchronise pas automatiquement avec les futures modifications du site.

### Publication automatique depuis Git

Créer un projet Pages connecté au dépôt contenant ce dossier :

| Réglage | Valeur |
| --- | --- |
| Commande de build | `npm run build` |
| Dossier de sortie | `dist` |
| Variable `NODE_VERSION` | `24` |
| Variable `SITE_URL` | L’adresse HTTPS finale du projet |

Inclure `photos_mariage/` dans le dépôt pour que Cloudflare puisse générer les images. Si ce projet est dans un dépôt plus large, définir ce dossier comme racine du projet Pages. Chaque push sur la branche de production publie la nouvelle version.

### Publication depuis le terminal (optionnel)

Après connexion au compte Cloudflare :

```sh
npx wrangler login
npx wrangler pages deploy dist --project-name yassine-marie-audree
```

Les polices et les photos sont servies localement. Les seuls liens vers des services externes sont l’itinéraire Google Maps et Google Calendar.
