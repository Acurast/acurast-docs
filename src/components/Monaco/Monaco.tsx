import React, { useEffect, useRef } from "react";
import { useColorMode } from "@docusaurus/theme-common";
import type * as MonacoApi from "monaco-editor";
import { loadMonaco } from "@site/src/utils/monaco";

type Props = {
  value: string;
  language: string;
  width: number;
  height: number;
  onChange?: (value: string) => void;
  options?: MonacoApi.editor.IStandaloneEditorConstructionOptions;
};

function Monaco({ value, language, width, height, onChange, options }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<MonacoApi.editor.IStandaloneCodeEditor>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const { colorMode } = useColorMode();
  const theme = colorMode === "dark" ? "acurast-dark" : "vs";

  // The editor is created once; later prop changes are applied by the effects below.
  useEffect(() => {
    let disposed = false;

    loadMonaco().then((monaco) => {
      if (disposed || !containerRef.current) {
        return;
      }
      // TypeScript models need a file URI so the TS worker can resolve them.
      const model = monaco.editor.createModel(
        value,
        language,
        language === "typescript"
          ? monaco.Uri.parse(`file:///main-${crypto.randomUUID()}.ts`)
          : undefined
      );
      const editor = monaco.editor.create(containerRef.current, {
        ...options,
        model,
        theme,
        dimension: { width, height },
      });
      editor.onDidChangeModelContent(() => {
        onChangeRef.current?.(editor.getValue());
      });
      editorRef.current = editor;
    });

    return () => {
      disposed = true;
      editorRef.current?.getModel()?.dispose();
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.getValue() !== value) {
      editor.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    editorRef.current?.layout({ width, height });
  }, [width, height]);

  useEffect(() => {
    if (editorRef.current) {
      loadMonaco().then((monaco) => monaco.editor.setTheme(theme));
    }
  }, [theme]);

  return <div ref={containerRef} style={{ width, height }} />;
}

export default Monaco;
