const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_EMAILS":
      return { ...state, email_data: action.payload };
    case "FILTER":
      return { ...state, filter: action.payload };

    case "SET_EMAIL_CONTENT":
      return { ...state, email_content: "" };

    case "SET_READ_ITEMS":
      if (state.read_items.includes(action.payload)) {
        return state;
      }
      return { ...state, read_items: state.read_items.push(action.payload) };
    case "SET_FAVORITE_ITEMS":
      if (state.favorite_items.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        favorite_items: state.favorite_items.push(action.payload),
        // [...state.favorite_items, action.payload],
      };
    // case "REMOVE_FAVORITE_ITEMS":
    //   const index = state.favorite_items.indexOf(action.payload);
    //   // console.log(typeof index);
    //   state.favorite_items.splice(index, 1);
    //   const arr = state.favorite_items;
    //   return {
    //     ...state,
    //     favorite_items: arr,
    //   };

    case "FETCH_EMAIL_CONTENT":
      const {
        email: {
          from: { name },
          date,
          subject,
        },
        data: { body, id },
      } = action.payload;
      return { ...state, email_content: { id, name, date, subject, body } };

    default:
      return state;
  }
};

export default reducer;
