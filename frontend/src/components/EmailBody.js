import React from "react";
import { useAppcontext } from "../context/fetch";

const EmailBody = () => {
  const {
    email_content: { id, name, body, date, subject },
    setFavoriteItems,
    favorite_items,
  } = useAppcontext();
  const dateformat = new Date(date);
  //   function which can convert html string to innnerhtml
  function HtmlContent({ htmlString }) {
    return (
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
    );
  }
  return (
    <>
      <div className="icon">{name && name.charAt(0).toUpperCase()}</div>
      <div className="email">
        <div className="email-subject">
          <div
            style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}
          >
            <h2>{subject}</h2>
            <div className="date-time">
              <div className="date">
                {dateformat.getFullYear()}/
                {dateformat.getMonth() >= 10
                  ? dateformat.getMonth()
                  : `0${dateformat.getMonth()}`}
                /
                {dateformat.getDay() >= 10
                  ? dateformat.getDay()
                  : `0${dateformat.getDay()}`}{" "}
                {dateformat.getHours() >= 12
                  ? dateformat.getHours() - 12
                  : `0${dateformat.getHours()}`}
                :
                {dateformat.getMinutes() >= 10
                  ? dateformat.getMinutes()
                  : `0${dateformat.getMinutes()}`}{" "}
                {dateformat.getHours() >= 12 ? "PM" : "AM"}
              </div>
            </div>
          </div>
          <button
            className="favorite-btn"
            onClick={(e) => {
              e.preventDefault();
              favorite_items.includes(id)
                ? alert("work is in progress")
                : setFavoriteItems(id);
            }}
          >
            {favorite_items.includes(id)
              ? "Unmark As Favorite"
              : "Mark As Favorite"}
          </button>
        </div>
        {body && <HtmlContent htmlString={body} />}
      </div>
    </>
  );
};

export default EmailBody;
