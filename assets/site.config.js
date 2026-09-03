/* ==========================================================================
   Complete Construction & Home Solutions LLC — site content & configuration
   --------------------------------------------------------------------------
   This is the ONLY file you need to edit for day-to-day content changes:
   phone number, service area, which services are shown, and which trust
   claims appear.

   HOW THE APPROVAL GATES WORK
   Anything the business owner has not yet confirmed is OFF by default.
   The matching markup in index.html carries the `hidden` attribute, and it
   is only revealed when the flag below is set to true. That means an
   unverified claim can never ship by accident, and it stays hidden even if
   JavaScript fails to load.

   Set a flag to true ONLY after the owner has confirmed it in writing.
   ========================================================================== */

window.SITE = {

  /* ---------------------------------------------------------------- */
  /* Business identity                                                */
  /* ---------------------------------------------------------------- */
  business: {
    name: "Complete Construction",
    legalName: "Complete Construction & Home Solutions LLC",
    // Confirmed: this is the number the owner gave us.
    phoneDisplay: "(732) 890-6244",
    phoneE164: "+17328906244",
    // TODO(owner): confirm a business email before launch.
    email: "",
    // TODO(owner): confirm the base city. Left blank on purpose so the
    // page says "New Jersey" rather than naming a town we cannot verify.
    city: "",
    state: "NJ",
    // TODO(owner): replace once the real domain is registered.
    url: "https://completeconstructionnj.com/"
  },

  /* ---------------------------------------------------------------- */
  /* Approval gates — every one of these starts false                 */
  /* ---------------------------------------------------------------- */
  flags: {
    // Is the business number able to receive SMS? Until this is true the
    // "Text us photos" CTA and the photo-by-text form option stay hidden.
    smsEnabled: false,

    // Does the business actively handle Spanish-speaking enquiries?
    // Controls the "Hablamos español" line and the English/Spanish item in
    // the trust line. The EN/ES page toggle itself is separate (see i18n).
    spanishSupported: false,

    // "Licensed & Insured". The proposals say "fully insured, certificate
    // available on request", which is the owner's own wording, but nothing
    // has been verified about licensing or NJ HIC registration.
    licensedAndInsuredClaim: false,

    // "One-year workmanship warranty". Present in both of the owner's
    // written proposals, but still needs a yes before it goes public.
    warrantyClaim: false,

    // Show the customer testimonial section. Keep false until real,
    // attributable testimonials are supplied. There are no placeholder
    // testimonials in the markup — the section simply does not render.
    testimonials: false,

    // NJ Home Improvement Contractor registration (13VH…). New Jersey
    // requires registered contractors to display this in advertising.
    showRegistrationNumber: false
  },

  /* ---------------------------------------------------------------- */
  /* Language                                                          */
  /* ---------------------------------------------------------------- */
  i18n: {
    // The EN/ES page toggle. Set to false to remove the control entirely.
    enabled: true,
    labels: { en: "English", es: "Español" }
  },

  /* ---------------------------------------------------------------- */
  /* Services — set `enabled: false` to hide a card completely         */
  /* ---------------------------------------------------------------- */
  services: [
    { id: "whole-home",  enabled: true  },
    { id: "kitchen-bath", enabled: true  },
    { id: "additions",   enabled: true  },
    { id: "millwork",    enabled: true  },
    // TODO(owner): confirm before enabling. Ground-up residential
    // construction is a very different licensing and insurance question
    // than remodeling, so this stays off until the owner says yes.
    { id: "new-build",   enabled: false },
    // TODO(owner): confirm scope of exterior and structural work.
    { id: "exterior",    enabled: false }
  ],

  /* ---------------------------------------------------------------- */
  /* Service area — only counties the owner has confirmed              */
  /* ---------------------------------------------------------------- */
  serviceArea: {
    // `confirmed: true` counties render. Ocean and Hudson are evidenced by
    // documented job sites; the other two are inferred from the 732 area
    // code and need a yes before they are published.
    counties: [
      { name: "Ocean County",     confirmed: true  },
      { name: "Hudson County",    confirmed: true  },
      { name: "Monmouth County",  confirmed: false },
      { name: "Middlesex County", confirmed: false }
    ]
  },

  /* ---------------------------------------------------------------- */
  /* Portfolio categories                                              */
  /* ---------------------------------------------------------------- */
  // Filters render ONLY for categories that contain published work, so an
  // empty "New Builds" filter can never appear. Add a category here as soon
  // as a real project in it is added to index.html with a matching
  // data-category value.
  portfolio: {
    categoryLabels: {
      "all": "All work",
      "bathrooms": "Bathrooms",
      "whole-home": "Whole home",
      "kitchens": "Kitchens",
      "additions": "Additions",
      "millwork": "Custom millwork",
      "new-builds": "New builds"
    },
    // Hide the filter row entirely while only one real category exists.
    showFiltersWhenSingleCategory: false
  },

  /* ---------------------------------------------------------------- */
  /* Gallery                                                          */
  /* ---------------------------------------------------------------- */
  /* One page, no extra pages. The grid below is filtered in place, so
     adding a room type never means building another page.

     TO ADD A NEW ROOM (say kitchens):
       1. Drop the photos in  images/gallery/kitchens/
       2. Add a label to `categories` below:   kitchens: "Kitchens"
       3. Add one line per photo to `images` with category: "kitchens"
     The "Kitchens" filter button then appears on its own.

     A filter button is only rendered for a category that actually holds
     photos, so an empty "Kitchens" tab can never show up. Nothing else
     needs touching. */
  gallery: {
    // Label shown on the filter button. Add or rename freely.
    categories: {
      all:         "All rooms",
      bathrooms:   "Bathrooms",
      kitchens:    "Kitchens",
      livingRooms: "Living rooms",
      wholeHome:   "Whole home",
      exteriors:   "Exteriors",
      millwork:    "Millwork",
      details:     "Details"
    },

    // Every photo in the gallery. `category` must match a key above.
    // Write `alt` describing what is actually visible in the photo.
    images: [
      { src: "images/powder-mirror-brass.jpg",        category: "bathrooms", alt: "Oval brass-framed mirror and brass tapware against dark botanical wall covering" },
      { src: "images/shower-green-tile-brass.jpg",    category: "bathrooms", alt: "Shower in stacked dark glazed tile with a brass recessed niche and patterned mosaic floor" },
      { src: "images/wallpaper-detail.jpg",           category: "bathrooms", alt: "Close detail of botanical wall covering showing a bird among foliage" },
      { src: "images/powder-marble-vanity.jpg",       category: "bathrooms", alt: "Marble waterfall vanity with brass tapware and a framed mirror lit by a brass light bar" },
      { src: "images/powder-marble-herringbone.jpg",  category: "bathrooms", alt: "Marble waterfall vanity seen from above with the herringbone mosaic floor below" },
      { src: "images/powder-herringbone-floor.jpg",   category: "bathrooms", alt: "Herringbone marble mosaic floor meeting a marble base and painted wainscot" },
      { src: "images/bath-marble-shower.jpg",         category: "bathrooms", alt: "Walk-in shower with glass doors, marble-look porcelain walls and a matte black grab rail" },
      { src: "images/bath-shower-niche.jpg",          category: "bathrooms", alt: "Recessed shower niche tiled in dark hex mosaic against marble-look porcelain" },
      { src: "images/bath-marble-floor.jpg",          category: "bathrooms", alt: "Finished bathroom floor in marble-look porcelain with the glass shower enclosure behind" },

      { src: "images/materials/brass-niche.jpg",      category: "details",   alt: "Unlacquered brass shower valve and handshower against dark glazed tile" },
      { src: "images/materials/glazed-tile.jpg",      category: "details",   alt: "Stacked dark glazed ceramic tile with a brass-lined recessed niche" },
      { src: "images/materials/marble.jpg",           category: "details",   alt: "Marble waterfall vanity with a carved basin and brass tapware" },
      { src: "images/materials/herringbone.jpg",      category: "details",   alt: "Marble mosaic floor laid in a herringbone pattern" },
      { src: "images/materials/walnut.jpg",           category: "details",   alt: "Walnut floating vanity carcass beneath a white trough basin" },
      { src: "images/materials/wallpaper.jpg",        category: "details",   alt: "Dark botanical wall covering showing painted foliage and a bird" }
    ]
  },

  /* ---------------------------------------------------------------- */
  /* Contact form                                                     */
  /* ---------------------------------------------------------------- */
  /* The form posts straight to Web3Forms, which emails the enquiry to
     whichever inbox the key was created against. No server, no build
     step, nothing to maintain.

     A Web3Forms access key is PUBLIC by design. It identifies the
     destination inbox, it is not a credential, and it cannot be used to
     read anything back. It is safe to keep in this file. Do not put
     anything here that would not be safe to publish. */
  form: {
    // TODO(owner): create a free key at https://web3forms.com using the
    // business email that should receive enquiries, then paste it here.
    // Until this is filled in, the form refuses to submit and says so,
    // rather than showing a false confirmation.
    web3formsAccessKey: "",

    // Email subject prefix. The project type and town are appended
    // automatically so enquiries can be triaged from the inbox list.
    subjectPrefix: "New project enquiry",

    sourcePage: "home"
  }
};
