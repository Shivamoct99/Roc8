import React from "react";
import { useAppcontext } from "../context/fetch";

const EmailList = ({ email }) => {
  const { favorite_items, fetchEmailContent, setReadItems } = useAppcontext();
  const handleEmail = (e, email) => {
    e.preventDefault();
    fetchEmailContent(email);
    setReadItems(email.id);
  };
  // change time stamp in date and time
  const date = new Date(email.date);
  return (
    <div
      className="list"
      key={email.id}
      onClick={(e) => {
        handleEmail(e, email);
      }}
    >
      <div className="icon">{email.from.name.charAt(0).toUpperCase()}</div>
      <div className="list__item ">
        <div className="from">
          From: <strong>{email.from.email}</strong>
        </div>

        <div className="subject">
          Subject: <strong>{email.subject}</strong>
        </div>
        <div className="short-description">{email.short_description}</div>
        <div className="date-time">
          <div className="date">
            {date.getFullYear()}/
            {date.getMonth() >= 10 ? date.getMonth() : `0${date.getMonth()}`}/
            {date.getDay() >= 10 ? date.getDay() : `0${date.getDay()}`}{" "}
            {date.getHours() >= 12
              ? date.getHours() - 12
              : `0${date.getHours()}`}
            :
            {date.getMinutes() >= 10
              ? date.getMinutes()
              : `0${date.getMinutes()}`}{" "}
            {date.getHours() >= 12 ? "PM" : "AM"}
          </div>
          <div
            className="favorite"
            style={{
              display: favorite_items.includes(email.id) ? "" : "none",
            }}
          >
            Favorite
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailList;
