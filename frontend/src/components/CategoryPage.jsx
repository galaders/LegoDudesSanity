import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import client from "../helpers/client"
import ProductCard from "./ProductCard"

// Sidekomponent som viser alle produkter i en kategori og lar brukeren filtrere på pris
export default function CategoryPage() {
  // Henter URL-parameterne fra react-router (f.eks. slug)
  const parameters = useParams()

  // State for kategoridata hentet fra Sanity
  const [category, setCategory] = useState(null)

  // Kontrollerte input-felt for prisfilter
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  // useEffect kjører når URL-parameterne endres (f.eks. ny slug)
  useEffect(() => {
    // Asynkron funksjon som henter kategori og tilhørende produkter fra Sanity
    async function fetchCategory(slug) {
      // GROQ-spørring:
      // - Finn dokumenter av typen 'category' hvor slug.current matcher $slug
      // - Hent _id og categoryname
      // - Legg til et felt "catProds" som inneholder alle produkter som refererer til kategorien
      // - For hvert produkt hentes alle felt (...) og produktbildets URL som "imageURL"
      const tempCategory = await client.fetch(
        `*[_type == 'category' && slug.current == $slug]{
            _id, categoryname, "catProds": *[_type == 'product' && references(^._id)]{..., "imageURL": productimage.asset->url}
        }`,
        { slug }
      )

      // Sett første treff som aktiv kategori (forventet én match per slug)
      setCategory(tempCategory[0])
    }

    // Kall hentefunksjonen med slug fra URL-parameterne
    fetchCategory(parameters.slug)
  }, [parameters])

  // Debug-logging (kan fjernes i produksjon)
  console.log(parameters)
  console.log("Category", category)

  // Filtrerer produktene basert på prisfilteret
  // - Konverterer pris og input til Number
  // - Hvis minPrice eller maxPrice er tomme strenger, brukes -Infinity / Infinity
  const filteredProducts = category?.catProds.filter((p) => {
    const price = Number(p.price)
    const min = minPrice === '' ? -Infinity : Number(minPrice)
    const max = maxPrice === '' ? Infinity : Number(maxPrice)
    return price >= min && price <= max
  })

  return (
    <>
      {/*
        Viser kategorinavnet. Bruker optional chaining slik at komponenten ikke feiler
        før category er hentet.
      */}
      <h1>{category?.categoryname}</h1>

      {/*
        Prisfilter-seksjon med to kontrollerte input-felt.
        - value styres av state
        - onChange oppdaterer state
      */}
      <section className="price-filter">
        <h2>Prisfilter</h2>
        <div className="price-filter-controls">
          <label>
            Min pris
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
            />
          </label>
          <label>
            Maks pris
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="0"
              min="0"
            />
          </label>
        </div>
      </section>

      {/*
        Renderer filtrerte produkter:
        - Hvis det finnes produkter etter filtrering, map over dem og render ProductCard
        - Ellers vis en melding om at ingen produkter matcher
        NB: Bruk av index som key er ikke ideelt; se tips nedenfor.
      */}
      {filteredProducts?.length > 0 ? (
        filteredProducts.map((p, index) => <ProductCard key={index} p={p} />)
      ) : (
        <p>Ingen produkter matcher prisfilteret.</p>
      )}
    </>
  )
}
