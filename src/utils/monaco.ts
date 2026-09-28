import type * as MonacoApi from "monaco-editor";

export type Monaco = typeof MonacoApi;

let monacoPromise: Promise<Monaco> | undefined;

// Monaco touches `window` on import, so it is loaded lazily and only in the browser.
export function loadMonaco(): Promise<Monaco> {
  monacoPromise ??= (async () => {
    self.MonacoEnvironment = {
      getWorker(_workerId, label) {
        if (label === "typescript" || label === "javascript") {
          return new Worker(
            new URL(
              "monaco-editor/languages/features/typescript/ts.worker",
              import.meta.url
            )
          );
        }
        return new Worker(
          new URL("monaco-editor/editor/editor.worker", import.meta.url)
        );
      },
    };

    const monaco = await import("monaco-editor");

    monaco.editor.defineTheme("acurast-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [{ token: "", background: "121212" }],
      colors: {
        "editor.background": "#121212",
      },
    });

    monaco.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.typescript.ScriptTarget.ES2017,
      allowNonTsExtensions: true,
      moduleResolution: monaco.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.typescript.ModuleKind.ESNext,
    });

    return monaco;
  })();

  return monacoPromise;
}

// Transpiles TypeScript to JavaScript with Monaco's bundled TypeScript worker.
export async function transpile(source: string): Promise<string> {
  const monaco = await loadMonaco();
  const uri = monaco.Uri.parse(`file:///transpile-${crypto.randomUUID()}.ts`);
  const model = monaco.editor.createModel(source, "typescript", uri);

  try {
    const getWorker = await monaco.typescript.getTypeScriptWorker();
    const worker = await getWorker(uri);
    const output = await worker.getEmitOutput(uri.toString());
    const js = output.outputFiles.find((file) => file.name.endsWith(".js"));
    if (!js) {
      throw new Error("TypeScript emitted no JavaScript");
    }
    return js.text;
  } finally {
    model.dispose();
  }
}
