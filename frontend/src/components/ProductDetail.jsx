import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import client from '../helpers/client'

export default function ProductDetail({ setCart }) {
    const { slug } = useParams()
    const [product, setProduct] = useState(null)
    const [sameCategoryProducts, setSameCategoryProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchProduct() {
            try {
                const result = await client.fetch(
                    "*[_type == 'product' && slug.current == $slug]{_id, productname, price, description, quantity, 'category': productcategory->categoryname, 'categoryRef': productcategory._ref, 'imageURL': productimage.asset->url, 'relatedProducts': relatedProducts[]->{_id, productname, 'slug': slug.current, price, 'imageURL': productimage.asset->url}}",
                    { slug }
                )
                if (result.length > 0) {
                    setProduct(result[0])
                } else {
                    setError("Produktet ble ikke funnet")
                }
            } catch (err) {
                setError("Feil ved henting av produkt")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [slug])

    useEffect(() => {
        if (!product?.categoryRef) return

        async function fetchSameCategoryProducts() {
            try {
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

    const handleAddToCart = () => {
        setCart((prev) =>
            prev.some(item => item._id === product._id)
                ? prev.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
                : [
                    ...prev,
                    {
                        ...product,
                        quantity: 1
                    }
                ]
        )
        console.log("Produkt lagt til handlekurv")
    }

    if (loading) {
        return <main><p>Laster produkt...</p></main>
    }

    if (error) {
        return <main><p>{error}</p></main>
    }

    if (!product) {
        return <main><p>Produktet ble ikke funnet</p></main>
    }

    return (
        <main className="product-detail">
            <article className="product-detail-content">
                <div className="product-image">
                    <img 
                        src={product.imageURL || "https://placehold.co/600x800?text=Bilde+kommer"} 
                        alt={product.productname} 
                    />
                </div>
                <div className="product-info">
                    <a href="#">{product.category}</a>
                    <h1>{product.productname}</h1>
                    <p className="price">Kr. {product.price},-</p>
                    
                    {product.description && (
                        <div className="description">
                            <h2>Beskrivelse</h2>
                            <p>{product.description}</p>
                        </div>
                    )}
                    
                    <div className="product-actions">
                        <button onClick={handleAddToCart}>Legg til handlekurv</button>
                        <p className="stock-info">
                            {product.quantity > 0 
                                ? `${product.quantity} på lager` 
                                : 'Utsolgt'}
                        </p>
                    </div>

                    {product.relatedProducts?.length > 0 && (
                        <section className="related-products">
                            <h2>Du vil kanskje også like...</h2>
                            <div className="related-product-list">
                                {product.relatedProducts.map((related) => (
                                    <article key={related._id} className="related-product-card">
                                        <Link to={`/produkt/${related.slug}`} className="related-image-link">
                                            <img
                                                src={related.imageURL || "https://placehold.co/300x300?text=Bilde+kommer"}
                                                alt={related.productname}
                                            />
                                        </Link>
                                        <div className="related-product-info">
                                            <Link to={`/produkt/${related.slug}`} className="related-link">
                                                <h3>{related.productname}</h3>
                                            </Link>
                                            <p>Kr. {related.price},-</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {sameCategoryProducts?.length > 0 && (
                        <section className="same-category-products">
                            <h2>Flere produkter i kategorien {product.category}</h2>
                            <div className="related-product-list">
                                {sameCategoryProducts.map((item) => (
                                    <article key={item._id} className="related-product-card">
                                        <Link to={`/produkt/${item.slug}`} className="related-image-link">
                                            <img
                                                src={item.imageURL || "https://placehold.co/300x300?text=Bilde+kommer"}
                                                alt={item.productname}
                                            />
                                        </Link>
                                        <div className="related-product-info">
                                            <Link to={`/produkt/${item.slug}`} className="related-link">
                                                <h3>{item.productname}</h3>
                                            </Link>
                                            <p>Kr. {item.price},-</p>
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
