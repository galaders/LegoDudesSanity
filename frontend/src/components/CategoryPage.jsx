import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import client from "../helpers/client"
import ProductCard from "./ProductCard"

export default function CategoryPage() {
    const parameters = useParams()
    const [category, setCategory] = useState(null)
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')

    useEffect(() => {
        async function fetchCategory(slug) {
            const tempCategory = await client.fetch(`*[_type == 'category' && slug.current == $slug]{
                _id, categoryname, "catProds": *[_type == 'product' && references(^._id)]{..., "imageURL": productimage.asset->url}
        }`, {slug})
            setCategory(tempCategory[0])
        }

        fetchCategory(parameters.slug)
    }, [parameters])

    console.log(parameters)
    console.log("Category", category)

    const filteredProducts = category?.catProds.filter((p) => {
        const price = Number(p.price)
        const min = minPrice === '' ? -Infinity : Number(minPrice)
        const max = maxPrice === '' ? Infinity : Number(maxPrice)
        return price >= min && price <= max
    })

    return (
        <>
            <h1>{category?.categoryname}</h1>

            <section className="price-filter">
                <h2>Prisfilter</h2>
                <div className="price-filter-controls">
                    <label>
                        Min pris
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                    </label>
                    <label>
                        Maks pris
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                    </label>
                </div>
            </section>

            {filteredProducts?.length > 0 ? (
                filteredProducts.map((p, index) => <ProductCard key={index} p={p} />)
            ) : (
                <p>Ingen produkter matcher prisfilteret.</p>
            )}
        </>
    )
}