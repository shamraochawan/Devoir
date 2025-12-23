import React, { useState, useEffect } from 'react';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Your Backend URL
const API_URL = 'https://devoir-9q8e.onrender.com';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingId, setIsEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '', price: '', category: '', gender: 'men', sizes: ''
  });
  
  const [variants, setVariants] = useState([
    { colorName: '#000000', file: null, variantName: '', preview: null }
  ]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const getImageUrl = (path) => {
      if (!path) return '';
      return path.startsWith('http') ? path : `${API_URL}/uploads/${path}`;
  };

  const openModal = (genderCategory, productToEdit = null) => {
    if (productToEdit) {
      setIsEditingId(productToEdit._id);
      setFormData({
        title: productToEdit.title,
        price: productToEdit.price,
        category: productToEdit.category,
        gender: productToEdit.gender,
        sizes: productToEdit.sizes
      });
      
      const loadedVariants = productToEdit.variants.map(v => ({
          colorName: v.colorName,
          file: null,
          variantName: v.variantName || '',
          preview: getImageUrl(v.imagePath)
      }));
      setVariants(loadedVariants);
    } else {
      setIsEditingId(null);
      setFormData({ title: '', price: '', category: '', gender: genderCategory, sizes: '' });
      setVariants([{ colorName: '#000000', file: null, variantName: '', preview: null }]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    if (field === 'file') {
        newVariants[index].file = value;
        if (value) {
            newVariants[index].preview = URL.createObjectURL(value);
        }
    } else {
        newVariants[index][field] = value;
    }
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { colorName: '#ffffff', file: null, variantName: '', preview: null }]);
  };

  const removeVariant = (index) => {
      if (variants.length > 1) {
          const newVariants = variants.filter((_, i) => i !== index);
          setVariants(newVariants);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('gender', formData.gender);
    data.append('sizes', formData.sizes);

    variants.forEach((v) => {
      data.append('colors', v.colorName);
      data.append('variantNames', v.variantName || '');
      if (v.file) {
        data.append('variantImages', v.file);
        data.append('imageTracking', 'NEW_FILE'); 
      } else {
        data.append('imageTracking', v.preview); 
      }
    });

    try {
      const url = isEditingId 
        ? `${API_URL}/api/products/${isEditingId}`
        : `${API_URL}/api/products`;
      
      const method = isEditingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body: data });

      if (res.ok) {
        fetchProducts();
        closeModal();
        toast.success(isEditingId ? "Product Updated!" : "Product Added!");
      } else {
        const errData = await res.json();
        toast.error(`Error: ${errData.message}`);
      }
    } catch (err) { 
        console.error(err);
        toast.error("Network error");
    } finally {
        setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      setIsLoading(true);
      try {
        await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
        fetchProducts();
        toast.success("Product Deleted");
      } catch (err) {
        toast.error("Delete failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderCategorySection = (sectionTitle, genderKey) => {
    const sectionProducts = products.filter(p => p.gender === genderKey);
    return (
      <div className="category-section" key={genderKey}>
        <h2 className="category-title">{sectionTitle}</h2>
        <div className="admin-grid">
          {sectionProducts.map(product => (
            <div className="admin-card" key={product._id}>
              <img 
                src={getImageUrl(product.variants[0]?.imagePath)} 
                alt={product.title} className="admin-card-img"
                onError={(e) => e.target.src='https://placehold.co/150?text=No+Img'}
              />
              <div className="admin-card-details">
                <h3 className="admin-card-title">{product.title}</h3>
                <p className="admin-card-price">₹{product.price}</p>
                <div style={{display:'flex', gap:'4px', marginTop:'5px'}}>
                   {product.variants.map((v,i) => (
                       <div key={i} title={v.variantName} style={{width:'12px', height:'12px', borderRadius:'50%', background:v.colorName, border:'1px solid #ccc'}}></div>
                   ))}
                </div>
              </div>
              <div className="admin-actions">
                <button className="action-btn" onClick={() => openModal(genderKey, product)}>Edit</button>
                <button className="action-btn delete" onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          ))}
          <div className="add-card-placeholder" onClick={() => openModal(genderKey)}><div className="plus-icon">+</div></div>
        </div>
      </div>
    );
  };

  if (isLoading && !isModalOpen) {
      return (
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', flexDirection:'column'}}>
              <div className="spinner"></div>
              <p>Loading Inventory...</p>
          </div>
      );
  }

  return (
    <div className="admin-dashboard">
      <ToastContainer position="top-center" autoClose={3000} />

      <h1 style={{textAlign:'center', marginBottom:'40px'}}>Admin Inventory</h1>
      {renderCategorySection("Men's Collection", "men")}
      {renderCategorySection("Women's Collection", "women")}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h2>{isEditingId ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title" style={{fontWeight:'bold'}}>Main Title</label>
                <input id="title" className="form-input" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              
              <div style={{display:'flex', gap:'15px'}}>
                  <div className="form-group" style={{flex:1}}>
                      <label htmlFor="price">Price</label>
                      <input id="price" type="number" className="form-input" name="price" value={formData.price} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{flex:1}}>
                      <label htmlFor="category">Category</label>
                      <input id="category" className="form-input" name="category" value={formData.category} onChange={handleChange} required />
                  </div>
              </div>
              
              <div style={{display:'flex', gap:'15px'}}>
                <div className="form-group" style={{flex:1}}>
                    <label htmlFor="sizes">Sizes (S,M,L)</label>
                    <input id="sizes" className="form-input" name="sizes" value={formData.sizes} onChange={handleChange} />
                </div>
                <div className="form-group" style={{flex:1}}>
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" className="form-input" name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                    </select>
                </div>
              </div>

              <div className="form-group" style={{marginTop:'20px'}}>
                  <label style={{fontWeight:'bold', display:'block', marginBottom:'10px'}}>Variants (Colors & Images)</label>
                  {variants.map((variant, index) => (
                    <div key={index} style={{border:'1px solid #ddd', padding:'15px', marginBottom:'15px', borderRadius:'8px', background:'#fafafa', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        
                        <div style={{display:'flex', gap:'20px', alignItems:'flex-start'}}>
                            <div style={{width: '100px', height: '100px', background: '#fff', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', overflow: 'hidden'}}>
                                {variant.preview ? <img src={variant.preview} alt="Preview" style={{width:'100%', height:'100%', objectFit:'contain'}} /> : <span style={{fontSize:'10px', color:'#999'}}>No Img</span>}
                            </div>
                            
                            <div style={{flex:1}}>
                                <label htmlFor={`variant-file-${index}`} style={{fontSize:'12px', fontWeight:'bold', color: '#333'}}>Select Image:</label>
                                <input 
                                  id={`variant-file-${index}`}
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => handleVariantChange(index, 'file', e.target.files[0])} 
                                  style={{marginBottom:'10px'}}
                                />
                                
                                <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                       <label style={{fontSize:'10px'}}>Color</label>
                                       <input 
                                         type="color" 
                                         value={variant.colorName} 
                                         onChange={(e) => handleVariantChange(index, 'colorName', e.target.value)} 
                                         style={{height:'35px', width:'50px', cursor:'pointer'}}
                                       />
                                    </div>
                                    
                                    <div style={{flex:1, display:'flex', flexDirection:'column'}}>
                                       <label style={{fontSize:'10px'}}>Variant Name</label>
                                       <input 
                                         type="text" 
                                         placeholder="e.g. Red Shirt" 
                                         value={variant.variantName} 
                                         onChange={(e) => handleVariantChange(index, 'variantName', e.target.value)} 
                                         style={{padding:'8px', border:'1px solid #ccc', borderRadius:'4px'}} 
                                       />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {variants.length > 1 && <button type="button" onClick={() => removeVariant(index)} style={{background: '#333', color: 'white', border: 'none', padding: '8px', borderRadius:'4px', cursor:'pointer', fontSize:'12px'}}>Remove Variant</button>}
                    </div>
                  ))}
                  <button type="button" className="add-btn" onClick={addVariant} style={{width:'100%', padding:'12px', background:'#e0e0e0', color:'#000', border:'1px dashed #333', fontWeight:'bold'}}>+ Add Another Variant</button>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading} style={{marginTop:'20px', width:'100%', opacity: isLoading ? 0.7 : 1}}>
                  {isLoading ? 'Saving...' : (isEditingId ? 'Save Changes' : 'Add Product')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;