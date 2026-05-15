import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import DeleteModal from './DeleteModal';
import { getProducts, togglePublish, deleteProduct, updateProduct } from '../../services/productService';
import toast from 'react-hot-toast';
import './Products.css';

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const GridPlusIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <line x1="17.5" y1="14" x2="17.5" y2="21"/><line x1="14" y1="17.5" x2="21" y2="17.5"/>
  </svg>
);

const Products = () => {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [activeTab, setActiveTab]       = useState('published');
  const [showModal, setShowModal]       = useState(false);
  const [editProduct, setEditProduct]   = useState(null);   
  const [deleteTarget, setDeleteTarget] = useState(null);   

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  
  const filtered = products.filter((p) => {
    const matchTab = activeTab === 'published' ? p.isPublished : !p.isPublished;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleTogglePublish = async (product) => {
    try {
      await togglePublish(product._id);
      toast.success(`Product ${product.isPublished ? 'unpublished' : 'published'} successfully`);
      fetchProducts();
    } catch {
      toast.error('Failed to update product');
    }
  };

  const handleStockChange = async (product, delta) => {
    const newStock = Math.max(0, product.stock + delta);
    try {
      await updateProduct(product._id, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, stock: newStock } : p))
      );
    } catch {
      toast.error('Failed to update stock');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deleteTarget._id);
      toast.success('Product deleted successfully');
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleModalClose = (didSave) => {
    setShowModal(false);
    setEditProduct(null);
    if (didSave) fetchProducts();
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  return (
    <AppLayout>
      <div className="products-page">

        
        <div className="products-topbar">
          <h1 className="products-title">Products</h1>
          <div className="products-topbar-right">
            <div className="search-wrap">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search for your Products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <PlusIcon /> Add Product
            </button>
          </div>
        </div>

        
        <div className="products-tabs">
          <button
            className={`product-tab ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Published
          </button>
          <button
            className={`product-tab ${activeTab === 'unpublished' ? 'active' : ''}`}
            onClick={() => setActiveTab('unpublished')}
          >
            Unpublished
          </button>
        </div>

       
        <div className="products-body">
          {loading ? (
            <div className="products-loading">
              <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="products-empty">
              <div className="empty-icon-wrap"><GridPlusIcon /></div>
              <h3>
                {search
                  ? `No results for "${search}"`
                  : `No ${activeTab === 'published' ? 'Published' : 'Unpublished'} Products`}
              </h3>
              <p>
                {search
                  ? 'Try a different search term.'
                  : activeTab === 'published'
                  ? 'Add a product and publish it to see it here.'
                  : 'Unpublished products will appear here.'}
              </p>
              {!search && (
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  <PlusIcon /> Add your Products
                </button>
              )}
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={() => openEdit(product)}
                  onDelete={() => setDeleteTarget(product)}
                  onTogglePublish={() => handleTogglePublish(product)}
                  onStockChange={(delta) => handleStockChange(product, delta)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      
      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={handleModalClose}
        />
      )}


      {deleteTarget && (
        <DeleteModal
          productName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AppLayout>
  );
};

export default Products;