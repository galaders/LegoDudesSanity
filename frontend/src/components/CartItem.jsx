// Komponent som representerer én rad i handlekurven
// Props:
// - p: produktobjektet (forventet å inneholde prodid, title, price, quantity)
// - setCart: funksjon for å oppdatere handlekurv-state i forelderkomponenten
export default function CartItem({ p, setCart }) {
  /*
    removeFromCart kjøres når brukeren klikker for å fjerne ett eksemplar
    av produktet fra handlekurven. prodid identifiserer hvilket produkt
    som skal reduseres.
  */
  const removeFromCart = (prodid) => {
    /*
      setCart oppdaterer handlekurv-state. Vi bruker funksjonell oppdatering
      (prev => ...) for å sikre at vi alltid jobber mot siste state.
    */
    setCart((prev) =>
      /*
        1) map(): gå gjennom alle elementene i forrige handlekurv.
           - Hvis item.prodid matcher prodid, returner en ny kopi av item
             med quantity redusert med 1 (immutabel oppdatering).
           - Ellers returner item uendret.
      */
      prev
        .map((item) =>
          item.prodid === prodid ? { ...item, quantity: item.quantity - 1 } : item
        )

        /*
          2) filter(): fjern alle elementer som nå har quantity <= 0.
             Dette gjør at produkter automatisk forsvinner fra kurven
             når antallet når 0.
        */
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <tr>
      {/*
        Vis produktets tittel, pris og antall.
        Klassene kan brukes for styling i CSS.
      */}
      <td className="title">{p.title}</td>
      <td className="price">{p.price}</td>
      <td className="quantity">{p.quantity}</td>

      {/*
        Sletteknapp som fjerner ett eksemplar ved klikk.
        Vi sender med p.prodid slik at removeFromCart vet hvilket produkt.
      */}
      <td className="delete">
        <button onClick={() => removeFromCart(p.prodid)}>X</button>
      </td>
    </tr>
  );
}

/*
  Tips og forbedringsforslag:
  - Sørg for at p.prodid er unik for hvert produkt.
  - Valider at p.quantity er et tall før du reduserer det.
  - For å støtte fjerning av hele linjen direkte, lag en egen funksjon
    som fjerner alle forekomster av et produkt (filter på prodid).
  - Hvis du trenger å oppdatere antall direkte (øk/skriv inn verdi),
    legg til en funksjon som setter quantity til en spesifikk verdi,
    og bruk immutabel oppdatering på samme måte.
  - Vurder å bruke to desimaler ved visning av pris: {p.price.toFixed(2)}
*/
