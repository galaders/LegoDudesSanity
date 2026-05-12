// Sanity-dokumenttype for produkter
const products = {
  // Intern type-identifikator brukt av Sanity
  name: "product",

  // Visningsnavn i Sanity Studio (det redaktørene ser)
  title: "Produkter",

  // Angir at dette er en dokumenttype som kan opprettes i CMS
  type: "document",

  // Feltdefinisjoner for dokumenttypen
  fields: [
    {
      // Internt navn på feltet i databasen/objektet
      name: "productname",

      // Label som vises i Studio for dette feltet
      title: "Produktnavn",

      // Feltets datatype; "string" betyr enkelt tekstfelt
      type: "string"

      // Tips: legg til validation: Rule => Rule.required() for å gjøre feltet obligatorisk
    },

    {
      // Visningsetikett for slug-feltet i Studio
      title: 'Slug',

      // Internt navn for slug-feltet
      name: 'slug',

      // Spesialtype for URL-vennlig tekst (brukes ofte i ruter/URLer)
      type: 'slug',

      // Konfigurasjon for hvordan slug genereres og normaliseres
      options: {
        // Angir hvilket felt slug kan bygges fra (her: produktnavnet)
        source: 'productname',

        // Egendefinert funksjon som konverterer input til en slug
        // 1) .toLowerCase() — gjør alle bokstaver små
        // 2) .replace(/\s+/g, '-') — erstatter ett eller flere mellomrom med bindestrek
        // 3) .slice(0, 100) — begrenser lengden til maks 100 tegn
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 100)

        // Merk: Du kan utvide denne funksjonen for å fjerne spesialtegn eller normalisere æøå.
      }
    },

    {
      // Internt navn for prisfeltet
      name: "price",

      // Label som vises i Studio
      title: "Pris",

      // Numerisk felt for pris; Sanity lagrer dette som tall
      type: "number"

      // Tips: vurder å lagre valuta separat eller bruke validering for min/max
    },

    {
      // Internt navn for lagerbeholdning
      name: "quantity",

      // Label som vises i Studio
      title: "Antall på lager",

      // Numerisk felt for antall enheter på lager
      type: "number"

      // Tips: bruk validation: Rule => Rule.integer().min(0) for å sikre heltall >= 0
    },

    {
      // Internt navn for produktbilde
      name: "productimage",

      // Label som vises i Studio
      title: "Produktbilde",

      // Angir at dette feltet lagrer et bilde
      type: "image"

      // Tips: legg til options: { hotspot: true } for fokuspunkt og fields: [{ name: 'alt', type: 'string', title: 'Alt-tekst' }]
    },

    {
      // Internt navn for kategorireferanse
      name: "productcategory",

      // Label som vises i Studio
      title: "Kategori",

      // Referansefelt som peker til et dokument av typen "category"
      type: "reference",

      // 'to' angir hvilke dokumenttyper som kan refereres
      to: [{ type: "category" }]

      // Dette gjør det enkelt å koble produktet til en eksisterende kategori i CMS
    },

    {
      // Internt navn for beskrivelse
      name: "description",

      // Label som vises i Studio
      title: "Beskrivelse",

      // Større tekstfelt for produktbeskrivelse
      type: "text",

      // Antall rader som vises i Studio for redigering
      rows: 5

      // Tips: bruk 'block content' (type: 'array' of blocks) for rik tekst hvis du trenger formatering
    },

    {
      // Internt navn for relaterte produkter
      name: "relatedProducts",

      // Label som vises i Studio
      title: "Relaterte produkter",

      // Array-felt som inneholder en liste med elementer
      type: "array",

      // Definerer hvilke typer elementer arrayet kan inneholde
      of: [
        {
          // Hver post i arrayet er en referanse til et annet produkt
          type: "reference",
          to: [{ type: "product" }]
        }
      ]

      // Nyttig for å vise "Du kan også like" eller kryss-salg i frontend
    }
  ],

  // Preview-konfigurasjon bestemmer hvordan dokumentet vises i lister i Studio
  preview: {
    select: {
      // Hvilket felt som brukes som tittel i listevisning
      title: "productname",

      // Henter kategoriens navn via referansen (dot-notation)
      inCat: "productcategory.categoryname",

      // Bruker produktbildet som ikon/thumbnail i listen
      image: "productimage"
    },

    // prepare formaterer det valgte innholdet til et objekt Studio forstår
    prepare(selection) {
      const { title, inCat, image } = selection

      return {
        // Tittel som vises i Studio-liste
        title: title,

        // Undertekst som viser kategori eller "Ukjent" hvis ingen kategori er satt
        subtitle: `Kategori: ${inCat ? inCat : "Ukjent"}`,

        // Media (ikon) som vises i listen; kan være et bildeobjekt
        media: image
      }
    }
  }
}

// Eksporterer produktskjematype som standard ES-modul
export default products
