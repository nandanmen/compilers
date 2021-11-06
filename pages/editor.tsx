import React from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { HiChevronDown } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
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
      }
    }
  }
}
`;

const input = `var a = 10

function sum(a, b) {
  var result = a + b
  return result
}`;

export default function Page() {
  const [output, setOutput] = React.useState("");
  const editorRef = React.useRef<any>();

  function exec() {
    setOutput("");
    const code = editorRef.current.getValue();
    const out = transform(input, code);
    setOutput(out);
  }

  return (
    <Main>
      <Article as="article">
        <Title>Your First Babel Plugin</Title>
        <p>
          I want to start off with the Hello, World of Babel plugins: a small
          plugin that converts all variables declared with `var` to variables
          declared with `let`.
        </p>
        <p>
          I've shown the complete plugin code in the middle column — it's only
          ten lines of code! Don't worry if none of the code makes sense — we'll
          get to what the code does and how it works in due time.
        </p>
        <p>
          For now, uncomment the code on line 10, press the play button (or
          press enter), and watch the plugin work its magic!
        </p>
      </Article>
      <EditorWrapper>
        <Editor
          defaultLanguage="javascript"
          defaultValue={code}
          theme="myCustomTheme"
          beforeMount={prepareMonaco}
          onMount={(editor) => (editorRef.current = editor)}
          options={{
            fontFamily: "Input Mono",
            fontSize: "13px",
            minimap: {
              enabled: false,
            },
            tabWidth: 2,
            scrollBeyondLastLine: false,
          }}
        />
      </EditorWrapper>
      <CodeOutput>
        <CodeBlock>{input}</CodeBlock>
        <CodeBlock>{output}</CodeBlock>
        <Arrow>
          <HiChevronDown size="2rem" />
        </Arrow>
        <Play onClick={exec}>
          <FaPlay size="1rem" />
        </Play>
      </CodeOutput>
    </Main>
  );
}

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
  gridTemplateColumns: "65ch repeat(2, 1fr)",
  height: "calc(100vh - 10px)",
});

const Title = styled("h1", {
  fontSize: "2.5rem",
  color: "$mint10",
  fontFamily: "$serif",
});

const Column = styled("div", {
  "&:not(:last-child)": {
    borderRight: "2px solid $mint4",
  },
});

const CodeOutput = styled(Column, {
  display: "grid",
  gridTemplateRows: "repeat(2, 1fr)",
  position: "relative",

  "> *": {
    padding: "$16",
  },

  "> :first-child": {
    borderBottom: "2px solid $mint4",
  },
});

const Article = styled(Column, {
  padding: "$16",
  lineHeight: 1.7,
  color: "$mint12",

  "> *": {
    gridColumn: 3,
  },

  "> :not(:last-child)": {
    marginBottom: "1em",
  },

  "> h2": {
    marginTop: "$16",
  },
});

const EditorWrapper = styled(Column, {
  padding: "$4 0",
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
