import * as tar from "https://deno.land/std@0.166.0/archive/tar.ts";
import * as streams from "https://deno.land/std@0.166.0/streams/mod.ts";
import * as fs from "https://deno.land/std@0.166.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.166.0/path/mod.ts";
import { pascalCase, paramCase } from "https://deno.land/x/case@2.1.1/mod.ts";

import * as mustache from "https://deno.land/x/mustache_ts@v0.4.1.1/mustache.ts";

const DEFAULT_TEMPLATES = "https://yskszk63.github.io/cdk-template/";
const DEFAULT_TEMPLATE_NAME = "simple.tgz";

class Name {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  get camelCase() {
    return pascalCase(this.#value);
  }

  get kebabCase() {
    return paramCase(this.#value);
  }
}

class Opts {
  readonly dir: URL;
  readonly template: URL;
  readonly name: Name;

  static fronArgs(args: string[]): Opts {
    // args[0] ... dest
    // args[1] ... template
    // args[2] ... name

    function resolveTemplate(spec: string | undefined, cwd: URL): URL {
      if (typeof spec === "undefined") {
        return new URL(DEFAULT_TEMPLATE_NAME, DEFAULT_TEMPLATES);
      }

      try {
        return new URL(spec);
      } catch (e) {
        // pass
      }
      return new URL(spec, cwd);
    }

    function appendSlashIfNeed(spec: string | undefined): string | undefined {
      if (typeof spec === "undefined") {
        return void 0;
      }
      if (spec.startsWith("/")) {
        return spec;
      }
      return `${spec}/`;
    }

    const cwd = path.toFileUrl(`${Deno.cwd()}/`);
    const dir = new URL(appendSlashIfNeed(args[0]) ?? ".", cwd);
    const template = resolveTemplate(args[1], cwd);

    const name = args[2] ?? dir.pathname.split("/").at(-2); // '/a/b/c/' -> ['a', 'b', 'c', '']
    if (typeof name === "undefined") {
      throw new Error();
    }

    return new Opts(dir, template, new Name(name));
  }

  constructor(dir: URL, template: URL, name: Name) {
    this.dir = dir;
    this.template = template;
    this.name = name;
  }
}

async function readAll(reader: ReadableStream<Uint8Array>): Promise<string> {
  const decoded = new TextDecoderStream();
  const chunks: string[] = [];
  for await (const chunk of reader.pipeThrough(decoded)) {
    chunks.push(chunk);
  }
  return chunks.join("");
}

async function main() {
  const opts = Opts.fronArgs(Deno.args);

  const template = await fetch(opts.template);
  if (!template.ok) {
    throw new Error(template.statusText);
  }
  if (template.body === null) {
    throw new Error();
  }

  const model = {
    name: opts.name,
  }

  const ungzip = new DecompressionStream("gzip");
  const reader = template.body.pipeThrough(ungzip).getReader();
  try {
    const untar = new tar.Untar(streams.readerFromStreamReader(reader));
    for await (const entry of untar) {
      if (!entry.fileName.startsWith("package/")) {
        continue;
      }

      const dest = new URL(entry.fileName.slice("package/".length), opts.dir);
      await fs.ensureFile(dest)
      const stat = await Deno.stat(dest);
      if (stat.size > 0) {
        console.warn("File exists. skip:", dest.toString());
        continue;
      }

      const text = await readAll(streams.readableStreamFromReader(entry));
      const rendered = mustache.render(text, model);

      await Deno.writeTextFile(dest, rendered);
    }
  } finally {
    reader.releaseLock();
  }
}
await main();
