import type { AppProps } from "next/app";
import { globalCss } from "@/stitches";
import "../styles/index.css";

const globalStyles = globalCss({
  "*": {
    margin: 0,
    padding: 0,
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
    textRendering: "optimizeLegibility",
  },
  html: {
    background: "$mint2",
    color: "$mint12",
    fontFamily: "$sans",
  },
  pre: {
    fontFamily: "$mono",
  },
  code: {
    fontFamily: "$mono",
    padding: "$1",
    background: "$mint4",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();
  return <Component {...pageProps} />;
}

export default MyApp;
