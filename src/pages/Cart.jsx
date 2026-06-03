import { Link } from 'react-router-dom'
import { useCart } from '../App'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'

function Cart() {
  const { cartItems, updateCartItem, removeFromCart, cartTotal } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={100} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition inline-block">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-md flex gap-4">
              <div className="bg-gray-100 w-24 h-24 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.image && item.image.startsWith('http') ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{item.image}</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-lg font-bold text-orange-600 mt-2">${item.price}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button 
                    onClick={() => updateCartItem(item.id, Math.min(item.stock, item.quantity + 1))}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-6 shadow-md h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">{cartTotal >= 100 ? 'Free' : '$10.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">${(cartTotal * 0.1).toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold text-orange-600">
                ${(cartTotal + (cartTotal >= 100 ? 0 : 10) + cartTotal * 0.1).toFixed(2)}
              </span>
            </div>
          </div>
          <Link 
            to="/checkout"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ArrowRight size={20} />
          </Link>
          <Link to="/" className="block text-center text-gray-600 hover:text-orange-600 mt-4">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
