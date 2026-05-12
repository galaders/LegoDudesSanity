import { Link } from "react-router-dom"

// Header-komponent som viser logo og knapp for å åpne/lukke handlekurven
// Props:
// - setIsOpen: funksjon som toggler synligheten til handlekurven (boolean state i forelder)
// - cartQuantity: antall varer i handlekurven som vises i en liten badge
export default function Header({ setIsOpen, cartQuantity }) {
  return (
    <header>
      {/*
        Hovedtittel/logo:
        - Link fra react-router som navigerer til forsiden når logoen klikkes.
        - <img> har alt-tekst for tilgjengelighet.
      */}
      <h1>
        <Link to="/">
          <img src="website_images/LD_logo.svg" alt="LEGOdudes" />
        </Link>
      </h1>

      {/*
        Knapp som åpner/lukker handlekurven:
        - onClick bruker funksjonell oppdatering for å toggle state: setIsOpen(prev => !prev)
        - Viser antall varer i en badge (cartQuantity)
        - Inneholder et ikon (handlevogn)
      */}
      <button
        id="cart-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Åpne handlekurv"         // forbedrer tilgjengelighet for skjermlesere
        aria-expanded={false}                // kan settes dynamisk hvis Header får isOpen som prop
        aria-controls="cart"                 // peker på id-en til handlekurv-seksjonen
      >
        {/*
          Badge som viser antall varer:
          - Brukes for visuell tilbakemelding.
          - Hvis cartQuantity kan være 0, vurder å skjule badge når 0.
        */}
        <div id="cart-quantity">{cartQuantity}</div>

        {/*
          Handlevogn-ikon:
          - img har alt-tekst for tilgjengelighet.
          - Vurder å bruke inline SVG for bedre kontroll over farger og skalering.
        */}
        <img src="website_images/legocart.svg" alt="Handlevogn" />
      </button>
    </header>
  )
}
