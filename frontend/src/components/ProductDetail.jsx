import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import client from '../helpers/client'

// Side som viser detaljinformasjon for ett produkt
// Props:
// - setCart: funksjon for å oppdatere handlekurven i forelderkomponenten
export default function ProductDetail({ setCart }) {
  // Hent slug fra URL (react-router)
  const { slug } = useParams()

  // State for produktdata, relaterte produkter, loading og feil
  const [product, setProduct] = useState(null)
  const [sameCategoryProducts, setSameCategoryProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Effekt som henter produktet basert på slug når komponenten mountes eller slug endres
  useEffect(() => {
    async function fetchProduct() {
      try {
        // GROQ-spørring som henter produktfelt og relasjoner:
        // - Henter produkt med matching slug
        // - Henter kategoriens navn og referanse
        // - Henter bilde-URL og relaterte produkter (med nødvendige felt)
        const result = await client.fetch(
          "*[_type == 'product' && slug.current == $slug]{_id, productname, price, description, quantity, 'category': productcategory->categoryname, 'categoryRef': productcategory._ref, 'imageURL': productimage.asset->url, 'relatedProducts': relatedProducts[]->{_id, productname, 'slug': slug.current, price, 'imageURL': productimage.asset->url}}",
          { slug }
        )

        // Hvis vi fant produktet, sett det i state, ellers sett en feilmelding
        if (result.length > 0) {
          setProduct(result[0])
        } else {
          setError('Produktet ble ikke funnet')
        }
      } catch (err) {
        // Håndter nettverks- eller spørringsfeil
        setError('Feil ved henting av produkt')
        console.error(err)
      } finally {
        // Uansett resultat: stopp loading-indikatoren
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  // Effekt som henter andre produkter i samme kategori (unntatt gjeldende produkt)
  useEffect(() => {
    // Hvis vi ikke har categoryRef enda, gjør ingenting
    if (!product?.categoryRef) return

    async function fetchSameCategoryProducts() {
      try {
        // Hent produkter som refererer til samme kategori, ekskluder gjeldende produkt
        const categoryProducts = await client.fetch(
          "*[_type == 'product' && productcategory._ref == $categoryRef && _id != $productId]{_id, productname, 'slug': slug.current, price, 'imageURL': productimage.asset->url}",
          { categoryRef: product.categoryRef, productId: product._id }
        )
        setSameCategoryProducts(categoryProducts)
      } catch (err) {
        console.error('Feil ved henting av produkter fra samme kategori', err)
      }
    }

    fetchSameCategoryProducts()
  }, [product?.categoryRef, product?._id])

  // Funksjon for å legge produktet i handlekurven
  const handleAddToCart = () => {
    // Bruk funksjonell oppdatering for å sikre at vi jobber mot siste state
    setCart((prev) =>
      prev.some(item => item._id === product._id)
        ? // Hvis produktet allerede finnes i kurven: øk quantity med 1
          prev.map(item =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : // Hvis produktet ikke finnes: legg det til med quantity: 1
          [
            ...prev,
            {
              ...product,
              quantity: 1
            }
          ]
    )

    // Enkel debug-melding
    console.log('Produkt lagt til handlekurv')
  }

  // Vis loading-state
  if (loading) {
    return <main><p>Laster produkt...</p></main>
  }

  // Vis feil hvis noe gikk galt
  if (error) {
    return <main><p>{error}</p></main>
  }

  // Sikkerhetsjekk: hvis produkt ikke finnes, vis melding
  if (!product) {
    return <main><p>Produktet ble ikke funnet</p></main>
  }

  // Hovedrender for produktdetaljer
  return (
    <main className="product-detail">
      <article className="product-detail-content">
        <div className="product-image">
          {/*
            Vis produktbilde eller placeholder hvis ikke tilgjengelig.
            Alt-tekst bruker produktnavn for tilgjengelighet.
          */}
          <img
            src={product.imageURL || 'https://placehold.co/600x800?text=Bilde+kommer'}
            alt={product.productname}
          />
        </div>

        <div className="product-info">
          {/*
            Viser kategori (kan gjøres til en Link hvis du har kategori-slug)
          */}
          <a href="#">{product.category}</a>

          <h1>{product.productname}</h1>

          {/*
            Prisvisning: vurder å formatere med to desimaler eller Intl.NumberFormat
          */}
          <p className="price">Kr. {Number(product.price).toFixed(2)},-</p>

          {/*
            Beskrivelse vises kun hvis den finnes
          */}
          {product.description && (
            <div className="description">
              <h2>Beskrivelse</h2>
              <p>{product.description}</p>
            </div>
          )}

          <div className="product-actions">
            {/*
              Knapp for å legge produktet i handlekurven
            */}
            <button onClick={handleAddToCart}>Legg til handlekurv</button>

            {/*
              Lagerstatus: vis antall på lager eller utsolgt
            */}
            <p className="stock-info">
              {product.quantity > 0 ? `${product.quantity} på lager` : 'Utsolgt'}
            </p>
          </div>

          {/*
            Relaterte produkter som er eksplisitt koblet til produktet
            (hentes via relatedProducts-referanser i Sanity)
          */}
          {product.relatedProducts?.length > 0 && (
            <section className="related-products">
              <h2>Du vil kanskje også like...</h2>
              <div className="related-product-list">
                {product.relatedProducts.map((related) => (
                  <article key={related._id} className="related-product-card">
                    <Link to={`/produkt/${related.slug}`} className="related-image-link">
                      <img
                        src={related.imageURL || 'https://placehold.co/300x300?text=Bilde+kommer'}
                        alt={related.productname}
                      />
                    </Link>
                    <div className="related-product-info">
                      <Link to={`/produkt/${related.slug}`} className="related-link">
                        <h3>{related.productname}</h3>
                      </Link>
                      <p>Kr. {Number(related.price).toFixed(2)},-</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/*
            Flere produkter fra samme kategori (ekskluderer gjeldende produkt)
          */}
          {sameCategoryProducts?.length > 0 && (
            <section className="same-category-products">
              <h2>Flere produkter i kategorien {product.category}</h2>
              <div className="related-product-list">
                {sameCategoryProducts.map((item) => (
                  <article key={item._id} className="related-product-card">
                    <Link to={`/produkt/${item.slug}`} className="related-image-link">
                      <img
                        src={item.imageURL || 'https://placehold.co/300x300?text=Bilde+kommer'}
                        alt={item.productname}
                      />
                    </Link>
                    <div className="related-product-info">
                      <Link to={`/produkt/${item.slug}`} className="related-link">
                        <h3>{item.productname}</h3>
                      </Link>
                      <p>Kr. {Number(item.price).toFixed(2)},-</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  )
}
