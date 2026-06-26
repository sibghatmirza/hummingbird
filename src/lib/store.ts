import { promises as fs } from "fs";
import path from "path";

/**
 * Content storage with two backends:
 *  - GitHub (production): reads/writes files via the GitHub API and commits
 *    them, which triggers a Vercel rebuild. Enabled when GITHUB_TOKEN +
 *    GITHUB_REPO are set.
 *  - Local filesystem (dev): plain file reads/writes.
 */

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO; // e.g. "sib/hummingbird"
const BRANCH = process.env.GITHUB_BRANCH || "main";

export const usingGitHub = Boolean(TOKEN && REPO);

const gh = (p: string) =>
  `https://api.github.com/repos/${REPO}/contents/${p}`;

const ghHeaders = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
  "User-Agent": "hummingbird-cms",
};

async function ghGet(relPath: string) {
  const res = await fetch(`${gh(relPath)}?ref=${BRANCH}`, {
    headers: ghHeaders,
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  return (await res.json()) as { content: string; sha: string };
}

async function ghPut(relPath: string, base64: string, message: string) {
  const existing = await ghGet(relPath);
  const res = await fetch(gh(relPath), {
    method: "PUT",
    headers: { ...ghHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: base64,
      branch: BRANCH,
      sha: existing?.sha,
    }),
  });
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status}`);
}

/** Read a text file (latest committed version in prod). */
export async function readText(relPath: string): Promise<string> {
  if (usingGitHub) {
    const data = await ghGet(relPath);
    if (!data) throw new Error(`Not found: ${relPath}`);
    return Buffer.from(data.content, "base64").toString("utf8");
  }
  return fs.readFile(path.join(process.cwd(), relPath), "utf8");
}

/** Write a text file. */
export async function writeText(relPath: string, content: string) {
  if (usingGitHub) {
    await ghPut(
      relPath,
      Buffer.from(content, "utf8").toString("base64"),
      `cms: update ${relPath}`
    );
    return;
  }
  const full = path.join(process.cwd(), relPath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, "utf8");
}

/** Write a binary file (e.g. an uploaded image). */
export async function writeBinary(relPath: string, buf: Buffer) {
  if (usingGitHub) {
    await ghPut(relPath, buf.toString("base64"), `cms: upload ${relPath}`);
    return;
  }
  const full = path.join(process.cwd(), relPath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, buf);
}
