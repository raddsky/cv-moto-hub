import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../App'
import { ShoppingCart, ArrowLeft, Star, Package, Truck, Shield } from 'lucide-react'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    }
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id)
    }
  }

  if (!product) {
    return <div className="flex justify-center items-center h-96">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6">
        <ArrowLeft size={20} />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center min-h-[320px]">
          {product.image && product.image.startsWith('http') ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[200px] p-12">{product.image}</span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span className="text-orange-600 font-semibold text-sm">{product.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-gray-600">({product.rating} rating)</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="text-4xl font-bold text-gray-900 mb-6">${product.price}</div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 font-semibold">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">{product.stock} in stock</span>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <ShoppingCart size={24} />
            Add to Cart
          </button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
            <div className="text-center">
              <Package className="mx-auto mb-2 text-orange-600" size={32} />
              <p className="text-sm font-semibold">Free Delivery</p>
            </div>
            <div className="text-center">
              <Truck className="mx-auto mb-2 text-orange-600" size={32} />
              <p className="text-sm font-semibold">Fast Shipping</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto mb-2 text-orange-600" size={32} />
              <p className="text-sm font-semibold">1 Year Warranty</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">Product Specifications</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Category</span>
              <span className="font-semibold">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stock</span>
              <span className="font-semibold">{product.stock} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rating</span>
              <span className="font-semibold">{product.rating} / 5</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">Shipping Information</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Free shipping on orders over $100</li>
            <li>• Standard delivery: 5-7 business days</li>
            <li>• Express delivery: 2-3 business days</li>
            <li>• Tracking number provided</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
