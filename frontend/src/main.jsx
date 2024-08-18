import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./../redux/store";
import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import Profile from "../pages/User/Profile.jsx";
import PrivateRouter from "./../component/PrivateRouter";
import AdminRoute from "../pages/Admin/AdminRoute.jsx";
import UserList from "../pages/Admin/UserList.jsx";
import CategoryList from "../pages/Admin/CategoryList.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<PrivateRouter />}>
        <Route path="/ho-So" element={<Profile />} />
      </Route>
      <Route path="/dang-nhap" element={<Login />} />
      <Route path="/dang-ky" element={<Register />} />

      {/* Admin Route */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="ds-nguoi-dung" element={<UserList />} />
        <Route path="ds-the-loai" element={<CategoryList />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
