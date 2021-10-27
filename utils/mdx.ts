import * as fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";

export const POSTS = path.join(process.cwd(), "content");

function readFile(fileName: string) {
  return fs.readFile(path.join(POSTS, fileName));
}

/**
 * Gets all pages, assuming pages are folders with an index.mdx file
 */
export async function getAllPages() {
  const pages = await fs.readdir(POSTS);
  return await Promise.all(
    pages.map(async (page) => {
      const content = await readFile(path.join(page, "index.mdx"));
      const { data: frontmatter } = matter(content);
      return {
        frontmatter,
        slug: page.replace(/\.mdx?$/, ""),
      };
    })
  );
}

export async function getPage(slug: string) {
  if (process.platform === "win32") {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      "node_modules",
      "esbuild",
      "esbuild.exe"
    );
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      "node_modules",
      "esbuild",
      "bin",
      "esbuild"
    );
  }

  const content = await readFile(path.join(slug, "index.mdx"));
  const { code, frontmatter } = await bundleMDX(content.toString(), {
    cwd: path.join(POSTS, slug),
    esbuildOptions(options) {
      return { ...options, target: ["es2020"] };
    },
  });
  return { frontmatter, code };
}
