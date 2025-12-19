import ProductCard from "@/components/products/ProducCard"
import { CategoryWithProductsResponseSchema } from "@/src/schemas"
import { redirect } from "next/navigation"

type params = Promise<{
  categoryId: string
}>

  async function getProducts(categoryId:string) {
    const url = `${process.env.API_URL}/categories/${categoryId}?products=true`
    const res = await fetch (url)
    const data = await res.json()
    if (!res.ok) {
      redirect('/1')
    }
    const products =CategoryWithProductsResponseSchema.parse(data)
    return products
  }

export default async function StorePage({params}: {params: params}) {
  const {categoryId}= await params
 const category = await getProducts(categoryId)
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {category.products.map((product) => (
        <ProductCard key={product.id} 
        product={product}/>
      ))}
    </div>
  )
}
