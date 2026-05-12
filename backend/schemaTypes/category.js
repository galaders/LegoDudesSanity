// Sanity-dokumenttype for kategorier
const category = {
    name: "category", // intern type-identifikator
    title: "Kategori", // visningsnavn i Studio
    type: "document", // dokumenttype som kan opprettes i CMS
    fields: [
        {
            name: "categoryname", // feltets interne navn
            title: "Kategorinavn", // etikett i Studio
            type: "string" // tekstfelt for kategoriens navn
        },
        {
            title: 'Slug',
            name: 'slug',
            type: 'slug',
            options: {
                source: 'categoryname', // bygger slug fra kategorinavnet
                slugify: input => input
                                    .toLowerCase() // små bokstaver
                                    .replace(/\s+/g, '-') // erstatter mellomrom med bindestrek
                                    .slice(0, 100) // maks 100 tegn
            }
        },
        {
            name: "categoryimage",
            title: "Kategoribilde",
            type: "image" // bildefelt for kategoriens illustrasjon
        }
    ]
}

export default category // eksporterer schema-objektet for bruk i Sanity-konfigurasjonen