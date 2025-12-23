import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import API_URL from '../api';

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  
  // Track selected items
  const [selectedIds, setSelectedIds] = useState([]);

  // Auto-select items when cart loads
  useEffect(() => {
    if (cart.length > 0 && selectedIds.length === 0) {
      setSelectedIds(cart.map(item => item.uniqueId));
    }
    // Sync selection if items are removed
    setSelectedIds(prev => prev.filter(id => cart.some(item => item.uniqueId === id)));
  }, [cart]);

  const getImageUrl = (path) => {
    if (!path) return '';
    const cleanPath = path.replace(/\\/g, '/');
    return cleanPath.startsWith('http') ? cleanPath : `${API_URL}/uploads/${cleanPath}`;
  };

  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Calculate Total only for SELECTED items
  const total = cart
    .filter(item => selectedIds.includes(item.uniqueId))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePayment = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one item to pay.");
      return;
    }
    alert(`Processing payment for ${selectedIds.length} items. Total: ₹${total.toFixed(2)}`);
  };

  return (
    <div className="container" style={{marginTop:'50px', maxWidth:'800px', marginBottom:'100px'}}>
      <h2 style={{textAlign:'center', fontFamily:'Stack Sans Notch'}}>SHOPPING CART</h2>
      
      {cart.length === 0 ? <p style={{textAlign:'center'}}>Cart is empty.</p> : (
        <>
          {cart.map(item => (
            <div key={item.uniqueId} style={{display:'flex', gap:'15px', alignItems:'center', borderBottom:'1px solid #eee', padding:'15px 0'}}>
              
              {/* CHECKBOX */}
              <input 
                type="checkbox" 
                checked={selectedIds.includes(item.uniqueId)}
                onChange={() => handleCheckboxChange(item.uniqueId)}
                style={{width: '20px', height: '20px', cursor: 'pointer', accentColor: 'black'}}
              />

              <img src={getImageUrl(item.variant?.imagePath)} alt={item.product.title} style={{width:'80px', height:'80px', objectFit:'contain'}} />
              
              <div style={{flex:1}}>
                <h4 style={{marginTop: '10px', marginBottom: '5px'}}>{item.product.title}</h4>
                <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#666'}}>
                    Qty: {item.quantity}
                </p>
                <button onClick={() => removeFromCart(item.uniqueId)} style={{color:'red', border:'none', background:'none', cursor:'pointer', padding:0}}>Remove</button>
              </div>
              
              {/* PRICE IN RUPEES */}
              <p style={{fontWeight:'bold', marginTop: '10px'}}>₹{item.price * item.quantity}</p>
            </div>
          ))}

          {/* PAYMENT SECTION */}
          <div style={{textAlign:'right', marginTop:'20px', borderTop:'2px solid #f0f0f0', paddingTop:'20px'}}>
            {/* TOTAL IN RUPEES */}
            <h3>Total: ₹{total.toFixed(2)}</h3>
            
            <button 
              onClick={handlePayment}
              disabled={selectedIds.length === 0}
              style={{
                backgroundColor: selectedIds.length === 0 ? '#ccc' : 'black',
                color: 'white',
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
                marginTop: '10px',
                borderRadius: '4px'
              }}
            >
              {selectedIds.length === 0 ? 'SELECT ITEMS TO PAY' : `PAY FOR ${selectedIds.length} ITEM(S)`}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;