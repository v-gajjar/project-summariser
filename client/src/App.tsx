import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("Enter some text and submit...");

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/echo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setResponse(data.echo);
    } catch {
      setResponse("Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          {/* ShadCN Input */}
          <Input
            type="text"
            placeholder="Type something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full"
          />

          {/* ShadCN Button */}
          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>

          <p className="mt-4 text-gray-700 text-center">{response}</p>
        </CardContent>
      </Card>
    </div>
  );
}