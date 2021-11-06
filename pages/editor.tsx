import React from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { styled } from "@/stitches";

const code = `
/**
 * A babel plugin to convert 'var' declarations to 'let'.
 */
export default function () {
  return {
    visitor: {
      VariableDeclaration(node) {
        if (node.kind === 'var') {
          // node.kind = 'let'
        }
      }
    }
  }
}
`;

export default function Page() {
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
        <h2>About the Playground</h2>
        <p>
          In the middle column you'll find the source code of the plugin itself
          — it's only ten lines of code! On the top right you have the input
          that's passed into the plugin, with the corresponding output shown on
          the bottom right.
        </p>
      </Article>
      <EditorWrapper>
        <Editor
          defaultLanguage="javascript"
          defaultValue={code}
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
        />
      </EditorWrapper>
      <Column>Output</Column>
    </Main>
  );
}

const Main = styled("main", {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  height: "calc(100vh - 10px)",
});

const Title = styled("h1", {
  fontSize: "2.5rem",
  color: "$mint10",
  fontFamily: "$serif",
});

const Column = styled("div", {
  padding: "$16",

  "&:not(:last-child)": {
    borderRight: "2px solid $mint4",
  },
});

const Article = styled(Column, {
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
