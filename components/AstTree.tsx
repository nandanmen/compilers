import React from "react";
import { motion, AnimateSharedLayout } from "framer-motion";
import { styled } from "@/stitches";

export enum AstTreeVariant {
  Detail,
  Node,
}

type TreeContextType = {
  depth: number;
  code: string;
  variant: AstTreeVariant;
  whitelist: Set<string>;
  activeNodeType?: string;
};

const TreeContext = React.createContext<TreeContextType>({
  depth: 0,
  code: "",
  variant: AstTreeVariant.Node,
  whitelist: new Set(),
});

const useTreeContext = () => React.useContext(TreeContext);

type AstTreeProps = {
  className?: string;
  // TODO: Type this better
  tree: any;
} & Partial<TreeContextType>;

/**
 * The Tree component is an interactive AST. Given a `tree` and a `depth`, this
 * component renders all tree nodes up to the given depth. Deeper nodes can be
 * toggled by clicking on the node labels.
 *
 * The given tree is assumed to be an AST produced by @babel/parse.
 */
export function AstTree({
  className,
  tree,
  code = "",
  activeNodeType,
  variant = AstTreeVariant.Node,
  depth = 0,
  whitelist = new Set<string>(),
}: AstTreeProps) {
  return (
    <AstTreeWrapper layout="position" className={className}>
      <TreeContext.Provider
        value={{ depth, code, variant, whitelist, activeNodeType }}
      >
        <AnimateSharedLayout>
          <AstNode node={tree} path={[]} depth={0} />
        </AnimateSharedLayout>
      </TreeContext.Provider>
    </AstTreeWrapper>
  );
}

const AstTreeWrapper = styled(motion.ul, {
  fontSize: "$sm",
  fontFamily: "$mono",
  listStyle: "none",

  "> :not(:last-child)": {
    marginBottom: "$4",
  },
});

type AstNodeProps = {
  // TODO: Type this better
  node: any;
  path: string[];
  depth: number;
};

function AstNode({ node, path, depth }: AstNodeProps) {
  const {
    depth: initialDepth,
    code,
    variant,
    whitelist,
    activeNodeType,
  } = useTreeContext();
  const [isOpen, setIsOpen] = React.useState(depth <= initialDepth);

  if (isAstNode(node)) {
    const children = Object.entries(node).filter(([key, value]) => {
      if (variant === AstTreeVariant.Detail) {
        return true;
      }
      return isAstNode(value) || whitelist.has(key);
    });
    const hasChildren = children.length > 0;
    const isActive = node.type === activeNodeType;
    const source = code.slice(node.start, node.end);

    const label = hasChildren ? (
      <NodeToggle
        onClick={() => setIsOpen((open) => !open)}
        active={node.type === activeNodeType}
      >
        {node.type} {isOpen ? "-" : "+"}
      </NodeToggle>
    ) : (
      <NodeToggle as="p" active={node.type === activeNodeType}>
        {node.type}
      </NodeToggle>
    );

    return (
      <Node>
        <AstNodeLabel showLine={path.length !== 0}>{label}</AstNodeLabel>
        {isOpen && hasChildren && (
          <ChildWrapper>
            {children.map(([key, value]) => (
              <AstNodeGroup
                key={toKey([...path, key])}
                name={key}
                nodes={
                  Array.isArray(value)
                    ? value
                    : value && typeof value === "object"
                    ? [value]
                    : value
                }
                path={[...path, key]}
                depth={depth + 1}
              />
            ))}
          </ChildWrapper>
        )}
      </Node>
    );
  }

  if (typeof node === "object") {
    return (
      <>
        {Object.entries(node).map(([key, value]) => {
          return (
            <AstNodeGroup
              key={toKey([...path, key])}
              name={key}
              nodes={
                Array.isArray(value)
                  ? value
                  : value && typeof value === "object"
                  ? [value]
                  : value
              }
              path={[...path, key]}
              depth={depth + 1}
            />
          );
        })}
      </>
    );
  }

  return null;
}

type AstNodeGroupProps = {
  name: string;
  // TODO: Type this better
  nodes: any;
  path: string[];
  depth: number;
};

function AstNodeGroup({ name, nodes, path, depth }: AstNodeGroupProps) {
  const { depth: initialDepth } = useTreeContext();
  const [isOpen, setIsOpen] = React.useState(depth <= initialDepth);

  const hasChildren = Array.isArray(nodes) && nodes.length > 0;
  return (
    <Node>
      <NodeGroupLabel showLine>
        <NodePropToggle onClick={() => setIsOpen((open) => !open)}>
          <NameLabel>{name}</NameLabel>
          {hasChildren ? (
            <span>{isOpen ? "-" : "+"}</span>
          ) : (
            <span>
              {nodes === undefined ? "undefined" : JSON.stringify(nodes)}
            </span>
          )}
        </NodePropToggle>
      </NodeGroupLabel>
      {isOpen && hasChildren && (
        <ChildWrapper>
          {nodes.map((node, index) => (
            <AstNode
              key={toKey([...path, String(index)])}
              node={node}
              path={[...path, String(index)]}
              depth={depth + 1}
            />
          ))}
        </ChildWrapper>
      )}
    </Node>
  );
}

// -- Styled --

const NodeToggle = styled("button", {
  display: "block",
  position: "relative",
  marginBottom: "$2",
  padding: "$1",
  borderRadius: 6,
  background: "$mint2",
  width: "fit-content",

  "&:focus": {
    outline: "none",
    color: "$green10",
  },

  variants: {
    active: {
      true: {
        background: "$green8",
      },
    },
  },
});

const NodePropToggle = styled("button", {
  "> :first-child": {
    backgroundColor: "$mint4",
  },

  "> :not(:last-child)": {
    marginRight: "$1",
  },

  "&:focus > :first-child": {
    outline: "none",
    backgroundColor: "$green8",
    color: "white",
  },
});

const NameLabel = styled("span", {
  padding: "$1",
  borderRadius: 4,
});

function Node(props) {
  return (
    <NodeWrapper
      layout="position"
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: -4, opacity: 0 }}
      {...props}
    />
  );
}

const NodeWrapper = styled(motion.li, {
  position: "relative",

  "> ul > li:last-child:before": {
    content: "",
    position: "absolute",
    height: "100%",
    background: "$mint2",
    width: 4,
    left: `calc(-1rem - 1px)`,
    zIndex: 10,
  },

  "&:after": {
    content: "",
    position: "absolute",
    top: 0,
    height: "100%",
    width: 2,
    background: "$mint7",
    left: "1rem",
    zIndex: -1,
  },
});

function NodeLabel(props) {
  return <NodeLabelWrapper layout="position" {...props} />;
}

const NodeLabelWrapper = styled(motion.div, {
  position: "relative",
  background: "$mint2",
  marginBottom: "$2",

  variants: {
    showLine: {
      true: {
        "&:after": {
          content: "",
          position: "absolute",
          height: "0.75rem",
          width: "0.75rem",
          top: -2,
          left: "-1rem",
          borderBottom: "2px solid $mint7",
          borderLeft: "2px solid $mint7",
          borderBottomLeftRadius: "0.5rem",
        },
      },
    },
  },
});

const AstNodeLabel = styled(NodeLabel, {
  position: "relative",
  zIndex: 10,
});

const NodeGroupLabel = styled(AstNodeLabel, {
  marginBottom: "$2",
});

const ChildWrapper = styled("ul", {
  listStyle: "none",
  paddingLeft: "$8",
  marginBottom: "$2",
});

// -- Helpers --

function toKey(path: string[]) {
  return path.join(".");
}

function isAstNode(value: unknown): boolean {
  if (Array.isArray(value)) {
    const [first] = value;
    if (first) {
      return typeof first === "object" && first.hasOwnProperty("type");
    }
  }

  if (value && typeof value === "object") {
    return value.hasOwnProperty("type");
  }

  return false;
}
