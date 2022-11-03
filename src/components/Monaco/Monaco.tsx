import React, { Suspense, lazy } from "react";
import { useColorMode } from "@docusaurus/theme-common";
// import { libs } from "./monaco-types";
const libs = []
const MonacoEditor = lazy(() => import("react-monaco-editor"));

function Monaco(props) {
  let monacoRef;
  const { colorMode } = useColorMode();

  function onEditorWillMount(monaco) {
    monacoRef = monaco;
    const vsDarkTheme = {
      base: "vs-dark",
      inherit: true,
      rules: [{ background: "121212" }],
      colors: {
        "editor.background": "#121212",
      },
    };

    monaco.editor.defineTheme("vs-dark", vsDarkTheme);

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2017,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      typeRoots: ["node_modules/@types"],
    });

    libs.forEach((lib) => {
      const MONACO_LIB_PREFIX = "file:///node_modules/";
      const path = `${MONACO_LIB_PREFIX}${lib.name}`;
      monaco.languages.typescript.typescriptDefaults.addExtraLib(lib.dts, path);
    });

    if (props.editorWillMount) {
      props.editorWillMount(monaco);
    }
  }

  function onEditorDidMount(editor) {
    editor.setModel(
      monacoRef.editor.createModel(
        props.value,
        "typescript",
        monacoRef.Uri.parse(`file:///main-${Math.random()}.ts`)
      )
    );
  }

  return (
    <Suspense fallback={<div>Loading</div>}>
      <MonacoEditor
        {...props}
        editorWillMount={onEditorWillMount}
        editorWillUnmount={() => undefined}
        editorDidMount={onEditorDidMount}
        theme={colorMode === 'dark' ? "vs-dark" : "vs-light"}
      />
    </Suspense>
  );
}

export default Monaco;