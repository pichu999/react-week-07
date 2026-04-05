import { Link, Outlet } from "react-router";

function FrontendLayout() {
  return (
    <>
      <header>
        <div className="container">
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                首頁
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                產品列表頁
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                購物車
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/checkout">
                結帳
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                登入
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

export default FrontendLayout;
