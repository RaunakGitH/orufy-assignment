import './ProductCard.css';

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);

const ProductCard = ({ product, onEdit, onDelete, onTogglePublish, onStockChange }) => {
  const { name, type, stock, mrp, sellingPrice, brandName, images, isPublished } = product;

  const discount = mrp > sellingPrice
    ? Math.round(((mrp - sellingPrice) / mrp) * 100)
    : null;

  return (
    <div className="pcard">
      
      <div className="pcard-image">
        {images && images.length > 0 ? (
          <img src={images[0]} alt={name} />
        ) : (
          <div className="pcard-image-placeholder">📦</div>
        )}
        {discount && <span className="pcard-discount">{discount}% off</span>}
      </div>

      
      <div className="pcard-body">
        <h3 className="pcard-name">{name}</h3>

        <div className="pcard-meta">
          <div className="pcard-meta-row">
            <span className="pcard-label">Price</span>
            <span className="pcard-value">
              ₹{sellingPrice}
              {mrp > sellingPrice && (
                <span className="pcard-mrp"> ₹{mrp}</span>
              )}
            </span>
          </div>
          <div className="pcard-meta-row">
            <span className="pcard-label">Quantity Stock</span>
            <span className="pcard-value">{stock}</span>
          </div>
          <div className="pcard-meta-row">
            <span className="pcard-label">Selling Price</span>
            <span className="pcard-value">₹{sellingPrice}</span>
          </div>
          <div className="pcard-meta-row">
            <span className="pcard-label">Brand Name</span>
            <span className="pcard-value">{brandName || '—'}</span>
          </div>
          <div className="pcard-meta-row">
            <span className="pcard-label">Collections</span>
            <span className="pcard-value pcard-type">{type}</span>
          </div>
        </div>

        
        <div className="pcard-actions">
          <button
            className={`btn btn-sm ${isPublished ? 'btn-warning' : 'btn-success'}`}
            onClick={onTogglePublish}
          >
            {isPublished ? 'Unpublish' : 'Publish'}
          </button>

          <button className="btn btn-sm btn-outline" onClick={onEdit}>
            <EditIcon /> Edit
          </button>

          
          <div className="qty-stepper">
            <button onClick={() => onStockChange(-1)} disabled={stock <= 0}>−</button>
            <span>{stock}</span>
            <button onClick={() => onStockChange(1)}>+</button>
          </div>

          <button className="btn btn-sm btn-danger icon-btn" onClick={onDelete} title="Delete">
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;