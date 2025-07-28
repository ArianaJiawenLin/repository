import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Solution } from "@shared/schema";
import CodeHighlight from "@/components/ui/code-highlight";

interface SolutionSectionProps {
  categoryId: string;
}

export default function SolutionSection({ categoryId }: SolutionSectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("sparql");
  const [activeTab, setActiveTab] = useState("query");
  const { toast } = useToast();

  const { data: solutions, isLoading } = useQuery<Solution[]>({
    queryKey: ["/api/categories", categoryId, "solutions"],
  });

  const currentSolution = solutions?.find(
    s => s.language === selectedLanguage && s.type === activeTab
  );

  const copyToClipboard = async () => {
    if (currentSolution?.code) {
      try {
        await navigator.clipboard.writeText(currentSolution.code);
        toast({
          title: "Copied",
          description: "Code copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy code",
          variant: "destructive",
        });
      }
    }
  };

  const languages = [
    { value: "sparql", label: "SPARQL" },
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "ros", label: "ROS" },
  ];

  const tabs = [
    { value: "query", label: "Query Examples" },
    { value: "implementation", label: categoryId.includes("robot") ? "ROS Integration" : "Implementation" },
    { value: "documentation", label: "Documentation" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-4 w-4 text-primary" />
            Solution
          </CardTitle>
          <div className="flex space-x-2">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!currentSolution}>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Code Editor */}
        {isLoading ? (
          <div className="bg-slate-900 rounded-lg p-4 h-64 flex items-center justify-center">
            <div className="text-slate-400">Loading solutions...</div>
          </div>
        ) : currentSolution ? (
          <CodeHighlight
            code={currentSolution.code}
            language={selectedLanguage}
          />
        ) : (
          <div className="bg-slate-900 rounded-lg p-4 h-64 flex items-center justify-center">
            <div className="text-slate-400 text-center">
              <Code className="h-8 w-8 mx-auto mb-2" />
              <p>No solution available for {selectedLanguage.toUpperCase()}</p>
              <p className="text-sm mt-1">Try a different language or tab</p>
            </div>
          </div>
        )}

        {/* Solution Tabs */}
        <div className="flex space-x-4 text-sm">
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
