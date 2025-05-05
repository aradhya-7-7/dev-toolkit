"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";


export function CodeTools() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <JsonFormatter />
      <RegexTester />
      <MarkdownEditor />
      <TextDiffChecker />
      <LoremIpsumGenerator />
      <XmlFormatter />
      <YamlJsonConverter />
      <CodeSnippetManager />

      {/* <HtmlCssJsMinifier /> */}
    </div>
  );
}

function XmlFormatter() {
  const [input, setInput] = useState(
    '<root><person><name>John</name><age>30</age><city>New York</city></person></root>'
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatXML = () => {
    try {
      const formatted = input
        .replace(/></g, ">\n<")
        .replace(/(<[^>]+>)(?!<\/)/g, "$1\n")
        .split("\n")
        .map((line, i, arr) => {
          const openTags = arr.slice(0, i).filter(l => l.match(/<[^\/!][^>]*?>/) && !l.match(/\/>/)).length;
          const closeTags = arr.slice(0, i).filter(l => l.match(/<\/[^>]+>/)).length;
          const indentLevel = Math.max(openTags - closeTags, 0);
          const indent = "  ".repeat(indentLevel);
          return indent + line;
        })
        .join("\n");
  
      setOutput(formatted);
      setError("");
    } catch (err) {
      setError("Invalid XML");
      setOutput("");
    }
  };
  

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>XML Formatter</CardTitle>
        <CardDescription>Format and prettify your XML data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your XML here..."
          className="min-h-[120px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={formatXML} className="w-full">
          Format XML
        </Button>
        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
        {output && (
          <div className="relative">
            <Textarea
              className="min-h-[120px] font-mono text-sm"
              value={output}
              readOnly
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import yaml from "js-yaml";


export default function YamlJsonConverter() {
  const [input, setInput] = useState('name: John\nage: 30\ncity: "New York"');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("yaml-to-json");
  const [copied, setCopied] = useState(false);

  const convertData = () => {
    try {
      if (mode === "yaml-to-json") {
        const jsonObj = yaml.load(input);
        setOutput(JSON.stringify(jsonObj, null, 2));
      } else {
        const jsonObj = JSON.parse(input);
        const yamlStr = yaml.dump(jsonObj);
        setOutput(yamlStr);
      }
      setError("");
    } catch (err) {
      setError(`Invalid ${mode === "yaml-to-json" ? "YAML" : "JSON"}`);
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>YAML/JSON Converter</CardTitle>
        <CardDescription>Convert between YAML and JSON formats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => setMode("yaml-to-json")}
            variant={mode === "yaml-to-json" ? "default" : "outline"}
            className="w-full"
          >
            YAML to JSON
          </Button>
          <Button
            onClick={() => setMode("json-to-yaml")}
            variant={mode === "json-to-yaml" ? "default" : "outline"}
            className="w-full"
          >
            JSON to YAML
          </Button>
        </div>
        <Textarea
          placeholder={`Paste your ${mode === "yaml-to-json" ? "YAML" : "JSON"} here...`}
          className="min-h-[120px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={convertData} className="w-full">
          Convert
        </Button>
        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
        {output && (
          <div className="relative">
            <Textarea
              className="min-h-[120px] font-mono text-sm"
              value={output}
              readOnly
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


function CodeSnippetManager() {
  const [snippets, setSnippets] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('codeSnippets');
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'Hello World', language: 'javascript', code: 'console.log("Hello World!");' },
        { id: '2', name: 'React Component', language: 'jsx', code: 'function Component() {\n  return <div>Hello World</div>;\n}' }
      ];
    }
    return [];
  });
  
  const [currentSnippet, setCurrentSnippet] = useState({ id: '', name: '', language: 'javascript', code: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Save snippets to localStorage whenever they change
  useState(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('codeSnippets', JSON.stringify(snippets));
    }
  });

  const saveSnippet = () => {
    if (!currentSnippet.name || !currentSnippet.code) return;
    
    if (isEditing) {
      setSnippets(snippets.map(s => 
        s.id === currentSnippet.id ? currentSnippet : s
      ));
    } else {
      const newSnippet = {
        ...currentSnippet,
        id: Date.now().toString()
      };
      setSnippets([...snippets, newSnippet]);
    }
    
    setCurrentSnippet({ id: '', name: '', language: 'javascript', code: '' });
    setIsEditing(false);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('codeSnippets', JSON.stringify(
        isEditing 
          ? snippets.map(s => s.id === currentSnippet.id ? currentSnippet : s)
          : [...snippets, { ...currentSnippet, id: Date.now().toString() }]
      ));
    }
  };

  const editSnippet = (snippet) => {
    setCurrentSnippet(snippet);
    setIsEditing(true);
  };

  const deleteSnippet = (id) => {
    const newSnippets = snippets.filter(s => s.id !== id);
    setSnippets(newSnippets);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('codeSnippets', JSON.stringify(newSnippets));
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Snippet Manager</CardTitle>
        <CardDescription>Save, edit, and copy your code snippets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create/Edit</TabsTrigger>
            <TabsTrigger value="browse">Browse Snippets</TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="space-y-4">
            <input
              type="text"
              placeholder="Snippet name"
              className="w-full p-2 border rounded"
              value={currentSnippet.name}
              onChange={(e) => setCurrentSnippet({...currentSnippet, name: e.target.value})}
            />
            <select
              className="w-full p-2 border rounded"
              value={currentSnippet.language}
              onChange={(e) => setCurrentSnippet({...currentSnippet, language: e.target.value})}
            >
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="typescript">TypeScript</option>
              <option value="jsx">JSX</option>
              <option value="tsx">TSX</option>
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="xml">XML</option>
              <option value="markdown">Markdown</option>
              <option value="sql">SQL</option>
              <option value="bash">Bash</option>
              <option value="powershell">PowerShell</option>
            </select>
            <Textarea
              placeholder="Paste your code here..."
              className="min-h-[150px] font-mono"
              value={currentSnippet.code}
              onChange={(e) => setCurrentSnippet({...currentSnippet, code: e.target.value})}
            />
            <Button onClick={saveSnippet} className="w-full">
              {isEditing ? 'Update Snippet' : 'Save Snippet'}
            </Button>
          </TabsContent>
          <TabsContent value="browse">
            {snippets.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No snippets saved yet. Create one!
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {snippets.map((snippet) => (
                  <div key={snippet.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-medium">{snippet.name}</h4>
                        <span className="text-xs text-muted-foreground">{snippet.language}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(snippet.code)}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => editSnippet(snippet)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-red-500"
                          onClick={() => deleteSnippet(snippet.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <pre className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                      {snippet.code.length > 100 
                        ? snippet.code.substring(0, 100) + '...' 
                        : snippet.code}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}


function JsonFormatter() {
  const [input, setInput] = useState(
    '{"name": "John", "age": 30, "city": "New York"}'
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError("");
    } catch (err) {
      setError("Invalid JSON");
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>JSON Formatter</CardTitle>
        <CardDescription>Format and validate your JSON data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your JSON here..."
          className="min-h-[120px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={formatJson} className="w-full">
          Format JSON
        </Button>

        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

        {output && (
          <div className="relative">
            <Textarea
              className="min-h-[120px] font-mono text-sm"
              value={output}
              readOnly
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// function HtmlCssJsMinifier() {
//   const [code, setCode] = useState("");
//   const [minifiedCode, setMinifiedCode] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [language, setLanguage] = useState<"html" | "css" | "js">("html");
//   const [error, setError] = useState("");

//   const minifyCode = () => {
//     try {
//       let result = "";
//       switch (language) {
//         case "html":
//           result = htmlMinifier.minify(code, {
//             collapseWhitespace: true,
//             removeComments: true,
//           });
//           break;
//         case "css":
//           result = new CleanCSS().minify(code).styles;
//           break;
//         case "js":
//           result = Terser.minify(code).code || "";
//           break;
//         default:
//           throw new Error("Unsupported language");
//       }
//       setMinifiedCode(result);
//       setError("");
//     } catch (err) {
//       setError("Invalid code or minification error");
//       setMinifiedCode("");
//     }
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(minifiedCode);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>HTML/CSS/JS Minifier</CardTitle>
//         <CardDescription>
//           Minify your HTML, CSS, and JavaScript code
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="grid grid-cols-3 gap-2">
//           <Button
//             onClick={() => setLanguage("html")}
//             variant={language === "html" ? "default" : "ghost"}
//             className="w-full"
//           >
//             HTML
//           </Button>
//           <Button
//             onClick={() => setLanguage("css")}
//             variant={language === "css" ? "default" : "ghost"}
//             className="w-full"
//           >
//             CSS
//           </Button>
//           <Button
//             onClick={() => setLanguage("js")}
//             variant={language === "js" ? "default" : "ghost"}
//             className="w-full"
//           >
//             JS
//           </Button>
//         </div>

//         <Textarea
//           placeholder={`Paste your ${language.toUpperCase()} code here...`}
//           className="min-h-[150px] font-mono"
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//         />

//         <Button onClick={minifyCode} className="w-full">
//           Minify Code
//         </Button>

//         {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

//         {minifiedCode && (
//           <div className="relative">
//             <Textarea
//               className="min-h-[150px] font-mono text-sm"
//               value={minifiedCode}
//               readOnly
//             />
//             <Button
//               size="sm"
//               variant="ghost"
//               className="absolute top-2 right-2"
//               onClick={copyToClipboard}
//             >
//               {copied ? (
//                 <Check className="h-4 w-4" />
//               ) : (
//                 <Copy className="h-4 w-4" />
//               )}
//             </Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

function RegexTester() {
  const [pattern, setPattern] = useState(
    "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b"
  );
  const [flags, setFlags] = useState("i");
  const [testString, setTestString] = useState(
    "Contact us at example@email.com or support@company.org"
  );
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");

  const testRegex = () => {
    try {
      const regex = new RegExp(
        pattern,
        flags + (flags.includes("g") ? "" : "g")
      );
      const found = [...testString.matchAll(regex)].map((m) => m[0]);
      setMatches(found);

      setError("");
    } catch (err) {
      setError("Invalid regular expression");
      setMatches([]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regex Tester</CardTitle>
        <CardDescription>Test and debug regular expressions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <input
              type="text"
              placeholder="Regular expression"
              className="w-full p-2 border rounded"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Flags"
              className="w-full p-2 border rounded"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
            />
          </div>
        </div>

        <Textarea
          placeholder="Test string..."
          className="min-h-[100px]"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
        />

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setPattern("");
            setFlags("");
            setTestString("");
            setMatches([]);
            setError("");
          }}
        >
          Reset
        </Button>

        <Button onClick={testRegex} className="w-full">
          Test Regex
        </Button>

        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

        {matches.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              Matches ({matches.length}):
            </h4>
            <div className="bg-muted p-2 rounded text-sm font-mono">
              {matches.map((match, i) => (
                <div key={i} className="mb-1">
                  {match}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(
    '# Hello World\n\nThis is a **markdown** editor with _preview_.\n\n- List item 1\n- List item 2\n\n```js\nconsole.log("Hello world!");\n```'
  );

  // Very simple markdown to HTML converter for demo purposes
  const convertMarkdownToHtml = (md: string) => {
    let html = md
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
      .replace(/_(.*?)_/gm, "<em>$1</em>")
      .replace(/^\- (.*)/gm, "<li>$1</li>") // List items without <ul>
      .replace(/<\/li>\s*<li>/g, "") // Fix multiple list items issue by removing nested <ul> tags
      .replace(/^<li>/gm, "<ul><li>") // Add <ul> before the first list item
      .replace(/\n<\/li>/gm, "</li></ul>") // Add </ul> after the last list item
      .replace(
        /```(\w*)\n([\s\S]*?)```/gm,
        (_match, lang, code) =>
          `<pre><code class="language-${lang}">${code
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</code></pre>`
      );

    return html;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Markdown Editor</CardTitle>
        <CardDescription>Write and preview markdown</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="write">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="write">
            <Textarea
              placeholder="Write your markdown here..."
              className="min-h-[200px] font-mono"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="preview">
            <div
              className="min-h-[200px] p-4 border rounded-md overflow-auto"
              dangerouslySetInnerHTML={{
                __html: convertMarkdownToHtml(markdown),
              }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TextDiffChecker() {
  const [text1, setText1] = useState(
    "This is the original text.\nIt has multiple lines.\nSome content will be different."
  );
  const [text2, setText2] = useState(
    "This is the modified text.\nIt has multiple lines.\nSome content will be different."
  );
  const [diff, setDiff] = useState<
    { type: "add" | "remove" | "same"; text: string }[]
  >([]);

  const calculateDiff = () => {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const result: { type: "add" | "remove" | "same"; text: string }[] = [];

    // Very simple diff algorithm for demo purposes
    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      if (i >= lines1.length) {
        result.push({ type: "add", text: lines2[i] });
      } else if (i >= lines2.length) {
        result.push({ type: "remove", text: lines1[i] });
      } else if (lines1[i] !== lines2[i]) {
        result.push({ type: "remove", text: lines1[i] });
        result.push({ type: "add", text: lines2[i] });
      } else {
        result.push({ type: "same", text: lines1[i] });
      }
    }

    setDiff(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Diff Checker</CardTitle>
        <CardDescription>
          Compare two text snippets and see the differences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            placeholder="Original text..."
            className="min-h-[100px]"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
          />
          <Textarea
            placeholder="Modified text..."
            className="min-h-[100px]"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
          />
        </div>

        <Button onClick={calculateDiff} className="w-full">
          Compare Texts
        </Button>

        {diff.length > 0 && (
          <div className="mt-4 border rounded-md p-2 overflow-auto max-h-[200px]">
            {diff.map((line, i) => (
              <div
                key={i}
                className={`font-mono text-sm ${
                  line.type === "add"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : line.type === "remove"
                    ? "bg-red-100 dark:bg-red-900/30"
                    : ""
                }`}
              >
                {line.type === "add"
                  ? "+ "
                  : line.type === "remove"
                  ? "- "
                  : "  "}
                {line.text}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(1);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generateLorem = () => {
    const loremText =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    let result = "";
    for (let i = 0; i < paragraphs; i++) {
      result += loremText + (i < paragraphs - 1 ? "\n\n" : "");
    }

    setOutput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lorem Ipsum Generator</CardTitle>
        <CardDescription>
          Generate placeholder text for your designs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            max="10"
            value={paragraphs}
            onChange={(e) =>
              setParagraphs(Number.parseInt(e.target.value) || 1)
            }
            className="w-16 p-2 border rounded"
          />
          <span>Paragraphs</span>
        </div>

        <Button onClick={generateLorem} className="w-full">
          Generate Lorem Ipsum
        </Button>

        {output && (
          <div className="relative">
            <Textarea className="min-h-[150px]" value={output} readOnly />
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
