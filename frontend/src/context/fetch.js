import { createContext, useContext, useReducer, useEffect } from "react";
import reducer from "../reducer/reducer";

let mycontext = createContext();

const initialState = {
  tag: "",
  email_data: {},
  email_content: "",
  filter: "Unread",
  read_items: JSON.parse(localStorage.getItem("read")) || [],
  favorite_items: JSON.parse(localStorage.getItem("favorite")) || [],
};

let AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setFilter = (value) => {
    dispatch({ type: "FILTER", payload: value });
  };
  const setReadItems = (id) => {
    dispatch({ type: "SET_READ_ITEMS", payload: id });
    setTimeout(() => {
      localStorage.setItem("read", JSON.stringify(state.read_items));
    }, 1000);
  };
  const setFavoriteItems = (id) => {
    dispatch({ type: "SET_FAVORITE_ITEMS", payload: id });
    setTimeout(() => {
      // console.log("favorite_items");
      localStorage.setItem("favorite", JSON.stringify(state.favorite_items));
    }, 1000);
  };
  // const removeFavoriteItems = (id) => {
  //   dispatch({ type: "REMOVE_FAVORITE_ITEMS", payload: id });
  //   setTimeout(() => {
  //     localStorage.setItem("favorite", JSON.stringify(state.favorite_items));
  //   }, 1000);
  // };
  const setEmailContent = () => {
    dispatch({ type: "SET_EMAIL_CONTENT" });
  };
  const fetchEmails = async (no = 1) => {
    try {
      const response = await fetch(
        `https://flipkart-email-mock.vercel.app/?page=${no}`
      );
      const data = await response.json();
      dispatch({ type: "FETCH_EMAILS", payload: data });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchEmailContent = async (email) => {
    try {
      const response = await fetch(
        `https://flipkart-email-mock.vercel.app/?id=${email.id}`
      );
      const data = await response.json();
      dispatch({ type: "FETCH_EMAIL_CONTENT", payload: { data, email } });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <mycontext.Provider
      value={{
        ...state,
        setFilter,
        setReadItems,
        setFavoriteItems,
        fetchEmails,

        fetchEmailContent,
        setEmailContent,
      }}
    >
      {children}
    </mycontext.Provider>
  );
};
const useAppcontext = () => {
  return useContext(mycontext);
};
export { useAppcontext, AppProvider };
