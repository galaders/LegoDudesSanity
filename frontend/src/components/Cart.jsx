import CartItem from "./CartItem"

// Komponent som viser handlekurven
// Props:
// - isOpen: boolean som bestemmer om handlekurven skal vises
// - cart: array med produkter i handlekurven
// - setCart: funksjon for å oppdatere handlekurven
// - totalSum: forhåndsberegnet totalpris (kan også beregnes fra cart)
export default function Cart({ isOpen, cart, setCart, totalSum }) {
  return (
    <>
      {/*
        Hele handlekurv-seksjonen.
        Klassen "hidden" brukes for å skjule elementet når isOpen er false.
      */}
      <section id="cart" className={isOpen ? "" : "hidden"}>

        {/*
          Tabell som inneholder radene for hvert element i handlekurven.
          Vi bruker <tbody> for å holde radene samlet.
        */}
        <table id="cart-items">
          <tbody>

            {/*
              Hvis handlekurven er tom (cart.length <= 0):
              - Vis en enkel rad med en melding.
              Ellers:
              - Gå gjennom cart med .map og render en CartItem for hvert produkt.
            */}
            {cart.length <= 0 ? (

              // Handlekurven er tom
              <tr>
                <td>Ingen varer i handlevognen enda.</td>
              </tr>

            ) : (

              // Handlekurven har ett eller flere produkter
              cart.map(p => (

                /*
                  Hver CartItem representerer ett produkt i handlekurven.
                  - key: unik identifikator for Reacts listehåndtering
                  - p: produktobjektet sendes som prop
                  - setCart: sendes videre slik at CartItem kan oppdatere kurven (fjerne, endre antall osv.)
                */
                <CartItem
                  key={p.prodid}
                  p={p}
                  setCart={setCart}
                />
              ))
            )}

          </tbody>
        </table>

        {/*
          Viser total pris for handlekurven.
          Merk: totalSum kommer som prop her, men det er ofte tryggere å regne ut summen fra cart for å unngå avvik.
        */}
        <p>
          Total pris: <span id="total-price">{totalSum}</span> NOK
        </p>

      </section>
    </>
  )
}
