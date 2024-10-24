import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/form.css";
import { useDashboardcontext } from "../../context/dashboard";
const Form = ({ isSignIn = false }) => {
  const { setUserData } = useDashboardcontext();
  const [data, setData] = useState({
    ...(!isSignIn && { name: "" }),
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  // handle submit handle login user or register user here
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:3040/${isSignIn ? "login" : "register"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (res.status === 400) {
      alert("User email or password is incorrect");
    } else if (res.status === 201) {
      alert("User Register Successfully");
      navigate("/sign-in");
    } else if (res.status === 401) {
      alert("User register first");
      navigate("/sign-up");
    } else if (res.status === 404) {
      alert("User Already Exist");
      navigate("/sign-in");
    } else {
      const resData = await res.json();
      if (resData.token) {
        localStorage.setItem("userToken:", resData.token);
        localStorage.setItem("userData:", JSON.stringify(resData.user));
        setUserData(JSON.parse(localStorage.getItem("userData:")));
        navigate(-1);
      }
    }
  };
  return (
    <div className="container">
      <div className="box">
        <div className="content">
          <h3>WECOME</h3>
          <p>
            {isSignIn ? "Sign In To Get Explore" : "Sign Up Now To Get Started"}
          </p>
        </div>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          {!isSignIn && (
            <label className="form__label" htmlFor="name">
              Name:
              <input
                className="form__input"
                value={data.name}
                type="text"
                id="name"
                name="name"
                onChange={(e) => {
                  setData({ ...data, name: e.target.value });
                }}
              />
            </label>
          )}
          <label className="form__label" htmlFor="email">
            Email:
            <input
              className="form__input"
              value={data.email}
              type="email"
              id="email"
              name="email"
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
            />
          </label>
          <label className="form__label" htmlFor="password">
            Password:
            <input
              className="form__input"
              value={data.password}
              type="password"
              id="password"
              name="password"
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
              }}
            />
          </label>
          <button className="form__button" type="submit">
            {isSignIn ? "Sign In" : " Sign Up"}
          </button>
          <div>
            {isSignIn
              ? "Didn't have an account ?"
              : " Alredy have an account ?"}
            <Link
              to={isSignIn ? "/sign-up" : "/sign-in"}
              className="text-primary cursor-pointer underline"
            >
              {isSignIn ? "Sign Up" : " Sign In"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
