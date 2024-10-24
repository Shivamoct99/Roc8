import React, { useState } from "react";
import "../../styles/email.css";
import EmailBody from "../EmailBody";
import { useAppcontext } from "../../context/fetch";
import EmailList from "../EmailList";

const Email = () => {
  const {
    fetchEmails,
    email_data,
    filter,
    read_items,
    favorite_items,
    email_content,
    setFilter,
    setEmailContent,
  } = useAppcontext();
  const [page, setPage] = useState("1");

  const handleFilter = (e) => {
    e.preventDefault();
    const filter = e.target.textContent;
    setFilter(filter);
    setEmailContent();
  };
  return (
    <>
      <main>
        <section className="filter__section">
          <h3>Filter By:</h3>
          <li
            className={`filter_label ${filter === "Unread" ? "active" : ""}`}
            onClick={(e) => handleFilter(e)}
          >
            Unread
          </li>
          <li
            className={`filter_label ${filter === "Read" ? "active" : ""}`}
            onClick={(e) => handleFilter(e)}
          >
            Read
          </li>
          <li
            className={`filter_label ${filter === "Favorite" ? "active" : ""}`}
            onClick={(e) => handleFilter(e)}
          >
            Favorite
          </li>
        </section>
        <section className="main-body">
          <section
            className="email__section"
            style={{
              width: email_content ? "40%" : "100%",
            }}
          >
            {email_data.list ? (
              email_data.list.map((email) => {
                switch (filter) {
                  case "Read":
                    return (
                      read_items.includes(email.id) && (
                        <EmailList email={email} />
                      )
                    );
                  // break;
                  case "Unread":
                    return (
                      !read_items.includes(email.id) && (
                        <EmailList email={email} />
                      )
                    );

                  // break;
                  case "Favorite":
                    return (
                      favorite_items.includes(email.id) && (
                        <EmailList email={email} />
                      )
                    );
                  //   break;

                  default:
                    return <EmailList email={email} />;
                  // break;
                }
              })
            ) : (
              <div>........loading </div>
            )}{" "}
            <section className="email_page">
              <span
                className={`page `}
                style={{
                  display: page === "1" ? "none" : "",
                }}
                onClick={() => {
                  setPage("1");
                  fetchEmails(1);
                  setEmailContent();
                }}
              >
                Prev
              </span>
              <span
                className={`page ${page === "1" && "active"}`}
                onClick={() => {
                  setPage("1");
                  fetchEmails(1);
                  setEmailContent();
                }}
              >
                1
              </span>
              <span
                className={`page ${page === "2" && "active"}`}
                onClick={() => {
                  setPage("2");
                  fetchEmails(2);
                  setEmailContent();
                }}
              >
                2
              </span>
              <span
                className={`page`}
                style={{
                  display: page === "2" ? "none" : "",
                }}
                onClick={() => {
                  setPage("2");
                  fetchEmails(2);
                  setEmailContent();
                }}
              >
                Next
              </span>
            </section>
          </section>
          <section
            className="email_body"
            style={{
              display: email_content ? "" : "none",
            }}
          >
            <EmailBody />
          </section>
        </section>
      </main>
    </>
  );
};

export default Email;
