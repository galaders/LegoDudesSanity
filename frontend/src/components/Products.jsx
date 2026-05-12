import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import client from '../helpers/client'

// Komponent som henter og viser alle produkter fra Sanity
// Props:
// - products: (valgfri) kan brukes hvis forelder sender produkter direkte
// - setCart: funksjon for å oppdatere handlekurven (sendes videre til ProductCard)
export default function Products({ products, setCart }) {
  // Lokal state for produkter hentet fra Sanity
  const [sanityProducts, setSanityProducts] = useState(null)

  // useEffect kjører én gang ved mount for å hente produkter fra Sanity
  useEffect(() => {
    // Asynkron funksjon som utfører GROQ-spørringen
    async function fetchAllProducts() {
      // GROQ-spørring:
      // - Hent alle dokumenter av typen 'product'
      // - Velg nødvendige felt: _id, productname, price, category (via referanse),
      //   imageURL (fra asset->url), slug (slug.current) og description
      const allProducts = await client.fetch(
        "*[_type == 'product']{_id, productname, price, 'category': productcategory->categoryname, 'imageURL': productimage.asset->url, 'slug': slug.current, description}"
      )

      // Oppdater state med resultatet fra Sanity
      setSanityProducts(allProducts)
    }

    // Kall hentefunksjonen
    fetchAllProducts()
  }, []) // tom avhengighetsliste betyr at effekten kjører kun én gang

  // Debug-logging (fjern i produksjon)
  console.log(sanityProducts)

  // Render: map over sanityProducts og vis ett ProductCard per produkt
  // Bruk _id som key for stabil rendering
  return (
    <div id="product-list">
      {sanityProducts?.map((p) => (
        <ProductCard key={p._id} p={p} setCart={setCart} />
      ))}
    </div>
  )
}
