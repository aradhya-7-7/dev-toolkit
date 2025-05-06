import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// 🖥 Terminal Emulator
const TerminalEmulator = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleCommand = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const output = `> ${trimmed}`;
    let response = '';

    if (trimmed === 'help') {
      response = 'Available commands: help, echo, clear';
    } else if (trimmed.startsWith('echo ')) {
      response = trimmed.slice(5);
    } else if (trimmed === 'clear') {
      setLogs([]);
      setInput('');
      return;
    } else {
      response = `Command not found: ${trimmed}`;
    }

    setLogs(prev => [...prev, output, response]);
    setInput('');
    setTimeout(() => {
      terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
    }, 10);
  };

  return (
    <Card className="border-white/20 backdrop-blur-md text-white rounded-md">
      <CardHeader><CardTitle> Terminal Emulator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div ref={terminalRef} className="h-64 overflow-y-auto bg-black text-green-400 font-mono p-3 rounded-md border border-white/10">
          {logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
        <form onSubmit={e => { e.preventDefault(); handleCommand(); }} className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter command (try: help)" className="flex-1" />
          <Button type="submit">Run</Button>
        </form>
      </CardContent>
    </Card>
  );
};

// 📦 Package.json Explorer
const PackageJSONExplorer = () => {
  const [json, setJson] = useState(`{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "react": "^18.0.0"
  }
}`);

  let parsed;
  try {
    parsed = JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    parsed = '❌ Invalid JSON';
  }

  return (
    <Card className=" border-white/20 backdrop-blur-md text-white rounded-md">
      <CardHeader><CardTitle> Package.json Explorer</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={json} onChange={e => setJson(e.target.value)} rows={10} className="font-mono" />
        <div className="p-3 bg-gray-900 text-green-300 text-sm rounded-md overflow-x-auto max-h-64">
          <pre>{parsed}</pre>
        </div>
      </CardContent>
    </Card>
  );
};

// 🐳 Dockerfile Generator
const DockerfileGenerator = () => {
  const [dockerfile, setDockerfile] = useState(`FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]`);

  const copyToClipboard = () => navigator.clipboard.writeText(dockerfile);

  return (
    <Card className=" border-white/20 backdrop-blur-md text-white rounded-md">
      <CardHeader><CardTitle> Dockerfile Generator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={dockerfile} onChange={e => setDockerfile(e.target.value)} rows={10} className="font-mono" />
        <Button onClick={copyToClipboard}>Copy Dockerfile</Button>
      </CardContent>
    </Card>
  );
};

// 📁 .gitignore Generator
const GitignoreGenerator = () => {
  const [template, setTemplate] = useState("node");
  const templates: Record<string, string> = {
    node: `node_modules/
.env
dist/
*.log`,
    python: `__pycache__/
*.py[cod]
.env
venv/`,
    react: `node_modules/
.env
build/
*.log`,
  };

  const content = templates[template] || "";

  const copyToClipboard = () => navigator.clipboard.writeText(content);

  return (
    <Card className=" border-white/20 backdrop-blur-md text-white rounded-md">
      <CardHeader><CardTitle> .gitignore Generator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <select
          value={template}
          onChange={e => setTemplate(e.target.value)}
          className="bg-black text-white border p-2 rounded-md w-full"
        >
          <option value="node">Node.js</option>
          <option value="python">Python</option>
          <option value="react">React</option>
        </select>
        <Textarea value={content} rows={8} readOnly className="font-mono" />
        <Button onClick={copyToClipboard}>Copy .gitignore</Button>
      </CardContent>
    </Card>
  );
};

// 🚀 Script Runner (Simulated)
const ScriptRunner = () => {
  const [script, setScript] = useState('');
  const [output, setOutput] = useState('');

  const simulateRun = () => {
    if (!script.trim()) return;
    if (script === 'npm run start' || script === 'yarn start') {
      setOutput('> Starting app...\n✔ Server running at http://localhost:3000');
    } else {
      setOutput(`> ${script}\n⚠️ Unknown script`);
    }
  };

  return (
    <Card className=" border-white/20 backdrop-blur-md text-white rounded-md">
      <CardHeader><CardTitle> NPM/Yarn Script Runner</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={script}
          onChange={e => setScript(e.target.value)}
          placeholder="e.g. npm run start"
        />
        <Button onClick={simulateRun}>Run</Button>
        {output && (
          <div className="p-3 bg-black text-green-400 font-mono text-sm rounded-md whitespace-pre-line">
            {output}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DevTools = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 p-4">
      <TerminalEmulator />
      <PackageJSONExplorer />
      <DockerfileGenerator />
      <GitignoreGenerator />
      <ScriptRunner />
    </div>
  );
};

export default DevTools;
