import './style/lego.css'
import { products } from './assets/legodudes'
import { useEffect, useState } from 'react'

import Cart from './components/Cart'
import Products from './components/Products'
import Header from './components/Header'
import Nav from './components/Nav'
import CategoryTitle from './components/CategoryTitle'
import Layout from './components/Layout'
import { Routes, Route } from 'react-router-dom'
import CategoryPage from './components/CategoryPage'
import ProductDetail from './components/ProductDetail'

function App() {
  // State som styrer om handlekurven er åpen (vises) eller lukket
  const [isOpen, setIsOpen] = useState(false)

  // Selve handlekurven: array med produktobjekter { _id/prodid, productname, price, quantity, ... }
  const [cart, setCart] = useState([])

  // Totalt antall varer i handlekurven (vises i badge)
  const [cartQuantity, setCartQuantity] = useState(0)

  // Total pris for alle varer i handlekurven
  const [totalSum, setTotalSum] = useState(0)

  // Debug: viser cart i konsollen (fjern i produksjon)
  console.log("Cart", cart)

  /*
    useEffect som kjører hver gang 'cart' endres.
    - Beregner totalt antall varer (cartQuantity)
    - Beregner total pris (totalSum)
    Bruker reduce for å summere over cart-arrayet.
  */
  useEffect(() => {
    // Totalt antall enheter i kurven
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)
    setCartQuantity(totalQuantity)

    // Totalt beløp (pris * antall) for alle produkter
    const total = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)
    setTotalSum(total)
  }, [cart]) // kjør kun når cart endres

  /*
    Page-komponenten er en liten wrapper som brukes som index-route.
    Den viser CategoryTitle og Products. Her brukes lokale 'products'
    fra assets som fallback/eksempeldata.
  */
  function Page() {
    return (
      <main>
        <CategoryTitle />
        <Products products={products} setCart={setCart} />
      </main>
    )
  }

  /*
    Layout-komponenten pakker hele appen:
    - sender setIsOpen og cartQuantity til Header
    - sender cart, setCart og totalSum til Cart
    - children er Routes (sideinnhold)
  */
  return (
    <Layout
      setIsOpen={setIsOpen}
      cartQuantity={cartQuantity}
      isOpen={isOpen}
      cart={cart}
      setCart={setCart}
      totalSum={totalSum}
    >
      <Routes>
        {/* Index-route (hovedsiden) */}
        <Route index element={<Page />} />

        {/* Kategori-side (slug fra URL) */}
        <Route path="/kategori/:slug" element={<CategoryPage />} />

        {/* Produktside med mulighet til å legge til i handlekurv */}
        <Route path="/produkt/:slug" element={<ProductDetail setCart={setCart} />} />
      </Routes>
    </Layout>
  )
}

export default App
