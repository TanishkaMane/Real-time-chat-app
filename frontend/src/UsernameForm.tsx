import "./UsernameForm.scss";
import React, { useState } from "react";

interface Props {
  onSubmit: (username: string) => void;
}

const UsernameForm: React.FC<Props> = ({ onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <form className="username-form" onSubmit={handleSubmit}>
      <h2>Enter your name to join the chat</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        placeholder="Your Name"
        required
      />
      <button type="submit">Join</button>
    </form>
  );
};

export default UsernameForm;
