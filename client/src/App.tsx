import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">
            Backend Test
          </h1>
          <p className="text-lg text-gray-700 text-center">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;