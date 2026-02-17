import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { Copy, Check } from "lucide-react";

type SummaryResponse = {
  projectSummary: string;
  keySkills: string[];
};

export default function App() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedSkills, setCopiedSkills] = useState(false);

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

  const copySummary = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.projectSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 1500);
  };

  const copySkills = async () => {
    if (!data) return;
    const skillsText = data.keySkills.join(", ");
    await navigator.clipboard.writeText(skillsText);
    setCopiedSkills(true);
    setTimeout(() => setCopiedSkills(false), 1500);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg h-full max-h-[90vh] shadow-xl rounded-2xl flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-center text-2xl">
            Project Summariser
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 overflow-y-auto p-6">
          {/* INPUT SECTION */}
          <div className="space-y-3">
            <Textarea
              placeholder="Describe your project..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[120px] resize-none"
            />

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Generating..." : "Generate Summary"}
            </Button>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* OUTPUT SECTION */}
          {data && (
            <div className="border-t pt-6 space-y-5">
              {/* Summary */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Project Summary
                  </h3>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copySummary}
                  >
                    {copiedSummary ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <p className="text-sm leading-relaxed text-gray-800">
                  {data.projectSummary}
                </p>
              </div>

              {/* Skills */}
              {data.keySkills.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Key Skills
                    </h3>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copySkills}
                    >
                      {copiedSkills ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {data.keySkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
