import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../App'
import { ChevronLeft, ChevronRight, Star, Zap, Shield, Truck, HeadphonesIcon } from 'lucide-react'

function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const { addToCart } = useCart()

  const slides = [
    {
      title: "Upgrade Your Ride",
      subtitle: "Premium Motorcycle Parts",
      description: "Discover top-quality parts and accessories for your motorcycle. Quality guaranteed with fast shipping.",
      badge: "New Arrivals",
      cta: "Shop Now",
      bgGradient: "from-blue-600 via-purple-600 to-pink-500",
      emoji: "🏍️"
    },
    {
      title: "Performance Parts",
      subtitle: "Maximum Power",
      description: "Unlock your bike's full potential with our high-performance exhaust systems and engine upgrades.",
      badge: "Best Sellers",
      cta: "Explore",
      bgGradient: "from-orange-500 via-red-500 to-pink-500",
      emoji: "⚡"
    },
    {
      title: "Safety First",
      subtitle: "Premium Protection",
      description: "Stay safe on the road with our certified helmets, protective gear, and braking systems.",
      badge: "Safety Gear",
      cta: "Shop Safety",
      bgGradient: "from-green-500 via-teal-500 to-blue-500",
      emoji: "🛡️"
    }
  ]

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.slice(0, 8))
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const categoryIcons = {
    'Exhaust': '💨',
    'Lighting': '💡',
    'Body': '🎯',
    'Brakes': '🛑',
    'Maintenance': '⚙️',
    'Drivetrain': '⛓️',
    'Controls': '🎮',
    'Suspension': '🔧',
    'Engine': '⚡'
  }

  const getCategoryCount = (category) => {
    return products.filter(p => p.category === category).length
  }

  return (
    <>
      {/* Modern Carousel Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[500px] md:h-[600px]">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`}></div>
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
                <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                  <div className="text-white">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-sm px-4 py-2 rounded-full mb-4 border border-white/30">
                      {slide.badge}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-2">{slide.title}</h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-4">{slide.subtitle}</p>
                    <p className="text-lg text-white/80 mb-8 max-w-xl">{slide.description}</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/cart" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition transform hover:scale-105 text-center">
                        {slide.cta}
                      </Link>
                      <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl font-semibold transition transform hover:scale-105">
                        Learn More
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center items-center">
                    <div className="text-[200px] animate-pulse">{slide.emoji}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-3 rounded-full transition z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-3 rounded-full transition z-10"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find exactly what you need with our organized categories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={`/category/${category}`}
                className="bg-white hover:shadow-xl rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">{categoryIcons[category] || '📦'}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category}</h3>
                <p className="text-sm text-gray-500">{getCategoryCount(category)} Products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Hand-picked premium parts for your motorcycle</p>
            </div>
            <Link to="/cart" className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2">
              View All <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <Link to={`/product/${product.id}`}>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                      New
                    </div>
                    {product.image && product.image.startsWith('http') ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-300 inline-block">{product.image}</span>
                    )}
                  </div>
                </Link>
                <div className="p-6">
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">{product.category}</span>
                  <h3 className="font-semibold text-gray-900 mt-3 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    <button 
                      onClick={() => addToCart(product.id)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose CV Moto Hub?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We're committed to providing the best motorcycle parts shopping experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition duration-300 shadow-lg">
                <Truck className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Free Shipping</h3>
              <p className="text-gray-600">On orders over $100</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition duration-300 shadow-lg">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Secure Payment</h3>
              <p className="text-gray-600">100% secure checkout</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition duration-300 shadow-lg">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Fast Delivery</h3>
              <p className="text-gray-600">2-3 business days</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition duration-300 shadow-lg">
                <HeadphonesIcon className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">24/7 Support</h3>
              <p className="text-gray-600">Dedicated support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Get Exclusive Deals</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">Subscribe to our newsletter and get 10% off your first order plus exclusive access to new arrivals and special promotions.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/50 text-lg"
            />
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg">
              Subscribe
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4">No spam, unsubscribe at any time</p>
        </div>
      </section>
    </>
  )
}

export default Home
