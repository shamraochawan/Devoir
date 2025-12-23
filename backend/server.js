const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config(); 

// --- CLOUDINARY SETUP ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Import Model
const User = require('./models/User'); 

const app = express();


app.use(cors({
  origin: '*'
}));

app.use(express.json());

// --- CONFIGURATION ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'devoir-products', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });


// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error("❌ MongoDB Error:", err));

// --- SCHEMA ---
const productSchema = new mongoose.Schema({
  title: String, 
  price: Number, 
  category: String, 
  gender: String, 
  sizes: String,
  variants: [{ 
      colorName: String, 
      imagePath: String, 
      variantName: String 
  }]
});
const Product = mongoose.model('Product', productSchema);

// --- ROUTES ---

app.get('/', (req, res) => res.send("Backend Running 🚀"));

// 1. GET ALL
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. ADD PRODUCT (POST)
app.post('/api/products', upload.array('variantImages'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: "No files" });
    
    const { title, price, category, gender, sizes, colors, variantNames } = req.body;
    
    // Ensure arrays
    let colorList = Array.isArray(colors) ? colors : [colors];
    let nameList = variantNames ? (Array.isArray(variantNames) ? variantNames : [variantNames]) : [];
    
    let variants = [];
    req.files.forEach((file, index) => {
      variants.push({
        colorName: colorList[index] || '#000000',
        imagePath: file.path, // Save Cloudinary URL
        variantName: nameList[index] || ''
      });
    });

    const newProduct = new Product({ title, price, category, gender, sizes, variants });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

// 3. EDIT PRODUCT (PUT)
app.put('/api/products/:id', upload.array('variantImages'), async (req, res) => {
  try {
    const { title, price, category, gender, sizes, colors, variantNames, imageTracking } = req.body;

    let colorList = Array.isArray(colors) ? colors : [colors];
    let nameList = variantNames ? (Array.isArray(variantNames) ? variantNames : [variantNames]) : [];
    let trackingList = Array.isArray(imageTracking) ? imageTracking : [imageTracking];

    let variants = [];
    let fileIndex = 0; 

    for (let i = 0; i < colorList.length; i++) {
      let finalImagePath = '';

      if (trackingList[i] === 'NEW_FILE') {
        // Use the new file uploaded
        if (req.files && req.files[fileIndex]) {
          finalImagePath = req.files[fileIndex].path; 
          fileIndex++;
        }
      } else {
        // Keep the old URL sent from frontend
        finalImagePath = trackingList[i];
      }

      variants.push({
        colorName: colorList[i] || '#000000',
        imagePath: finalImagePath,
        variantName: nameList[i] || ''
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, price, category, gender, sizes, variants },
      { new: true }
    );
    res.json(updatedProduct);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed: " + error.message });
  }
});

// 4. DELETE PRODUCT
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// --- WISHLIST ---
app.post('/api/wishlist/toggle', async (req, res) => {
  const { email, productId } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) user = new User({ email, wishlist: [] });

    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: "Added", wishlist: user.wishlist });
    } else {
      user.wishlist.splice(index, 1);
      await user.save();
      res.json({ message: "Removed", wishlist: user.wishlist });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/wishlist/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).populate('wishlist');
    res.json(user ? user.wishlist : []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));