import { parse } from "@babel/parser";
import { AstTree, AstTreeVariant } from "../components/AstTree";

const inputCode = `var a = 10;

function sum(a, b) {
  var result = a + b;
  return result;
}`;

const tree = parse(inputCode);

export default function TreePage() {
  return (
    <div>
      <AstTree tree={tree.program} variant={AstTreeVariant.Detail} />
    </div>
  );
}
