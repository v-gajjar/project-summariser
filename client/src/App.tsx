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
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Backend Test</h1>
      <p className="text-lg text-gray-700">{message}</p>
    </div>
  );
}

export default App;