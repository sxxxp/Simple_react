import React, { useRef, useState } from "react";
import { useCookies } from "react-cookie";
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [tried, setTried] = useState(0);
  const [error, setError] = useState("");
  const [cookie, setCookie] = useCookies(["user"]);
  const submit = useRef<HTMLButtonElement>(null);
  const stopForm = async (e: React.FormEvent) => {
    if (submit.current) {
      submit.current.disabled = true;
    }
    await new Promise((resolve) => setTimeout(resolve, 60000 * (tried - 4)));
    setTried(0);

    if (submit.current) {
      submit.current.disabled = false;
    }
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tried >= 5) {
      setError("로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.");
      return stopForm(e);
    }
    setTried(tried + 1);

    fetch(`/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          return setError("이메일 또는 비밀번호가 잘못되었습니다.");
        } else {
          return setError("로그인 실패");
        }
      }
      res.json().then((data: JSON) => {
        console.log("로그인 성공:", data);
        setCookie("user", JSON.stringify(data), { path: "/" });
        navigate("/");
      });
    });
  };

  return (
    <form
      action={process.env.API_URL + "/user/login"}
      method="POST"
      onSubmit={handleLogin}
      className="auth-form"
    >
      <h3>{error}</h3>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" ref={submit}>
        로그인
      </button>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        뒤로가기
      </button>
    </form>
  );
};

export default Login;
