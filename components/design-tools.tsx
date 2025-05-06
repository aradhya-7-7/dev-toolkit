import { useState } from "react";

// TailwindCSS Playground
const TailwindPlayground = () => {
  const [tailwindCode, setTailwindCode] = useState("text-2xl text-blue-500 font-bold");
  const [tailwindPreview, setTailwindPreview] = useState("Hello Tailwind!");

  return (
    <div className="border border-white/20 backdrop-blur-md p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-2">🎨 TailwindCSS Playground</h2>
      <textarea
        value={tailwindCode}
        onChange={(e) => setTailwindCode(e.target.value)}
        placeholder="Enter Tailwind classes"
        className="w-full p-2 rounded-md bg-black text-white text-sm mb-2"
      />
      <input
        value={tailwindPreview}
        onChange={(e) => setTailwindPreview(e.target.value)}
        placeholder="Text content"
        className="w-full p-2 rounded-md bg-black text-white text-sm mb-4"
      />
      <div className="p-4 rounded-md bg-white text-black text-center" style={{ fontFamily: "monospace" }}>
        <div className={tailwindCode}>{tailwindPreview}</div>
      </div>
    </div>
  );
};

// Box Shadow Generator
const BoxShadowGenerator = () => {
  const [boxShadow, setBoxShadow] = useState("0px 4px 8px rgba(0, 0, 0, 0.2)");

  return (
    <div className="border border-white/20 backdrop-blur-md p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-2">🧱 Box Shadow Generator</h2>
      <input
        type="text"
        value={boxShadow}
        onChange={(e) => setBoxShadow(e.target.value)}
        className="w-full p-2 rounded-md bg-black text-white text-sm mb-4"
      />
      <div
        className="w-full h-32 rounded-md"
        style={{ boxShadow, background: "#ffffff20", transition: "0.2s" }}
      />
      <p className="text-sm text-white mt-2 break-words">box-shadow: {boxShadow};</p>
    </div>
  );
};

// Flex/Grid Playground
const LayoutPlayground = () => {
  const [layout, setLayout] = useState<"flex" | "grid">("flex");

  return (
    <div className=" border border-white/20 backdrop-blur-md p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-2">📦 Flex/Grid Playground</h2>
      <select
        value={layout}
        onChange={(e) => setLayout(e.target.value as "flex" | "grid")}
        className="w-full p-2 mb-4 rounded-md bg-black border-white/20 text-white text-sm"
      >
        <option value="flex">Flexbox</option>
        <option value="grid">Grid</option>
      </select>
      <div
        className={`gap-2 p-2 rounded-md bg-white text-black ${
          layout === "flex" ? "flex justify-center items-center" : "grid grid-cols-3"
        }`}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="bg-blue-500 text-white p-2 rounded-md">
            Item {n}
          </div>
        ))}
      </div>
    </div>
  );
};

// Export Component
const CssUiTools = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 p-4">
      <TailwindPlayground />
      <BoxShadowGenerator />
      <LayoutPlayground />
    </div>
  );
};

export default CssUiTools;
