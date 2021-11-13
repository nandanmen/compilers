import React from "react";
import Editor, { EditorProps, Monaco } from "@monaco-editor/react";
import { HiChevronDown } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { useDebounce } from "use-debounce";

import { styled } from "@/stitches";
import { CodeBlock } from "../components/CodeBlock";
import { transform } from "../lib/useBabelPlugin";

const code = `
/**
 * A babel plugin to convert 'var' declarations to 'let'.
 */
export default () => {
  return {
    visitor: {
      VariableDeclaration(path) {
        if (path.node.kind === 'var') {
          // path.node.kind = 'let'
        }
      },
      Identifier(path) {

      }
    }
  }
}
`;

const inputCode = `
var a = 10

function sum(a, b) {
  var result = a + b
  return result
}
`;

function getNodeAtPosition(model, position) {
  const text = model.getValueInRange({
    startColumn: 1,
    startLineNumber: 1,
    endColumn: position.column,
    endLineNumber: position.lineNumber,
  });

  const [, nodes] = text.split("visitor: {") as string[];
  if (nodes) {
    const matches = nodes.match(/([A-Z][a-z0-9]+)+/g);
    return matches?.reverse()[0];
  }
}

function getChildNodes(node) {
  return Object.values(node).filter((childProp: any) => {
    if (Array.isArray(childProp)) {
      const [first] = childProp;
      return first && Boolean(first.type);
    }
    return childProp && Boolean(childProp.type);
  });
}

function Tree({ tree, activeNode }) {
  if (Array.isArray(tree)) {
    return (
      <>
        {tree.map((node) => (
          <Tree tree={node} activeNode={activeNode} />
        ))}
      </>
    );
  }

  const childNodes = getChildNodes(tree);
  return (
    <div>
      <TypeLabel active={activeNode === tree.type}>
        <code>{tree.type}</code>
      </TypeLabel>
      <Wrapper>
        {childNodes.map((node) => (
          <Tree tree={node} activeNode={activeNode} />
        ))}
      </Wrapper>
    </div>
  );
}

const TypeLabel = styled("p", {
  width: "fit-content",

  variants: {
    active: {
      true: {
        background: "$mint8",
      },
    },
  },
});

const Wrapper = styled("div", {
  paddingLeft: "$4",
});

function getLocations(tree, activeNode: string) {
  const locs = [];

  try {
    traverse(tree, {
      [activeNode]: (path) => {
        locs.push(path.node.loc);
      },
    });
  } catch {}

  return locs;
}

export default function Page() {
  const [output, setOutput] = React.useState("");
  const [activeNode, setActiveNode] = React.useState<string | undefined>();
  const editorRef = React.useRef<any>();
  const inputEditorRef = React.useRef<any>();
  const monacoRef = React.useRef<any>();
  const decorationRefs = React.useRef<string[]>([]);

  const [input, setInput] = React.useState(inputCode);
  const [debouncedInput] = useDebounce(input, 500);
  const [tree, setTree] = React.useState(() => parse(inputCode));

  React.useEffect(() => {
    try {
      setTree(parse(debouncedInput));
    } catch {}
  }, [debouncedInput]);

  React.useEffect(() => {
    exec(debouncedInput);
  }, [debouncedInput]);

  React.useEffect(() => {
    if (activeNode) {
      const locs = getLocations(tree, activeNode);

      const newDecorations = inputEditorRef.current.deltaDecorations(
        decorationRefs.current,
        locs.map((loc) => ({
          range: new monacoRef.current.Range(
            loc.start.line,
            loc.start.column + 1,
            loc.end.line,
            loc.end.column + 1
          ),
          options: {
            inlineClassName: "decorated",
          },
        }))
      );
      decorationRefs.current = newDecorations;
    }
  }, [activeNode, tree]);

  function handleMount(editor: any) {
    editorRef.current = editor;
    editor.onKeyDown(({ code, metaKey }) => {
      if (metaKey && code === "Enter") {
        exec();
      }
    });
    editor.onDidChangeCursorPosition((args) => {
      const { position } = args;

      const model = editorRef.current.getModel();
      const node = getNodeAtPosition(model, position);

      setActiveNode(node);
    });
  }

  function exec(inputCode = input) {
    const code = editorRef.current?.getValue();
    if (code) {
      setOutput("");
      try {
        const out = transform(inputCode, code);
        setOutput(out);
      } catch (e) {
        setOutput((e as Error).message);
      }
    }
  }

  return (
    <Main>
      <Column>
        <CodeEditor defaultValue={code} onMount={handleMount} />
      </Column>
      <TreeColumn>
        <Tree tree={tree.program} activeNode={activeNode} />
      </TreeColumn>
      <CodeOutput>
        <CodeEditor
          defaultValue={input}
          onMount={(editor, monaco) => {
            inputEditorRef.current = editor;
            monacoRef.current = monaco;
          }}
          onChange={(newCode) => setInput(newCode ?? "")}
        />
        <OutputCode>{output}</OutputCode>
        <Arrow>
          <HiChevronDown size="2rem" />
        </Arrow>
        <Play onClick={() => exec()}>
          <FaPlay size="1rem" />
        </Play>
      </CodeOutput>
    </Main>
  );
}

function CodeEditor(props: EditorProps) {
  return (
    <Editor
      defaultLanguage="javascript"
      height="50vh"
      theme="myCustomTheme"
      beforeMount={prepareMonaco}
      options={{
        fontFamily: "Input Mono",
        fontSize: "13px",
        minimap: {
          enabled: false,
        },
        tabWidth: 2,
        scrollBeyondLastLine: false,
      }}
      {...props}
    />
  );
}

const OutputCode = styled(CodeBlock, {
  padding: "$16",
});

const Control = styled("div", {
  padding: "$2",
  borderRadius: "12px",
  border: "2px solid $mint4",
  width: "$8",
  aspectRatio: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "$mint2",
  color: "inherit",
});

const Arrow = styled(Control, {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});

const Play = styled(Control, {
  position: "absolute",
  border: "none",
  background: "$green8",
  top: "50%",
  transform: "translate(-50%, -50%)",
  cursor: "pointer",
});

const Main = styled("main", {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  height: "calc(100vh - 10px)",
});

const Column = styled("div", {
  maxHeight: "100%",

  "&:not(:last-child)": {
    borderRight: "2px solid $mint4",
  },
});

const TreeColumn = styled(Column, {
  padding: "$16",
});

const CodeOutput = styled(Column, {
  display: "grid",
  gridTemplateRows: "repeat(2, 1fr)",
  position: "relative",

  "> :first-child": {
    borderBottom: "2px solid $mint4",
  },
});

function prepareMonaco(monaco: Monaco) {
  monaco.editor.defineTheme("myCustomTheme", {
    base: "vs-dark",
    inherit: false,
    rules: [
      {
        foreground: "e7fcf7",
        token: "",
      },
      {
        foreground: "006d5b",
        fontStyle: "italic",
        token: "comment",
      },
      {
        foreground: "30a46c",
        token: "keyword",
      },
      {
        token: "type.identifier",
        foreground: "4cc38a",
        fontStyle: "bold",
      },
      {
        token: "string",
        foreground: "4cc38a",
      },
    ],
    colors: {
      "editor.foreground": "#e7fcf7",
      "editor.background": "#05201e",
      "editor.selectionBackground": "#04312c",
      "editor.lineHighlightBackground": "#04312c",
      "editorCursor.foreground": "#7070FF",
      "editorWhitespace.foreground": "#BFBFBF",
      "editorIndentGuide.background": "#01453d",
    },
  });
}
