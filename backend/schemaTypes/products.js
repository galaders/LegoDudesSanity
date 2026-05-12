// Sanity-dokumenttype for produkter

const products = {
    name: "product", // intern type-identifikator
    title: "Produkter", // visningsnavn i Studio
    type: "document", // produkt er et eget dokument
    fields: [
        {
            name: "productname",
            title: "Produktnavn",
            type: "string" // tekstfelt for produktnavn
        },
        {
            title: 'Slug',
            name: 'slug',
            type: 'slug',
            options: {
                source: 'productname', // bygger slug fra produktnavnet
                slugify: input => input
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')
                                    .slice(0, 100) // maks 100 tegn
            }
        },
        {
            name: "price",
            title: "Pris",
            type: "number" // numerisk prisfelt
        },
        {
            name: "quantity",
            title: "Antall på lager",
            type: "number" // lagerbeholdning
        },
        {
            name: "productimage",
            title: "Produktbilde",
            type: "image" // bilde for produktet
        },
        {
            name: "productcategory",
            title: "Kategori",
            type: "reference",
            to: [{type: "category"}] // referanse til en kategori
        },
        {
            name: "description",
            title: "Beskrivelse",
            type: "text", // større tekstfelt
            rows: 5 // vises med 5 rader i Studio
        },
        {
            name: "relatedProducts",
            title: "Relaterte produkter",
            type: "array", // liste med relaterte produkter
            of: [
                {
                    type: "reference",
                    to: [{ type: "product" }] // referanser til andre produkter
                }
            ]
        }
    ],
    preview: {
        select: {
            title: "productname", // vis tittel i Studio-liste
            inCat: "productcategory.categoryname", // hent kategoriens navn
            image: "productimage" // bruk produktbildet som ikon
        },
        prepare(selection) {
            const {title, inCat, image} = selection
            return {
                title: title,
                subtitle: `Kategori: ${inCat ? inCat : "Ukjent"}`,
                media: image
            }
        }
    }
}

export default products // eksporterer produktskjematype for Sanity