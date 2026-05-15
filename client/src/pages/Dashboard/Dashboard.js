import { useNavigate, useLocation } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import "./Dashboard.css";

const GridPlusIcon = () => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <line x1="17.5" y1="14" x2="17.5" y2="21" />
    <line x1="14" y1="17.5" x2="21" y2="17.5" />
  </svg>
);

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <div className="dashboard-page">
        <div className="dashboard-topbar">
          <div className="topbar-right-area">
            <div className="topbar-avatar">👤</div>
          </div>
        </div>

        <div className="dashboard-body">
          <div className="product-tabs">
            <button className="product-tab active">Published</button>
            <button className="product-tab">Unpublished</button>
          </div>

          <div className="dashboard-empty">
            <div className="empty-icon-wrap">
              <GridPlusIcon />
            </div>
            <h3>No Published Products</h3>
            <p>
              You don't have any published products yet.
              <br />
              Head to Products to add and publish them.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/products")}
            >
              Add your Products
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
