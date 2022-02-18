import React from "react";
import { parse } from "@babel/parser";
import { styled } from "@/stitches";

const inputCode = `var a = 10;

function sum(a, b) {
  var result = a + b;
  return result;
}`;

const tree = parse(inputCode);

export default function TreePage() {
  return (
    <div>
      <Tree tree={tree.program} />
      <pre>{JSON.stringify(tree.program, null, 2)}</pre>
    </div>
  );
}

// --

function Tree({ tree }) {
  const [isOpen, setOpen] = React.useState(false);
  const childKeys = getChildren(tree);
  const hasChildren = childKeys.length > 0;

  return (
    <TreeWrapper>
      <button onClick={() => setOpen((open) => !open)} disabled={!hasChildren}>
        {getName(tree)} {hasChildren && (isOpen ? "-" : "+")}
      </button>
      {isOpen && (
        <ChildNodes>
          {childKeys.map(({ key, children, value, isPrimitive }) =>
            isPrimitive ? (
              <PrimitiveWrapper>
                <KeyWrapper as="p">{key}</KeyWrapper>
                <p>{String(value)}</p>
              </PrimitiveWrapper>
            ) : (
              <li>
                <KeyWrapper>{key}</KeyWrapper>
                <ChildNodes>
                  {children.map((child) => (
                    <li>
                      <Tree tree={child} />
                    </li>
                  ))}
                </ChildNodes>
              </li>
            )
          )}
        </ChildNodes>
      )}
    </TreeWrapper>
  );
}

const ALLOW_LIST = new Set([
  "kind",
  "name",
  "generator",
  "async",
  "value",
  "operator",
]);

function getName(tree) {
  return tree.type;
}

function getChildren(tree) {
  const children = [];
  for (const [key, value] of Object.entries(tree)) {
    if (ALLOW_LIST.has(key)) {
      children.push({ key, value, isPrimitive: true });
    } else if (isAstNode(value)) {
      children.push({ key, children: [value] });
    } else if (Array.isArray(value)) {
      const [first] = value;
      if (isAstNode(first)) {
        /* assumes that if the first node is an AST node, all items in the array are AST nodes as well */
        children.push({ key, children: value });
      }
    }
  }
  return children;
}

function isAstNode(node) {
  return node && node.hasOwnProperty("type");
}

const TreeWrapper = styled("div", {
  fontFamily: "$mono",
  lineHeight: 1,
});

const ChildNodes = styled("ul", {
  paddingLeft: "$6",
  listStyle: "none",

  "> :not(:last-child)": {
    marginBottom: "$2",
  },
});

const PrimitiveWrapper = styled("li", {
  display: "flex",
  gap: "$2",
});

const KeyWrapper = styled("button", {
  background: "$mint4",
  padding: 2,
  borderRadius: 2,
});
