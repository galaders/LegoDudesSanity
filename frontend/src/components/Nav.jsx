import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import client from "../helpers/client" // Sanity-klient for å hente data fra CMS
// Merk: fjern eventuelle duplikate imports som "Client" for å unngå forvirring

export default function Nav() {
  // State som holder alle kategorier hentet fra Sanity
  const [categories, setCategories] = useState(null)

  // useEffect kjører én gang ved mount for å hente kategorier
  useEffect(() => {
    // Asynkron funksjon som henter alle kategorier
    async function fetchAllCategories() {
      // GROQ-spørring: hent alle dokumenter av typen 'category'
      // og returner categoryname og slug for hver kategori
      const allCategories = await client.fetch("*[_type == 'category']{categoryname, slug}")
      // Oppdater state med resultatet
      setCategories(allCategories)
    }

    // Kall hentefunksjonen
    fetchAllCategories()
  }, []) // tom avhengighetsliste betyr at effekten kjører kun én gang

  // Debug-logging (kan fjernes i produksjon)
  console.log(categories)

  return (
    <nav>
      {/*
        Mapper over kategoriene og lager en Link for hver.
        - Bruk en stabil, unik key (ikke index) hvis mulig, f.eks. c._id.
        - to bygger URL-en til kategorisiden ved å bruke slug.current.
        - Optional chaining (?.) sørger for at koden ikke feiler før data er hentet.
      */}
      {categories?.map((c, index) => (
        <Link key={index} to={"/kategori/" + c.slug.current}>
          {c.categoryname}
        </Link>
      ))}
    </nav>
  )
}
