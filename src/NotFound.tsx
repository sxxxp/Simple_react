import React from "react";

const NotFound: React.FC = () => {
  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "100px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "3rem", color: "#ff6b6b" }}>404</h1>
      <p style={{ fontSize: "1.5rem" }}>페이지를 찾을 수 없습니다.</p>
      <a
        href="/"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "5px",
          textDecoration: "none",
          fontSize: "1rem",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#0056b3";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#007bff";
        }}
      >
        홈으로 돌아가기
      </a>
    </div>
  );
};

export default NotFound;
