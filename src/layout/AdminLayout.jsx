import { Link, Outlet } from "react-router";

function AdminLayout() {
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
