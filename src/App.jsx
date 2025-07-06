import axios from "axios";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./App.css";
import Cart from "./components/Cart/Cart";
import Com from "./components/com/Com";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Product from "./components/product/Product";
import Singup from "./components/singup/Singup";
import Verify from "./components/verfiying/Vefriy";
import WatchingList from "./components/WatchingList/Watch";
import ArrProduct from "./pages/Arrproduct";

function App() {
  const [orderLength, setOrderLength] = useState(0);
  const userId = window.localStorage.getItem("id");

  useEffect(() => {
    const fetchOrderLength = async () => {
      if (!userId) return;
      try {
        const response = await axios.post("https://e-commerce-backend-g3yp.vercel.app/manageorder/allorders");
        const allOrders = response.data.message;
        const userOrders = allOrders.filter(order => order.userId === userId);
        setOrderLength(userOrders.length);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrderLength();
  }, [userId]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      toast.success("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      toast.info("Order canceled -- continue to shop around and checkout when you're ready.");
    }
  }, []);

  return (
    <Router>
      <ToastContainer position="bottom-center" autoClose={3000}/>
      <Header orderLength={orderLength} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home setOrderLength={setOrderLength} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signup" element={<Singup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/arrival-products" element={<ArrProduct />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/watching-list" element={<WatchingList />} />
          <Route path="/checkout" element={<Com />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
