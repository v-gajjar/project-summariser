import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./components/ui/dropdown-menu";

type SummaryResponse = {
  projectSummary: string;
  keySkills: string[];
};

export default function App() {
  const [input, setInput] = useState("");
  const [originalInput, setOriginalInput] = useState<string | null>(null);
  const [expandedInput, setExpandedInput] = useState(false);

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
    setExpandedInput(false);

    const submittedText = input;
    setOriginalInput(submittedText);

    try {
      const res = await fetch("/api/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: submittedText }),
      });

      if (!res.ok) throw new Error("Server error");

      const json: SummaryResponse = await res.json();
      setData(json);
    } catch {
      setError("Failed to connect to server");
      setOriginalInput(null);
    } finally {
      setLoading(false);
    }
  };

  const copySummary = async (mode: "text" | "html") => {
    if (!data) return;

    const output =
      mode === "html"
        ? `<section aria-labelledby="summary-heading">
  <h2 id="summary-heading">Project Summary</h2>
  <p>${data.projectSummary}</p>
</section>`
        : data.projectSummary;

    await navigator.clipboard.writeText(output);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 1500);
  };

  const copySkills = async (mode: "text" | "html") => {
    if (!data) return;

    const output =
      mode === "html"
        ? `<section aria-labelledby="skills-heading">
  <h2 id="skills-heading">Key Skills</h2>
  <ul>
${data.keySkills.map((s) => `    <li>${s}</li>`).join("\n")}
  </ul>
</section>`
        : data.keySkills.join(", ");

    await navigator.clipboard.writeText(output);
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
          {/* INPUT OR ORIGINAL INPUT CARD */}
          <div className="space-y-3">
            {data && originalInput ? (
              <div className="rounded-xl border bg-gray-100 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Original Input
                  </h2>

                  {originalInput.length > 400 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedInput(!expandedInput)}
                      className="flex items-center gap-1 hover:bg-gray-200 transition-colors"
                    >
                      {expandedInput ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Collapse
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          View full input
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div
                  className={`relative transition-all ${
                    expandedInput
                      ? "max-h-[60vh] overflow-y-auto"
                      : "max-h-48 overflow-hidden"
                  }`}
                >
                  <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {originalInput}
                  </p>

                  {!expandedInput && originalInput.length > 400 && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none" />
                  )}
                </div>
              </div>
            ) : (
              <>
                <Textarea
                  placeholder="Describe your project..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[120px] max-h-[45vh] overflow-y-auto resize-none [field-sizing:fixed]"
                />

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Generating..." : "Generate Summary"}
                </Button>
              </>
            )}
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* OUTPUT */}
          {data && (
            <div className="border-t pt-6 space-y-5">
              {/* SUMMARY */}
              <section aria-labelledby="summary-heading">
                <div className="flex items-center justify-between mb-2">
                  <h2
                    id="summary-heading"
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Project Summary
                  </h2>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        {copiedSummary ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => copySummary("text")}>
                        Text
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copySummary("html")}>
                        HTML
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                  {data.projectSummary}
                </p>
              </section>

              {/* SKILLS */}
              {data.keySkills.length > 0 && (
                <section aria-labelledby="skills-heading">
                  <div className="flex items-center justify-between mb-2">
                    <h2
                      id="skills-heading"
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      Key Skills
                    </h2>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {copiedSkills ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => copySkills("text")}>
                          Text
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copySkills("html")}>
                          HTML
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <ul className="flex flex-wrap gap-2">
                    {data.keySkills.map((skill) => (
                      <li
                        key={skill}
                        className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
