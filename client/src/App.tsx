import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";

type SummaryResponse = {
  projectSummary: string;
  keySkills: string[];
};

export default function App() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const json: SummaryResponse = await res.json();
      setData(json);
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Project Summariser
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Textarea
            placeholder="Describe your project..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[120px] resize-none"
          />

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Generating..." : "Generate Summary"}
          </Button>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {data && (
            <div className="space-y-4 pt-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Project Summary
                </h3>
                <p>{data.projectSummary}</p>
              </div>

              {data.keySkills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Key Skills
                  </h3>
                  <ul className="list-disc list-inside text-sm">
                    {data.keySkills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
