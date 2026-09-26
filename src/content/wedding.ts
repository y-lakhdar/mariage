/** Les informations de l’invitation : commencez ici pour mettre le site à jour. */
export const wedding = {
  names: ['Yassine Lakhdar', 'Marie-Audrée Murphy Desjardins'],
  title: 'Yassine & Marie-Audrée — On se marie !',
  description: 'Du 8 au 10 octobre 2027, retrouvez-nous à Grenville-sur-la-Rouge pour une fin de semaine d’amour, d’amitié et d’aventures. Réservez la date !',
  dates: {
    arrival: '2027-10-08',
    celebration: '2027-10-09',
    departure: '2027-10-10',
    // Fin exclusive pour inclure le dimanche dans les calendriers.
    calendarEnd: '2027-10-11',
    label: '8 — 10 octobre 2027',
  },
  address: '2311 Rte 148, Grenville-sur-la-Rouge, Québec J0V 1B0',
  town: 'Grenville-sur-la-Rouge',
  updated: '2026-09-26',
  intro: 'On a envie de célébrer notre amour entourés de nos amis. Une fin de semaine pour se retrouver, rire, jouer et profiter d’être ensemble. Attendez-vous à une célébration à notre image, loin du mariage traditionnel.',
  story: [
    'Tout a commencé avec une course. Et une petite liste un peu folle.',
    'Avant les 80 km de l’Ultra-Trail Harricana, on avait imaginé ce qui nous attendrait selon le classement de Yassine. À la 4e et à la 6e place, le même projet : on se marie !',
    'Résultat ? 6e au général et 4e dans sa catégorie. Le destin avait parlé… deux fois. Alors, on a décidé de lui donner raison.',
  ],
  // Remplacer null par { src: '/preuve.jpg', alt: 'Description de votre liste' }.
  storyProof: null as null | { src: string; alt: string },
  schedule: [
    { day: 'Vendredi', number: '08', title: 'On se retrouve.', text: 'On arrive, on s’installe et on prend le temps de se retrouver.', note: 'Heure d’arrivée à venir', icon: 'sun' },
    { day: 'Samedi', number: '09', title: 'On célèbre !', text: 'De l’amour, des amis et plein de beaux moments à partager. C’est notre grand jour.', note: 'Programme détaillé à venir', icon: 'heart' },
    { day: 'Dimanche', number: '10', title: 'On se dit à bientôt.', text: 'On profite encore un peu d’être ensemble, puis on repart avec de nouveaux souvenirs.', note: 'Heure de départ à venir', icon: 'spark' },
  ],
  practical: [
    { icon: 'moon', title: 'On reste à coucher', text: 'La fin de semaine se vit sur place, avec hébergement. Les détails pour les nuits et les réservations suivront.', status: 'Tarifs à confirmer' },
    { icon: 'plate', title: 'À table, ensemble', text: 'On prépare une formule pour partager de bons moments autour d’un repas. On vous raconte tout bientôt.', status: 'Formule à confirmer' },
    { icon: 'bow', title: 'Les tout-petits aussi', text: 'Pour les bébés des invités : nœud papillon obligatoire ! Et pensez à apporter des vêtements pour jouer.', status: 'Petits looks, grands sourires' },
  ],
  faq: [
    { question: 'Est-ce qu’on dort sur place ?', answer: 'Oui ! L’idée est de passer la fin de semaine ensemble, avec hébergement sur place. Les modalités, les tarifs et les détails de réservation seront ajoutés ici dès qu’ils seront confirmés.' },
    { question: 'Qu’est-ce qu’on doit apporter ?', answer: 'Prévoyez déjà des vêtements pour jouer et profiter de la fin de semaine. Pour les bébés des invités, on veut voir des nœuds papillon ! Une liste plus complète suivra, notamment pour l’hébergement.' },
    { question: 'Comment confirmer notre présence ?', answer: 'Pour l’instant, réservez simplement la fin de semaine dans votre calendrier. On vous communiquera la façon de confirmer votre présence un peu plus tard.' },
    { question: 'Et le menu, les horaires, les activités ?', answer: 'Tout ça se prépare ! Ce site évoluera au fil des préparatifs. Revenez y faire un tour : nous y ajouterons les horaires, les tarifs, la formule des repas et les jeux prévus.' },
  ],
};

// Six emplacements supplémentaires répartis dans le site, sans galerie autonome.
// Pour les remplacer : préparer la nouvelle image puis changer son identifiant ici.
export const scrollPhotos = {
  invitationLeft: { id: 'embrace', alt: 'Marie-Audrée enlace Yassine, tous deux souriants' },
  invitationRight: { id: 'canoe', alt: 'Un moment de complicité sur l’eau' },
  weekendBackdrop: { id: 'river', alt: 'Yassine et Marie-Audrée au bord d’une rivière' },
  weekendForeground: { id: 'ride', alt: 'Deux grands sourires dans la lumière de fin de journée' },
  detailsTransition: { id: 'desert', alt: 'Yassine et Marie-Audrée se tiennent la main' },
  closingBackdrop: { id: 'snow', alt: 'Yassine et Marie-Audrée côte à côte au grand air' },
};
