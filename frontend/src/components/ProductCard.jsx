import { Link } from 'react-router-dom'

// Komponent som viser et produktkort og lar brukeren legge produktet i handlekurven
// Props:
// - p: produktobjekt (forventet felter: prodid, productname, price, quantity, slug, imageURL, category)
// - setCart: funksjon for å oppdatere handlekurv-state i forelderkomponenten
export default function ProductCard({ p, setCart }) {
  /*
    handleClick kjøres når brukeren klikker "Legg til handlevogn".
    Vi sjekker først at setCart finnes (komponenten kan brukes uten handlekurv).
  */
  const handleClick = () => {
    if (!setCart) {
      console.warn('Handlekurv ikke tilgjengelig for dette produktkortet.')
      return
    }

    /*
      Oppdater handlekurven immutabelt ved å sende en funksjon til setCart.
      - prev er forrige state (array med produkter i kurven).
      - Vi sjekker om produktet allerede finnes i kurven med prev.some(...)
    */
    setCart((prev) =>
      prev.some((item) => item.prodid === p.prodid)
        ? // Hvis produktet finnes: returner en ny array hvor riktig produkt får økt quantity med 1
          prev.map((item) =>
            item.prodid === p.prodid ? { ...item, quantity: item.quantity + 1 } : item
          )
        : // Hvis produktet ikke finnes: legg det til som nytt element med quantity: 1
          [
            ...prev,
            {
              ...p,
              quantity: 1
            }
          ]
    )

    // Enkel debug-melding for å bekrefte handling
    console.log('Legg i handlekurv')
  }

  return (
    <article className="product-card">
      {/*
        Produktbilde:
        - Bruker p.imageURL hvis tilgjengelig, ellers en placeholder.
        - Alt-tekst bør være beskrivende for tilgjengelighet.
      */}
      <img
        src={p.imageURL ? p.imageURL : 'https://placehold.co/600x800?text=Bilde+kommer'}
        alt={p.productname || 'Produktbilde'}
      />

      {/*
        Kategori-lenke:
        - Her vises kategorinavnet. Hvis du har slug for kategori, kan du lenke til kategori-siden.
      */}
      <a href="#">{p.category}</a>

      {/*
        Produktnavn lenket til produktsiden:
        - Bruk react-router Link for klient-side navigasjon.
        - Sørg for at p.slug er riktig (kan være p.slug.current hvis hentet fra Sanity).
      */}
      <Link to={`/produkt/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3>{p.productname}</h3>
      </Link>

      {/*
        Prisvisning:
        - Vurder å formatere prisen med to desimaler og lokal valutaformat.
      */}
      <p>Kr. {Number(p.price).toFixed(2)},-</p>

      {/*
        Knapp for å legge produktet i handlekurven:
        - onClick kaller handleClick som oppdaterer cart via setCart.
      */}
      <button onClick={handleClick}>Legg til handlevogn</button>
    </article>
  )
}
