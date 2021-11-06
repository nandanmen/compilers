import React from "react";
import * as Babel from "@babel/standalone";
import { useDebouncedCallback } from "use-debounce";

/**
 * Given code and a Babel plugin, this hook transforms the code using the
 * plugin, returning a code string.
 */
export function useBabelPlugin(code: string, plugin: any) {
  const [result, setResult] = React.useState("");
  const [error, setError] = React.useState(null);

  const debouncedSetError = useDebouncedCallback(
    (message) => setError(message),
    750
  );

  React.useEffect(() => {
    try {
      setError(null);
      const result = Babel.transform(code, { plugins: [plugin] });
      setResult(result.code);
    } catch (err) {
      // syntax error
      debouncedSetError((err as Error).message);
    }
  }, [code, plugin, debouncedSetError]);

  return [result, error];
}

export function usePluginString(code: string, plugin: string) {
  const [transformedPlugin] = useBabelPlugin(plugin, exportDefaultToReturn);
  const pluginObj = execute(transformedPlugin as string);
  return useBabelPlugin(code, pluginObj);
}

export function transform(code: string, plugin: string) {
  console.log("transforming", code, plugin);
  const pluginObj = Babel.transform(plugin, {
    plugins: [exportDefaultToReturn],
  });
  const result = Babel.transform(code, { plugins: [execute(pluginObj.code)] });
  return result.code;
}

function execute(code: string) {
  return new Function(code)();
}

function exportDefaultToReturn({ types: t }: any) {
  return {
    visitor: {
      ExportDefaultDeclaration(path: any) {
        path.replaceWith(t.returnStatement(path.node.declaration));
      },
    },
  };
}
