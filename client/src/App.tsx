import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch(() => {
        setMessage("Error connecting to server");
      });
  }, []);

  return (
    <div>
      <h1>Backend Test</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
