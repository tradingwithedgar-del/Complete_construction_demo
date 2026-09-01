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
