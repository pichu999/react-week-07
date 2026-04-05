import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login(getProducts, setIsAuth) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  const onSubmit = async (formData) => {
    //e.preventDefault(); //停止原生預設事件
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common["Authorization"] = token;
      navigate("/admin/products");
      // setIsAuth(true);
      // getProducts();
    } catch (error) {
      setIsAuth(false);
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <div className="container login">
        <h1>請先登入</h1>
        <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              name="username"
              placeholder="name@example.com"
              // value={formData.username}
              // onChange={(e) => handleInputChange(e)}
              {...register("username", {
                required: "請輸入E-mail",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "E-mail 格式不正確",
                },
              })}
            />
            <label htmlFor="username">E-mail address</label>
            {errors.username && (
              <p className="text-danger">{errors.username.message}</p>
            )}
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              // value={formData.password}
              // onChange={(e) => handleInputChange(e)}
              {...register("password", {
                required: "請輸入密碼",
                minLength: {
                  value: 6,
                  message: "密碼長度至少需 6 碼",
                },
              })}
            />
            <label htmlFor="password">Password</label>
            {errors.password && (
              <p className="text-danger">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">
            登入
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
