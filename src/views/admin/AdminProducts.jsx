import { useEffect, useRef, useState } from "react";
import axios from "axios";

import * as bootstrap from "bootstrap";
import Pagination from "../../components/Pagination";
import ProductModal from "../../components/ProductModal";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../slice/messageSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function AdminProducts() {
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({});
  const productModalRef = useRef(null);
  const dispatch = useDispatch();

  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTemplateProduct((preData) => ({
      ...preData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleModalImageChange = (index, value) => {
    setTemplateProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage[index] = value;

      if (
        value !== "" &&
        index === newImage.length - 1 &&
        newImage.length < 5
      ) {
        newImage.push("");
      }

      if (
        value === "" &&
        index === newImage[newImage.length - 1 === ""] &&
        newImage.length > 1
      ) {
        newImage.pop();
      }
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  const handleAddImage = () => {
    setTemplateProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.push("");
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  const handleDeleteImage = () => {
    setTemplateProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.pop();
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  useEffect(() => {
    // 讀取 Cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }

    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    const checkLogin = async () => {
      try {
        const response = await axios.post(`${API_BASE}/api/user/check`);
        dispatch(createAsyncMessage(response.data));
        setIsAuth(true);
        getProducts();
      } catch (error) {
        dispatch(createAsyncMessage(error.response.data));
      }
    };

    checkLogin();
  }, []);

  const openModal = (type, product) => {
    setTemplateProduct((preData) => ({
      ...preData,
      ...product,
    }));
    setModalType(type);
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    }
  };

  const updateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";

    if (modalType === "edit") {
      url = `${url}/${id}`;
      method = "put";
    }

    const productData = {
      data: {
        ...templateProduct,
        origin_price: Number(templateProduct.origin_price),
        price: Number(templateProduct.price),
        is_enabled: templateProduct.is_enabled ? 1 : 0,
        imagesUrl: [...templateProduct.imagesUrl.filter((url) => url !== "")],
      },
    };

    try {
      const response = await axios[method](url, productData);
      dispatch(createAsyncMessage(response.data));
      getProducts();
      closeModal();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      );
      dispatch(createAsyncMessage(response.data));
      getProducts();
      closeModal();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);
      const response = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData,
      );
      setTemplateProduct((pre) => ({
        ...pre,
        imageUrl: response.data.imageUrl,
      }));
    } catch (error) {
      alert.error("Upload error:", error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
          >
            建立新的產品
          </button>
        </div>
        <h2>產品列表</h2>
        <table className="table">
          <thead>
            <tr>
              <th>分類</th>
              <th>產品名稱</th>
              <th>原價</th>
              <th>售價</th>
              <th>是否啟用</th>
              <th>編輯</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>{item.category}</td>
                <td className="fw-bold">{item.title}</td>
                <td>{item.origin_price}</td>
                <td>{item.price}</td>
                <td className={`${item.is_enabled && "text-success"} fw-bold`}>
                  {item.is_enabled ? "啟用" : "未啟用"}
                </td>
                <td>
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => openModal("edit", item)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        openModal("delete", item);
                      }}
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination pagination={pagination} onChangePage={getProducts} />
      </div>
      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        handleAddImage={handleAddImage}
        handleDeleteImage={handleDeleteImage}
        handleModalImageChange={handleModalImageChange}
        handleModalInputChange={handleModalInputChange}
        updateProduct={updateProduct}
        deleteProduct={deleteProduct}
        closeModal={closeModal}
        uploadImage={uploadImage}
      />
    </>
  );
}

export default AdminProducts;
