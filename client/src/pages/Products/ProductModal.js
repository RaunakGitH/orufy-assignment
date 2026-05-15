import { useState, useEffect, useRef } from 'react';
import { createProduct, updateProduct } from '../../services/productService';
import toast from 'react-hot-toast';
import './ProductModal.css';

const TYPES = ['Youth', 'Illustrations', 'Grocery Products', 'Others'];

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
  </svg>
);

const empty = { name: '', type: '', stock: '', mrp: '', sellingPrice: '', brandName: '', exchangeOrReturn: '', isExchange: '' };

const ProductModal = ({ product, onClose }) => {
  const isEdit = !!product;
  const [form, setForm]       = useState(empty);
  const [errors, setErrors]   = useState({});
  const [images, setImages]   = useState([]);   
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: product.name || '',
        type: product.type || '',
        stock: product.stock ?? '',
        mrp: product.mrp ?? '',
        sellingPrice: product.sellingPrice ?? '',
        brandName: product.brandName || '',
        exchangeOrReturn: product.exchangeOrReturn || '',
        isExchange: '',
      });
      setImages(product.images || []);
    }
  }, [product, isEdit]);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((e2) => ({ ...e2, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name = 'Product name is required';
    if (!form.type)               e.type = 'Product type is required';
    if (form.stock === '')        e.stock = 'Stock is required';
    if (form.mrp === '')          e.mrp = 'MRP is required';
    if (form.sellingPrice === '') e.sellingPrice = 'Selling price is required';
    return e;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImages((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const payload = {
      name: form.name.trim(),
      type: form.type,
      stock: Number(form.stock),
      mrp: Number(form.mrp),
      sellingPrice: Number(form.sellingPrice),
      brandName: form.brandName.trim(),
      exchangeOrReturn: form.exchangeOrReturn.trim(),
      images,
    };

    try {
      if (isEdit) {
        await updateProduct(product._id, payload);
        toast.success('Product updated successfully');
      } else {
        await createProduct(payload);
        toast.success('Product added successfully');
      }
      onClose(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose(false)}>
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button className="modal-close" onClick={() => onClose(false)}><CloseIcon /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            {/* Product Name */}
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input
                className={`form-control ${errors.name ? 'error' : ''}`}
                placeholder="eg: Cashzone Walnut Brownie"
                value={form.name}
                onChange={set('name')}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            {/* Product Type */}
            <div className="form-group">
              <label className="form-label">Product Type</label>
              <select
                className={`form-control form-select ${errors.type ? 'error' : ''}`}
                value={form.type}
                onChange={set('type')}
              >
                <option value="">Select type</option>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.type && <p className="form-error">{errors.type}</p>}
            </div>

            {/* Stock + MRP row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantity Stock</label>
                <input
                  type="number" min="0"
                  className={`form-control ${errors.stock ? 'error' : ''}`}
                  placeholder="Total units available"
                  value={form.stock}
                  onChange={set('stock')}
                />
                {errors.stock && <p className="form-error">{errors.stock}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">MRP</label>
                <input
                  type="number" min="0"
                  className={`form-control ${errors.mrp ? 'error' : ''}`}
                  placeholder="Max retail price"
                  value={form.mrp}
                  onChange={set('mrp')}
                />
                {errors.mrp && <p className="form-error">{errors.mrp}</p>}
              </div>
            </div>

            {/* Selling Price + Brand */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Selling Price</label>
                <input
                  type="number" min="0"
                  className={`form-control ${errors.sellingPrice ? 'error' : ''}`}
                  placeholder="Your selling price"
                  value={form.sellingPrice}
                  onChange={set('sellingPrice')}
                />
                {errors.sellingPrice && <p className="form-error">{errors.sellingPrice}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Brand Name</label>
                <input
                  className="form-control"
                  placeholder="eg: CakeZone"
                  value={form.brandName}
                  onChange={set('brandName')}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">Upload Product Images</label>
              <div className="upload-area" onClick={() => fileRef.current.click()}>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <UploadIcon />
                <span className="upload-label">Browse</span>
                <p className="upload-hint">Click to upload product images</p>
              </div>
              {images.length > 0 && (
                <div className="upload-preview">
                  {images.map((src, i) => (
                    <div key={i} className="preview-thumb">
                      <img src={src} alt={`img-${i}`} />
                      <button className="preview-remove" onClick={() => removeImage(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Exchange / Return */}
            <div className="form-group">
              <label className="form-label">Exchange or return eligibility</label>
              <textarea
                className="form-control"
                placeholder="Describe your exchange or return policy..."
                rows={3}
                value={form.exchangeOrReturn}
                onChange={set('exchangeOrReturn')}
              />
            </div>

            {/* Yes / No radio */}
            <div className="form-group">
              <label className="form-label">Eligible for exchange?</label>
              <div className="radio-group">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="radio-label">
                    <input
                      type="radio"
                      name="isExchange"
                      value={opt}
                      checked={form.isExchange === opt}
                      onChange={set('isExchange')}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => onClose(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? <><span className="spinner" /> Saving...</>
                : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;