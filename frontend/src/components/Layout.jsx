import Header from "./Header";
import Nav from "./Nav";
import Cart from "./Cart";

// Layout-komponent som pakker hele siden sammen
// Props:
// - setIsOpen: funksjon for å toggle handlekurven (sendes videre til Header)
// - cartQuantity: antall varer i handlekurven (vises i Header)
// - isOpen: boolean som bestemmer om Cart skal vises
// - cart: array med produkter i handlekurven (sendes til Cart)
// - setCart: funksjon for å oppdatere handlekurven (sendes til Cart)
// - totalSum: totalpris for handlekurven (sendes til Cart)
// - children: innholdet som skal vises mellom Nav og Cart (sideinnhold)
export default function Layout({
  setIsOpen,
  cartQuantity,
  isOpen,
  cart,
  setCart,
  totalSum,
  children
}) {
  return (
    <div id="container">
      {/*
        Header:
        - Viser logo og knapp for å åpne/lukke handlekurven.
        - Får setIsOpen og cartQuantity som props slik at den kan toggles og vise antall varer.
      */}
      <Header setIsOpen={setIsOpen} cartQuantity={cartQuantity} />

      {/*
        Nav:
        - Navigasjonskomponenten (meny/lenker).
        - Ingen props her i dette eksempelet, men kan utvides ved behov.
      */}
      <Nav />

      {/*
        children:
        - Her plasseres sideinnholdet som sendes inn fra ruter eller forelderkomponent.
        - Gir fleksibel layout: forskjellige sider kan bruke samme Layout-komponent.
      */}
      {children}

      {/*
        Cart:
        - Handlekurv-seksjonen som vises/ skjules basert på isOpen.
        - Får hele cart-dataen, setCart for oppdateringer, og totalSum for visning.
      */}
      <Cart
        isOpen={isOpen}
        cart={cart}
        setCart={setCart}
        totalSum={totalSum}
      />
    </div>
  );
}
