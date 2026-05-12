// Sanity-dokumenttype for kategorier
const category = {
  // Intern type-identifikator brukt av Sanity
  name: "category",

  // Visningsnavn i Sanity Studio (det redaktørene ser)
  title: "Kategori",

  // Angir at dette er en dokumenttype som kan opprettes i CMS
  type: "document",

  // Feltdefinisjoner for dokumenttypen
  fields: [
    {
      // Internt navn på feltet i databasen/objektet
      name: "categoryname",

      // Label som vises i Studio for dette feltet
      title: "Kategorinavn",

      // Feltets datatype; "string" betyr enkelt tekstfelt
      type: "string"

      // Tips: du kan legge til validation: Rule => Rule.required() for å gjøre feltet obligatorisk
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
        // Angir hvilket felt slug kan bygges fra (her: kategorinavnet)
        source: 'categoryname',

        // Egendefinert funksjon som konverterer input til en slug
        // Forklaring av steg i funksjonen:
        // 1) .toLowerCase() — gjør alle bokstaver små
        // 2) .replace(/\s+/g, '-') — erstatter ett eller flere mellomrom med bindestrek
        // 3) .slice(0, 100) — begrenser lengden til maks 100 tegn
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 100)

        // Merk: Når du setter slugify eksplisitt, overstyrer du Sanitys standard normalisering.
        // Hvis du trenger å fjerne spesialtegn (æøå, punktum, komma osv.), kan du legge til ekstra replace-regex.
      }
    },

    {
      // Internt navn for bildefeltet
      name: "categoryimage",

      // Label som vises i Studio
      title: "Kategoribilde",

      // Angir at dette feltet lagrer et bilde
      type: "image"

      // Tips: du kan legge til "options: { hotspot: true }" for å aktivere fokuspunkt-redigering i Studio
      // og "fields: [{ name: 'alt', type: 'string', title: 'Alt-tekst' }]" for å lagre alternativ tekst for tilgjengelighet.
    }
  ]
}

// Eksporterer schema-objektet som standard ES-modul
export default category
