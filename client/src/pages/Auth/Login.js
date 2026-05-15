import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";
import toast from "react-hot-toast";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailOrPhone.trim()) {
      setError("Please enter email or phone");
      return;
    }
    setLoading(true);
    try {
      const res = await login(emailOrPhone.trim());
      toast.success("OTP sent");
      navigate("/otp", {
        state: { emailOrPhone: emailOrPhone.trim(), otp: res.data.otp },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="authPage">
      <div className="authLeft">
        <div className="auth-illustration">
          <div className="auth-illustration-card">
            <div className="runner-icon">
              <p>
                Upl<span>o</span>ad your
                <br />
                product to market
              </p>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-logo">
              <div className="logo-icon"></div>
              <span>Productr</span>
            </div>
            <h2>Login to your Productr Account</h2>
            <p>Enter your credentials to enter your account</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email or Phone number</label>
                <input
                  type="text"
                  className={`form-control ${error ? "error" : ""}`}
                  placeholder="Email or Phone Number"
                  value={emailOrPhone}
                  onChange={(e) => {
                    setEmailOrPhone(e.target.value);
                    setError("");
                  }}
                  autoFocus
                />
                {error && <p className="form-error">{error}</p>}
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "11px",
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" /> Sending OTP...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
            <p className="auth-footer">
              Don't have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign Up here
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;