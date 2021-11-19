export const types = `
  declare type AstNode =
    | "VariableDeclaration"
    | "VariableDeclarator"
    | "BlockStatement"
    | "ReturnStatement"
    | "FunctionDeclaration"
    | "NumericLiteral"
    | "BinaryExpression"
    | "Identifier";

  declare interface BabelPlugin {
    visitor: Partial<Record<AstNode, (path: any) => void>>;
  }
`;
