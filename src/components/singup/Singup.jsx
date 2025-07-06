import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./signup.css";

const Signup = () => {
  const [allUsers, setAllUsers] = useState([]);
  const inputName = useRef(null);
  const inputEmail = useRef(null);
  const inputPassword = useRef(null);
  const inputConfirmPassword = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://e-commerce-backend-g3yp.vercel.app/user/all",{
            headers: {
                Authorization: "lkjfdafdsalkjfdalkfdlkjafdas",
            }
        });
        setAllUsers(res.data.message);
      } catch (error) {
        toast.error("Error fetching users!", { theme: "dark" });
      }
    };

    fetchUsers();

    if (localStorage.getItem("id")) {
      navigate("/");
    }
  }, [navigate]);

  const submit = async () => {
    const name = inputName.current.value.trim();
    const email = inputEmail.current.value.trim();
    const password = inputPassword.current.value;
    const confirmPassword = inputConfirmPassword.current.value;

    // Validation
    if (!name || name.length < 3) {
      return toast.error("Name must be at least 3 characters!", { theme: "dark" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.match(emailRegex)) {
      return toast.error("Invalid email format!", { theme: "dark" });
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters!", { theme: "dark" });
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!", { theme: "dark" });
    }

    for (let i = 0; i < allUsers.length; i++) {
        const element = allUsers[i];
        if(element.email === email){
            return toast.error("This Email Already Exist!", { theme: "dark" });
        }
    }
    window.localStorage.setItem("name" , name)
    window.localStorage.setItem("password" , password)
    window.localStorage.setItem("email" , email)
    navigate('/verify')
    // try {
    //   await axios.post("http://localhost:3300/user/add", { name, email, password });
    //   toast.success("User registered successfully!", { theme: "dark" });
    //   setTimeout(() => navigate("/login"), 2000);
    // } catch (error) {
    //   toast.error("Error while adding a user!", { theme: "dark" });
    // }
  };

  return (
    <div className="login">
      <ToastContainer />
      <div className="login-form">
        <h1 className="heading">Signup</h1>

        <div className="field">
          <span>Name</span>
          <div className="input">
            <i className="fa-solid fa-user"></i>
            <input type="text" ref={inputName} placeholder="Enter Your Name" />
            <hr className="bg-gred" />
          </div>
        </div>

        <div className="field">
          <span>Email</span>
          <div className="input">
            <i className="fa-solid fa-envelope"></i>
            <input type="email" ref={inputEmail} placeholder="Enter Your Email" />
            <hr className="bg-gred" />
          </div>
        </div>

        <div className="field">
          <span>Password</span>
          <div className="input">
            <i className="fa-solid fa-lock"></i>
            <input ref={inputPassword} type="password" placeholder="Enter Your Password" />
            <hr className="bg-gred" />
          </div>
        </div>

        <div className="field">
          <span>Confirm Password</span>
          <div className="input">
            <i className="fa-solid fa-lock"></i>
            <input ref={inputConfirmPassword} type="password" placeholder="Enter Confirm Password" />
            <hr className="bg-gred" />
          </div>
        </div>

        <button onClick={submit}>Signup</button>

        <div className="some-txt">
          <p>Already Have An Account</p>
          <p>
            <Link className="link1" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
