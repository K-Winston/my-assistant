/* =====================================================================
   CONTENU DU SITE — fichier unique à modifier pour changer les textes,
   les coordonnées, les prestations, les communes et les photos.

   Règles simples :
   - Ne modifiez que le texte entre les guillemets '...'.
   - Si votre texte contient une apostrophe ('), écrivez-la ’ (apostrophe
     typographique) ou précédez-la d'une barre oblique : \'
   - Tout ce qui est marqué [À COMPLÉTER : …] doit être remplacé avant la
     mise en ligne (ces textes apparaissent surlignés en jaune sur le site).
   - Photos : déposez le fichier dans public/photos/ avec le nom indiqué
     (ex. hero.jpg). Le site les optimise automatiquement au build.
   ===================================================================== */

export const company = {
  /** Nom commercial affiché partout (logo, titres, mentions légales).
   *  Il est ajouté à la fin des titres d'onglet (« … | Nom ») tant que le total
   *  reste sous 70 caractères ; au-delà, le titre est affiché seul. */
  name: '[NOM DE L’ENTREPRISE]',
  /** Prénom et nom de l'artisan. */
  owner: 'Stéphane [À COMPLÉTER : nom de famille]',
  ownerFirstName: 'Stéphane',
  activity: 'Maçonnerie générale, tous corps d’état',
  legalForm: '[À COMPLÉTER : forme juridique, ex. entreprise individuelle, SARL…]',
  siret: '[À COMPLÉTER : SIRET]',
  vat: '[À COMPLÉTER : n° de TVA intracommunautaire, ou « non applicable »]',
  rcsOrRm: '[À COMPLÉTER : immatriculation RCS ou Répertoire des métiers]',
  insurance: {
    label: 'Assurance décennale',
    insurer: '[À COMPLÉTER : nom de l’assureur]',
    policyNumber: '[À COMPLÉTER : n° de contrat]',
    coverage: '[À COMPLÉTER : zone géographique couverte]',
  },
};

export const contact = {
  /** Numéro affiché (format lisible). */
  phoneDisplay: '[À COMPLÉTER : 06 00 00 00 00]',
  /** Même numéro au format international, sans espaces, pour le lien « Appeler ». */
  phoneLink: '+33600000000',
  email: '[À COMPLÉTER : adresse e-mail]',
  address: {
    street: '[À COMPLÉTER : rue]',
    postalCode: '[À COMPLÉTER : code postal]',
    city: '[À COMPLÉTER : commune]',
  },
  /** Horaires affichés sur le site (une ligne par entrée). */
  hours: ['[À COMPLÉTER : ex. du lundi au vendredi, 7 h 30 – 18 h]'],
  /** Horaires pour Google (format schema.org). Laisser vide si inconnus. */
  hoursSchema: [] as string[], // ex. ['Mo-Fr 07:30-18:00']
  /** Lien vers la fiche Google (avis clients). */
  googleReviewsUrl: '', // [À COMPLÉTER : lien de la fiche Google Business Profile]
};

export const site = {
  /** Texte du logo dans l'en-tête. */
  logoText: '[NOM DE L’ENTREPRISE]',
  defaultTitle: 'Maçon tous corps d’état à Graveson, Saint-Rémy',
  defaultDescription:
    'Maçonnerie générale et tous corps d’état : fondations, extensions, toiture, électricité, plomberie et placo. Un seul artisan à Graveson, Maillane, Saint-Rémy-de-Provence et Bellegarde.',
  ogImage: '/og-image.jpg',
  locale: 'fr_FR',
};

/** Hébergeur et directeur de publication (mentions légales). */
export const legal = {
  publicationDirector: 'Stéphane [À COMPLÉTER : nom de famille]',
  host: {
    name: 'Netlify, Inc.',
    address: '[À COMPLÉTER : adresse postale de Netlify, Inc., indiquée sur netlify.com]',
    contact: 'www.netlify.com',
  },
  /** Durée de conservation des demandes de devis. */
  retention: '3 ans à compter du dernier contact',
  lastUpdate: '[À COMPLÉTER : date de mise en ligne]',
};

/** Navigation principale (ancres de la page d'accueil). */
export const nav = [
  { label: 'Prestations', href: '/prestations/' },
  { label: 'Notre histoire', href: '/notre-histoire/' },
  { label: 'Réalisations', href: '/realisations/' },
  { label: 'Contact', href: '/contact/' },
];

/** Titres et descriptions des pages (Google, onglet du navigateur). */
export const pages = {
  prestations: {
    title: 'Prestations',
    seoTitle: 'Maçonnerie, toiture, électricité, plomberie, placo à Graveson',
    seoDescription:
      'Les six métiers de l’entreprise, des fondations à la toiture : gros œuvre, maçonnerie et extensions, toiture, électricité, plomberie, placo. Graveson, Maillane, Saint-Rémy-de-Provence, Bellegarde.',
    lead: 'Un seul artisan pour chaque niveau de la maison. Choisissez un repère sur la coupe ou dans la liste.',
  },
  histoire: {
    title: 'Notre histoire',
    seoTitle: 'Notre histoire : un savoir-faire transmis de père en fils',
    seoDescription:
      'Le père de Stéphane a fait son parcours chez les Compagnons du Devoir, en maçonnerie. Stéphane a appris à ses côtés tous les métiers du bâtiment.',
  },
  realisations: {
    title: 'Réalisations',
    seoTitle: 'Réalisations : chantiers avant et après à Graveson et alentours',
    seoDescription:
      'Chantiers de maçonnerie, rénovation et extension réalisés à Graveson, Maillane, Saint-Rémy-de-Provence et Bellegarde, en photos avant et après.',
  },
  contact: {
    title: 'Contact et devis',
    seoTitle: 'Contact et demande de devis, maçon à Graveson',
    seoDescription:
      'Demandez un devis pour vos travaux de maçonnerie, toiture, électricité, plomberie ou placo à Graveson, Maillane, Saint-Rémy-de-Provence et Bellegarde.',
  },
};

export const hero = {
  kicker: 'Maçonnerie générale · Tous corps d’état',
  title: 'Des fondations à la toiture.',
  text: 'Un seul artisan pour tout votre chantier : gros œuvre, toiture, électricité, plomberie et placo. Un savoir-faire transmis de père en fils, à Graveson, Maillane, Saint-Rémy-de-Provence et Bellegarde.',
  ctaQuote: 'Demander un devis',
  ctaCall: 'Appeler',
  badges: ['Garantie décennale', 'Un seul interlocuteur', 'Savoir-faire transmis par un compagnon'],
  /** Petit formulaire du cartouche : choisir le type de travaux avant d'ouvrir le formulaire de devis. */
  quickLabel: 'Type de travaux',
  callText: 'Ou appelez Stéphane',
  /** Légende sous la coupe de la maison. */
  coupeCaption: 'Coupe de principe. Chaque repère ouvre la prestation correspondante.',
};

export type IconName = 'foundation' | 'wall' | 'roof' | 'electric' | 'plumbing' | 'drywall';

export interface Service {
  slug: string;
  icon: IconName;
  /** Nom court affiché sur la coupe de la maison (page d'accueil). */
  short: string;
  /** Repère sur la coupe : A = en bas (fondations) … F = en haut (toiture). */
  mark: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  title: string;
  /** Résumé court affiché sur la carte de l'accueil. */
  summary: string;
  /** Titre pour Google (70 caractères max) et description (≈ 155 caractères). */
  seoTitle: string;
  seoDescription: string;
  /** Paragraphes d'introduction de la page prestation. */
  intro: string[];
  /** Liste « Ce qui est inclus ». */
  included: string[];
  photos: { file: string; alt: string }[];
}

export const services: Service[] = [
  {
    slug: 'fondations-gros-oeuvre',
    icon: 'foundation',
    short: 'Fondations',
    mark: 'A',
    title: 'Fondations & gros œuvre',
    summary: 'Terrassement, fondations, dalles, murs porteurs et élévations.',
    seoTitle: 'Fondations et gros œuvre à Graveson et Saint-Rémy-de-Provence',
    seoDescription:
      'Terrassement, fondations, dalles, murs porteurs et élévations par un maçon tous corps d’état à Graveson, Maillane, Saint-Rémy-de-Provence et Bellegarde.',
    intro: [
      'Le gros œuvre porte tout le reste de la maison. C’est la partie du chantier où l’on ne transige pas : implantation, profondeur des fondations, ferraillage et niveaux sont contrôlés à chaque étape.',
      'Comme le même artisan réalise ensuite les murs, la toiture et les réseaux, les réservations et les attentes sont prévues dès le départ.',
    ],
    included: [
      'Terrassement et préparation du terrain',
      'Fondations : semelles, longrines',
      'Dalles et planchers',
      'Murs porteurs',
      'Élévations',
    ],
    photos: [
      { file: 'prestation-fondations-gros-oeuvre-1', alt: '[À COMPLÉTER : description de la photo de fondations]' },
      { file: 'prestation-fondations-gros-oeuvre-2', alt: '[À COMPLÉTER : description de la photo de gros œuvre]' },
    ],
  },
  {
    slug: 'maconnerie-extensions',
    icon: 'wall',
    short: 'Maçonnerie',
    mark: 'B',
    title: 'Maçonnerie & extensions',
    summary: 'Agrandissements, murs de clôture, pierre, enduits et ouvertures.',
    seoTitle: 'Maçonnerie et extension à Graveson et Saint-Rémy-de-Provence',
    seoDescription:
      'Agrandissement de maison, murs de clôture, travaux en pierre, enduits et création d’ouvertures à Graveson, Maillane, Saint-Rémy-de-Provence et Bellegarde.',
    intro: [
      'Agrandir une maison, monter un mur de clôture, reprendre une façade ou créer une ouverture dans un mur porteur : c’est le cœur du métier de maçon.',
      'Pour une extension, le chantier est suivi de bout en bout, du terrassement jusqu’aux finitions intérieures, sans avoir à coordonner plusieurs entreprises.',
    ],
    included: [
      'Agrandissements et extensions',
      'Murs de clôture',
      'Travaux en pierre',
      'Enduits de façade',
      'Création et agrandissement d’ouvertures',
    ],
    photos: [
      { file: 'prestation-maconnerie-extensions-1', alt: '[À COMPLÉTER : description de la photo d’extension]' },
      { file: 'prestation-maconnerie-extensions-2', alt: '[À COMPLÉTER : description de la photo de mur en pierre]' },
    ],
  },
  {
    slug: 'toiture',
    icon: 'roof',
    short: 'Toiture',
    mark: 'F',
    title: 'Toiture',
    summary: 'Charpente, couverture en tuiles, réparation et rénovation.',
    seoTitle: 'Toiture et charpente à Graveson et Saint-Rémy-de-Provence',
    seoDescription:
      'Charpente, couverture en tuiles, réparation et rénovation de toiture à Graveson, Maillane, Saint-Rémy-de-Provence et Bellegarde.',
    intro: [
      'Une toiture protège tout le travail réalisé en dessous. Charpente et couverture sont traitées ensemble, pour une construction neuve, une extension ou la rénovation d’un toit existant.',
      'Une tuile déplacée ou une fuite peut aussi faire l’objet d’une simple réparation.',
    ],
    included: ['Charpente', 'Couverture en tuiles', 'Réparation de toiture', 'Rénovation de toiture'],
    photos: [
      { file: 'prestation-toiture-1', alt: '[À COMPLÉTER : description de la photo de charpente]' },
      { file: 'prestation-toiture-2', alt: '[À COMPLÉTER : description de la photo de couverture]' },
    ],
  },
  {
    slug: 'electricite',
    icon: 'electric',
    short: 'Électricité',
    mark: 'D',
    title: 'Électricité',
    summary: 'Installation, mise aux normes et rénovation électrique.',
    seoTitle: 'Électricité et mise aux normes à Graveson et Saint-Rémy-de-Provence',
    seoDescription:
      'Installation électrique, mise aux normes et rénovation électrique dans le cadre de vos travaux à Graveson, Maillane, Saint-Rémy-de-Provence et Bellegarde.',
    intro: [
      'L’électricité se prévoit en même temps que les murs et les cloisons. Les gaines, boîtiers et passages sont posés au bon moment du chantier, sans saignées à refaire après coup.',
      'Pour une maison existante, le tableau et les circuits peuvent être repris et mis aux normes.',
    ],
    included: ['Installation électrique', 'Mise aux normes', 'Rénovation électrique'],
    photos: [
      { file: 'prestation-electricite-1', alt: '[À COMPLÉTER : description de la photo de tableau électrique]' },
      { file: 'prestation-electricite-2', alt: '[À COMPLÉTER : description de la photo d’installation électrique]' },
    ],
  },
  {
    slug: 'plomberie',
    icon: 'plumbing',
    short: 'Plomberie',
    mark: 'C',
    title: 'Plomberie',
    summary: 'Réseaux d’eau, salles de bain, sanitaires et évacuations.',
    seoTitle: 'Plomberie et salle de bain à Graveson et Saint-Rémy-de-Provence',
    seoDescription:
      'Réseaux d’eau, création de salle de bain, sanitaires et évacuations dans le cadre de vos travaux à Graveson, Maillane, Saint-Rémy-de-Provence et Bellegarde.',
    intro: [
      'Arrivées d’eau, évacuations, salle de bain : la plomberie est réalisée par le même artisan que la maçonnerie, ce qui facilite les passages dans les dalles et les murs.',
      'Les réseaux sont posés avant les doublages et les finitions.',
    ],
    included: ['Réseaux d’eau', 'Salles de bain', 'Sanitaires', 'Évacuations'],
    photos: [
      { file: 'prestation-plomberie-1', alt: '[À COMPLÉTER : description de la photo de salle de bain]' },
      { file: 'prestation-plomberie-2', alt: '[À COMPLÉTER : description de la photo de réseau d’eau]' },
    ],
  },
  {
    slug: 'placo-amenagement',
    icon: 'drywall',
    short: 'Placo',
    mark: 'E',
    title: 'Placo & aménagement',
    summary: 'Cloisons, doublages, faux plafonds et isolation intérieure.',
    seoTitle: 'Placo et isolation intérieure à Graveson et Saint-Rémy-de-Provence',
    seoDescription:
      'Cloisons, doublages, faux plafonds et isolation intérieure en plaques de plâtre à Graveson, Maillane, Saint-Rémy-de-Provence et Bellegarde.',
    intro: [
      'Cloisons, doublages et faux plafonds donnent leur forme aux pièces. Ils viennent en fin de gros œuvre, une fois les réseaux électriques et de plomberie en place.',
      'L’isolation intérieure est posée en même temps que les doublages.',
    ],
    included: ['Cloisons', 'Doublages', 'Faux plafonds', 'Isolation intérieure'],
    photos: [
      { file: 'prestation-placo-amenagement-1', alt: '[À COMPLÉTER : description de la photo de cloisons]' },
      { file: 'prestation-placo-amenagement-2', alt: '[À COMPLÉTER : description de la photo de faux plafond]' },
    ],
  },
];

export const story = {
  title: 'Un savoir-faire transmis de père en fils',
  paragraphs: [
    'Le père de Stéphane a fait tout son parcours chez les Compagnons du Devoir, en maçonnerie.',
    'Dès son plus jeune âge, Stéphane l’a suivi sur les chantiers. À ses côtés, il a appris l’exigence du travail bien fait et tous les métiers du bâtiment.',
    'C’est cette façon de travailler qu’il applique aujourd’hui à chaque chantier : un seul artisan, qui connaît chaque étape, des fondations à la toiture.',
  ],
  photo: { file: 'histoire', alt: '[À COMPLÉTER : description de la photo, ex. Stéphane sur un chantier]' },
  /** Grande photo de chantier, en largeur. */
  photoWide: { file: 'chantier', alt: '[À COMPLÉTER : description de la photo, ex. mur en pierre en cours de montage]' },
};

export const realisations = {
  title: 'Avant, après',
  intro: 'Quelques chantiers réalisés dans le secteur.',
  items: [
    {
      title: '[À COMPLÉTER : titre du chantier 1]',
      town: '[À COMPLÉTER : commune]',
      before: { file: 'realisation-1-avant', alt: '[À COMPLÉTER : description de la photo avant]' },
      after: { file: 'realisation-1-apres', alt: '[À COMPLÉTER : description de la photo après]' },
    },
    {
      title: '[À COMPLÉTER : titre du chantier 2]',
      town: '[À COMPLÉTER : commune]',
      before: { file: 'realisation-2-avant', alt: '[À COMPLÉTER : description de la photo avant]' },
      after: { file: 'realisation-2-apres', alt: '[À COMPLÉTER : description de la photo après]' },
    },
    {
      title: '[À COMPLÉTER : titre du chantier 3]',
      town: '[À COMPLÉTER : commune]',
      before: { file: 'realisation-3-avant', alt: '[À COMPLÉTER : description de la photo avant]' },
      after: { file: 'realisation-3-apres', alt: '[À COMPLÉTER : description de la photo après]' },
    },
  ],
};

export const area = {
  title: 'Graveson et alentours',
  intro: 'L’entreprise intervient principalement dans les communes suivantes et dans les villages voisins.',
  towns: ['Graveson', 'Maillane', 'Saint-Rémy-de-Provence', 'Bellegarde'],
  aroundText: 'Votre commune n’est pas dans la liste ? Appelez pour en parler.',
  reviews: {
    title: 'Avis clients',
    text: 'Les avis laissés par les clients sont publiés sur la fiche Google de l’entreprise.',
    cta: 'Lire les avis sur Google',
  },
};

export const contactSection = {
  title: 'Demander un devis',
  intro: 'Décrivez votre projet en quelques lignes. Stéphane vous recontacte pour en parler.',
  form: {
    submit: 'Envoyer ma demande',
    sending: 'Envoi en cours…',
    success: 'Demande envoyée. Stéphane vous rappelle dès que possible.',
    error: 'La demande n’a pas pu être envoyée. Vérifiez votre connexion ou appelez directement.',
    consent:
      'J’accepte que les informations saisies soient utilisées pour être recontacté au sujet de ma demande de devis.',
    workTypes: [...services.map((s) => s.title), 'Plusieurs corps d’état / projet complet', 'Autre'],
  },
};

/** Page de confirmation après envoi du formulaire (sans JavaScript). */
export const thanks = {
  title: 'Demande envoyée',
  text: 'Merci. Votre demande a bien été transmise. Stéphane vous rappelle dès que possible.',
  back: 'Retour à l’accueil',
};

export const notFound = {
  title: 'Page introuvable',
  text: 'Cette page n’existe pas ou a été déplacée.',
  back: 'Retour à l’accueil',
};

/** Utilitaire : vrai si un texte est encore à compléter. */
export const isTodo = (value: string) => value.includes('[À COMPLÉTER') || value.includes('[NOM DE');
