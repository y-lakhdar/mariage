/** Les informations de l’invitation : commencez ici pour mettre le site à jour. */
export const wedding = {
  names: ['Marie-Audrée Murphy Desjardins', 'Yassine Lakhdar'],
  title: 'Marie-Audrée & Yassine — On se marie !',
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
  updated: '2026-09-27',
  intro: 'On a envie de célébrer notre amour entourés de nos amis proches et notre famille. Une fin de semaine pour se retrouver, rire, jouer et profiter d’être ensemble.',
  story: [
    'On a décidé de faire une liste pour motiver Yassine à courir plus vite lors de son 80km d\'ultra-trail.',
    'Yass n\'était pas au courant de sa position durant la course, mais il est arrivé 6e overall et 4e dans sa catégorie d\'âge. Voilà!!!',
    'Il n\'y a pas eu de demande officielle à genou puisque Yassine ne se serait pas relevé du sol à ce moment.',
  ],
  storyProof: { id: 'preuve', alt: 'La liste avant Harricana : à la 4e et à la 6e place, « On se marie ». À la 7e, « On va chez Gab à 3 pistolets ! ».' },
  schedule: [
    { day: 'Vendredi', number: '08', title: 'On se retrouve.', text: 'On arrive le soir, on s’installe et on prend le temps de se retrouver.', note: 'Heure d’arrivée à venir', icon: 'sun' },
    { day: 'Samedi', number: '09', title: 'On célèbre !', text: 'Jeux, célébration, danse, etc.', note: 'Programme détaillé à venir', icon: 'heart' },
    { day: 'Dimanche', number: '10', title: 'On se dit à bientôt.', text: 'Retour à la maison.', note: 'Heure de départ à venir', icon: 'spark' },
  ],
  practical: [
    { icon: 'moon', title: 'On reste à coucher', text: 'La fin de semaine se vit sur place, avec hébergement. Les détails pour les nuits suivront.', status: 'Tarifs à confirmer' },
    { icon: 'plate', title: 'À table, ensemble', text: 'On prépare une formule pour partager de bons moments autour d’un repas. On vous raconte tout bientôt.', status: 'Formule à confirmer' },
    { icon: 'bow', title: 'Les tout-petits aussi', text: 'Pour les bébés des invités : nœud papillon obligatoire ! Et pensez à apporter des vêtements pour jouer.', status: 'Petits looks, grands sourires' },
  ],
};

// Cinq emplacements supplémentaires répartis dans le site, sans galerie autonome.
// Pour les remplacer : préparer la nouvelle image puis changer son identifiant ici.
export const scrollPhotos = {
  invitationLeft: { id: 'climbing', alt: 'Marie-Audrée et Yassine échangent un sourire entre les rochers, équipés pour l’escalade' },
  weekendBackdrop: { id: 'embrace', alt: 'Marie-Audrée enlace Yassine, tous deux souriants' },
  weekendForeground: { id: 'mtl', alt: 'Marie-Audrée dans les bras de Yassine devant un miroir à Montréal' },
  detailsTransition: { id: 'amis', alt: 'Marie-Audrée et Yassine entourés de leurs amis et d’un chien au sommet d’une montagne' },
  endingPhoto: { id: 'end', alt: 'Marie-Audrée et Yassine s’éloignent main dans la main sur un sentier, leur matériel d’escalade sur le dos' },
};
