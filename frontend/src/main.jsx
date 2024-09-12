import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Profile from "./pages/User/Profile.jsx";
import PrivateRouter from "./component/PrivateRouter.jsx";
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";
import ProductList from "./pages/Admin/ProductList.jsx";
import AllProducts from "./pages/Admin/AllProducts.jsx";
import ProductUpdate from "./pages/Admin/ProductUpdate.jsx";
import BannerManagement from "./pages/Admin/BannerManagement.jsx";
import EventManagement from "./pages/Admin/EventManagement.jsx";

import Home from "./pages/Home.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<PrivateRouter />}>
        <Route path="/ho-So" element={<Profile />} />
      </Route>
      <Route path="/dang-nhap" element={<Login />} />
      <Route path="/dang-ky" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      {/* Admin Route */}

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="ds-nguoi-dung" element={<UserList />} />
        <Route path="ds-the-loai" element={<CategoryList />} />
        <Route path="them-san-pham" element={<ProductList />} />
        <Route path="tat-ca-san-pham" element={<AllProducts />} />
        <Route
          path="san-pham/cap-nhat-san-pham/:_id"
          element={<ProductUpdate />}
        />
        <Route path="quan-ly-banner" element={<BannerManagement />} />{" "}
        <Route path="quan-ly-event" element={<EventManagement />} />{" "}
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
