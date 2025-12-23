const mongoose = require('mongoose');

// blueprint for single product
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, 
  gender: { type: String, required: true },   
  sizes: { type: String },                    
  
  //"Option B" - Multiple color variants
  variants: [
    {
      colorName: { type: String, required: true }, 
      imagePath: { type: String, required: true }  
    }
  ],

  // Ratings & Favorites
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isFavorite: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);