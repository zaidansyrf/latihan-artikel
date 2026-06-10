"use client";

import { createContext, useContext, useState } from "react";

const EditorContext = createContext<{
  editor: any;
  setEditor: (editor: any) => void;
} | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [editor, setEditor] = useState<any>(null);
  return (
    <EditorContext.Provider value={{ editor, setEditor }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useSharedEditor() {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useSharedEditor harus digunakan di dalam EditorProvider");
  return context;
}