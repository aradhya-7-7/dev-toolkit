"use client";
import { useState } from "react";
import { Search, Menu } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CodeTools } from "@/components/code-tools";
import { GeneratorTools } from "@/components/generator-tools";
import { ApiTools } from "@/components/api-tools";
import { ConversionTools } from "@/components/conversion-tools";
import { SiteHeader } from "@/components/site-header";
import { allTools } from "@/lib/toolsData";
import DevTools from "@/components/dev-tools";
import CssUiTools from "@/components/design-tools";
import ResumeAnalyzer from "@/components/resume-tool";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("code");

  const tabs = [
    { value: "code", label: "Code & Text" },
    { value: "generators", label: "Generators" },
    { value: "api", label: "API Tools" },
    { value: "design", label: "Design" },
    { value: "devtools", label: "Dev Tools" },
    { value: "conversion", label: "Conversion" },
    { value: "resume", label: "Resume Analyser" },
  ];

  const filteredTools = allTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search for tools..."
            className="w-full pl-10 py-3 rounded border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {searchTerm ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool, index) => (
                <div
                  key={index}
                  className="p-6 border rounded bg-card text-card-foreground shadow-sm"
                >
                  <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {tool.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Category: {tool.category}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No tools found.</p>
            )}
          </div>
        ) : (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            {/* Mobile Dropdown */}
            <div className="block md:hidden mb-4">
              <select
                value={selectedTab}
                onChange={(e) => setSelectedTab(e.target.value)}
                className="w-full rounded border border-border bg-card text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {tabs.map((tab) => (
                  <option key={tab.value} value={tab.value}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Tabs */}
            <TabsList className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 mb-8 gap-2">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="code">
              <CodeTools />
            </TabsContent>
            <TabsContent value="generators">
              <GeneratorTools />
            </TabsContent>
            <TabsContent value="api">
              <ApiTools />
            </TabsContent>
            <TabsContent value="conversion">
              <ConversionTools />
            </TabsContent>
            <TabsContent value="design">
              <CssUiTools />
            </TabsContent>
            <TabsContent value="devtools">
              <DevTools />
            </TabsContent>
            <TabsContent value="resume">
              <ResumeAnalyzer />
            </TabsContent>
          </Tabs>
        )}
      </main>

      <footer className="border-t border-border bg-card text-card-foreground">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:h-16 md:flex-row">
          <p className="text-sm text-center">
            &copy; {new Date().getFullYear()} DevToolkit. All rights reserved.
          </p>
          <div className="flex items-center gap-4 pr-2">
            <span className="text-sm hover:text-primary hover:text-blue-600 duration-200">
              Want to make contributions? Here is the repo! ➡️
            </span>
           <a
  href="https://github.com/aradhya-7-7/dev-toolkit.git"
  target="_blank"
  rel="noopener noreferrer"
  className="github-button"
>
  <span className="github-button-text">GitHub</span>
  <span className="github-button-reflection"></span>
</a>


          </div>
        </div>
      </footer>
    </div>
  );
}
