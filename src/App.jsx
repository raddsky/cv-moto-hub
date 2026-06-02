import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import { Menu, X, ShoppingCart, Search, User, Heart, Phone, Mail, MapPin, Plus, Trash2, Minus, CreditCard, CheckCircle } from 'lucide-react'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Admin from './pages/Admin'

const CartContext = createContext()

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [sessionId] = useState(() => localStorage.getItem('sessionId') || Math.random().toString(36).substr(2, 9))

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId)
    fetchCart()
  }, [sessionId])

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${sessionId}`)
      const data = await response.json()
      setCartItems(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      await fetch('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, product_id: productId, quantity })
      })
      fetchCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const updateCartItem = async (cartId, quantity) => {
    try {
      await fetch(`http://localhost:3000/api/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })
      fetchCart()
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  const removeFromCart = async (cartId) => {
    try {
      await fetch(`http://localhost:3000/api/cart/${cartId}`, { method: 'DELETE' })
      fetchCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const clearCart = async () => {
    try {
      await fetch(`http://localhost:3000/api/cart/session/${sessionId}`, { method: 'DELETE' })
      setCartItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateCartItem, removeFromCart, clearCart, cartTotal, cartCount, sessionId }}>
      {children}
    </CartContext.Provider>
  )
}

function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const location = useLocation()

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={14} /> +1 (555) 123-4567</span>
            <span className="hidden sm:flex items-center gap-1"><Mail size={14} /> support@motoparts.com</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin size={14} /> Free Shipping on orders $100+</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl">🏍️</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CV Moto Hub</h1>
                <p className="text-xs text-gray-500">Premium Motorcycle Parts</p>
              </div>
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search parts, accessories..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/admin" className="hidden sm:flex items-center gap-1 text-gray-700 hover:text-orange-600">
                <User size={24} />
              </Link>
              <Link to="/cart" className="relative flex items-center gap-1 text-gray-700 hover:text-orange-600">
                <ShoppingCart size={24} />
                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
              </Link>
              <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          <div className="md:hidden mt-4">
            <div className="relative">
              <input type="text" placeholder="Search parts..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <nav className={`md:flex mt-4 md:mt-0 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            <ul className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
              <li><Link to="/" className={`block ${location.pathname === '/' ? 'text-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'}`}>Home</Link></li>
              <li><Link to="/cart" className={`block ${location.pathname === '/cart' ? 'text-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'}`}>Cart</Link></li>
              <li><Link to="/admin" className={`block ${location.pathname === '/admin' ? 'text-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'}`}>Admin</Link></li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏍️</span>
              <span className="text-xl font-bold">CV Moto Hub</span>
            </div>
            <p className="text-gray-400 text-sm">Your trusted source for premium motorcycle parts and accessories since 2010.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-orange-500">Home</Link></li>
              <li><Link to="/cart" className="hover:text-orange-500">Cart</Link></li>
              <li><Link to="/admin" className="hover:text-orange-500">Admin Panel</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-orange-500">Track Order</a></li>
              <li><a href="#" className="hover:text-orange-500">Returns</a></li>
              <li><a href="#" className="hover:text-orange-500">Warranty</a></li>
              <li><a href="#" className="hover:text-orange-500">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2"><Phone size={16} /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><Mail size={16} /> support@motoparts.com</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> 123 Moto Street, CA 90210</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2024 CV Moto Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}

export { useCart }
export default App
