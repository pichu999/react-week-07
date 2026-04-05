import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function AdminLayout() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`);
      //清除cookie
      document.cookie =
        "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      alert("已登出");
    } catch {
      alert("登出失敗");
    } finally {
      navigate("/", { replace: true });
    }
  };
  return (
    <>
      <header>
        <div className="container">
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/products">
                後台產品列表頁
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/orders">
                後台訂單列表
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link" to="/" onClick={handleLogout}>
                登出
              </button>
            </li>
          </ul>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="text-center mt-5">
        &copy; HexSchool React - 第七週作業
      </footer>
    </>
  );
}

export default AdminLayout;
