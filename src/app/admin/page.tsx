"use client";

import { useCallback, useEffect, useState } from "react";

/* ---------------------------------------------------------------- *
 * Hummingbird CMS — a simple file-based editor.
 * Edits the JSON files in /src/content. In dev the site hot-reloads;
 * to publish, commit the changed JSON (and any /public/uploads) and
 * redeploy.
 * ---------------------------------------------------------------- */

const SECTIONS: { key: string; label: string }[] = [
  { key: "site", label: "Site (nav, brand, footer)" },
  { key: "home", label: "Home page" },
  { key: "about", label: "About page" },
  { key: "contact", label: "Contact page" },
  { key: "projects", label: "Projects" },
  { key: "testimonials", label: "Testimonials" },
  { key: "clients", label: "Clients" },
];

const IMAGE_KEY = /(cover|image|logo|src|photo|avatar|gallery)/i;

// Arrays that are plain lists of text (not objects).
const STRING_LIST_KEYS = new Set([
  "gallery",
  "tags",
  "tools",
  "credits",
  "paragraphs",
  "closing",
]);

// Shape templates so adding to an emptied list creates the right kind of item.
const TEMPLATES: Record<string, Record<string, unknown>> = {
  clients: { name: "", logo: "" },
  testimonials: { name: "", role: "", image: "", accent: "blue" },
  projects: {
    slug: "",
    title: "",
    category: "",
    year: "",
    accent: "blue",
    featured: false,
    description: "",
    cover: "",
    gallery: [],
    client: "",
    tools: [],
    tags: [],
    published: "",
  },
  faq: { q: "", a: "" },
  traits: { title: "", body: "", accent: "blue" },
  loves: { label: "", color: "bg-coral" },
  why: { icon: "", title: "", body: "", tint: "bg-coral/15" },
  polaroids: { src: "", caption: "", left: "10%", top: "10%", rotate: 0, z: 10 },
  nav: { label: "", href: "/" },
  links: { label: "", value: "", href: "", accent: "bg-coral" },
};
const LONG_KEY =
  /(description|body|^a$|answer|paragraph|statement|client|sub|footer|tagline|caption|lead|full)/i;

type Json = unknown;

function setDeep(obj: Json, path: (string | number)[], val: Json): Json {
  if (path.length === 0) return val;
  const [k, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = [...(obj as Json[])];
    const idx = k as number;
    copy[idx] = setDeep(copy[idx], rest, val);
    return copy;
  }
  const o = (obj ?? {}) as Record<string, Json>;
  const copy = { ...o };
  copy[k as string] = setDeep(o[k as string], rest, val);
  return copy;
}

function emptyLike(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") {
    const out: Record<string, Json> = {};
    for (const [k, val] of Object.entries(v)) out[k] = emptyLike(val);
    return out;
  }
  return "";
}

function prettify(k: string) {
  return k
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (s) => s.toUpperCase());
}

async function uploadImage(file: File): Promise<string | null> {
  const pw = localStorage.getItem("cms_pw") || "";
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "x-admin-password": pw },
    body: fd,
  });
  if (!res.ok) {
    alert("Upload failed — check your password.");
    return null;
  }
  const data = await res.json();
  return data.path as string;
}

function ImageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="h-12 w-12 shrink-0 rounded-md border border-black/10 object-cover"
        />
      ) : (
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-dashed border-black/20 text-[10px] text-black/40">
          none
        </div>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-md border border-black/15 px-3 py-2 text-sm"
        placeholder="/path/to/image"
      />
      <label className="cursor-pointer rounded-md bg-black/5 px-3 py-2 text-sm font-medium hover:bg-black/10">
        Upload
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) {
              const p = await uploadImage(f);
              if (p) onChange(p);
            }
          }}
        />
      </label>
    </div>
  );
}

function rowLabel(item: Record<string, Json>, index: number) {
  const keys = ["title", "name", "q", "label", "heading"];
  for (const k of keys) {
    if (typeof item[k] === "string" && item[k]) return item[k] as string;
  }
  return `Item ${index + 1}`;
}

function RepeaterRow({
  item,
  index,
  path,
  onChange,
  onRemove,
}: {
  item: Record<string, Json>;
  index: number;
  path: (string | number)[];
  onChange: (path: (string | number)[], val: Json) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-black/[0.02]">
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span className="text-black/40">{open ? "▾" : "▸"}</span>
          <span className="truncate text-sm font-medium">
            {rowLabel(item, index)}
          </span>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
        >
          Remove
        </button>
      </div>
      {open && (
        <div className="border-t border-black/10 p-4">
          <ObjectFields obj={item} path={path} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

function Field({
  value,
  path,
  keyName,
  onChange,
}: {
  value: Json;
  path: (string | number)[];
  keyName: string;
  onChange: (path: (string | number)[], val: Json) => void;
}) {
  // String
  if (typeof value === "string") {
    if (IMAGE_KEY.test(keyName)) {
      return (
        <ImageInput value={value} onChange={(v) => onChange(path, v)} />
      );
    }
    const long = LONG_KEY.test(keyName) || value.length > 70;
    return long ? (
      <textarea
        value={value}
        onChange={(e) => onChange(path, e.target.value)}
        rows={3}
        className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(path, e.target.value)}
        className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
      />
    );
  }

  // Number
  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(path, Number(e.target.value))}
        className="w-32 rounded-md border border-black/15 px-3 py-2 text-sm"
      />
    );
  }

  // Boolean
  if (typeof value === "boolean") {
    return (
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(path, e.target.checked)}
        className="h-5 w-5"
      />
    );
  }

  // Array
  if (Array.isArray(value)) {
    // Decide list-of-text vs list-of-cards. For an empty array we can't tell
    // from the data, so fall back to the known key (fixes the "emptied list
    // turns into text" bug).
    const isStringList =
      value.length > 0
        ? value.every((v) => typeof v === "string")
        : STRING_LIST_KEYS.has(keyName) || !TEMPLATES[keyName];
    if (isStringList) {
      const arr = value as string[];
      const isImg = IMAGE_KEY.test(keyName);
      return (
        <div className="space-y-2">
          {arr.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1">
                {isImg ? (
                  <ImageInput
                    value={item}
                    onChange={(v) => onChange([...path, i], v)}
                  />
                ) : (
                  <input
                    value={item}
                    onChange={(e) => onChange([...path, i], e.target.value)}
                    className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                  />
                )}
              </div>
              <button
                onClick={() =>
                  onChange(path, arr.filter((_, j) => j !== i))
                }
                className="rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-50"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange(path, [...arr, ""])}
            className="rounded-md bg-black/5 px-3 py-1.5 text-sm font-medium hover:bg-black/10"
          >
            + Add
          </button>
        </div>
      );
    }
    // Array of objects → collapsible repeater
    const arr = value as Record<string, Json>[];
    return (
      <div className="space-y-2">
        {arr.map((item, i) => (
          <RepeaterRow
            key={i}
            item={item}
            index={i}
            path={[...path, i]}
            onChange={onChange}
            onRemove={() => onChange(path, arr.filter((_, j) => j !== i))}
          />
        ))}
        <button
          onClick={() => {
            const template = arr[0]
              ? emptyLike(arr[0])
              : (TEMPLATES[keyName] ?? {});
            onChange(path, [...arr, template as Json]);
          }}
          className="rounded-md bg-black/5 px-3 py-1.5 text-sm font-medium hover:bg-black/10"
        >
          + Add item
        </button>
      </div>
    );
  }

  // Object
  if (value && typeof value === "object") {
    return (
      <div className="rounded-lg border border-black/10 p-4">
        <ObjectFields
          obj={value as Record<string, Json>}
          path={path}
          onChange={onChange}
        />
      </div>
    );
  }

  return null;
}

function ObjectFields({
  obj,
  path,
  onChange,
}: {
  obj: Record<string, Json>;
  path: (string | number)[];
  onChange: (path: (string | number)[], val: Json) => void;
}) {
  return (
    <div className="space-y-4">
      {Object.entries(obj).map(([k, v]) => (
        <div key={k}>
          <label className="mb-1.5 block text-sm font-semibold text-black/70">
            {prettify(k)}
          </label>
          <Field
            value={v}
            path={[...path, k]}
            keyName={k}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) {
      localStorage.setItem("cms_pw", pw);
      onSuccess(pw);
    } else {
      setError("Wrong password, try again.");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-white px-5 text-[#202428]">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-black/10 p-8"
      >
        <h1 className="text-lg font-bold">Hummingbird CMS</h1>
        <p className="mb-6 text-sm text-black/45">
          Enter your password to continue.
        </p>
        <input
          autoFocus
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md border border-black/15 px-3 py-2.5 text-sm"
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded-full bg-[#202428] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const [section, setSection] = useState("home");
  const [data, setData] = useState<Json>(null);
  const [pw, setPw] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  // On load, verify any stored password before showing the editor.
  useEffect(() => {
    const stored = localStorage.getItem("cms_pw") || "";
    if (!stored) {
      setChecking(false);
      return;
    }
    fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: stored }),
    })
      .then((r) => {
        if (r.ok) {
          setPw(stored);
          setAuthed(true);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  const load = useCallback(async (s: string) => {
    setLoading(true);
    setStatus("");
    const res = await fetch(`/api/content?section=${s}`);
    let d = await res.json();
    // Ensure projects always expose a "featured" toggle, even if older
    // entries were saved before the field existed (without touching data).
    if (s === "projects" && Array.isArray(d)) {
      d = d.map((p) =>
        p && typeof p === "object" && !("featured" in p)
          ? { ...p, featured: false }
          : p
      );
    }
    setData(d);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(section);
  }, [section, load]);

  const onChange = useCallback(
    (p: (string | number)[], val: Json) => {
      setData((d: Json) => setDeep(d, p, val));
    },
    []
  );

  async function save() {
    localStorage.setItem("cms_pw", pw);
    setStatus("Saving…");
    const res = await fetch(`/api/content?section=${section}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": pw,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) setStatus("Saved ✓ (the site updates live)");
    else if (res.status === 401) setStatus("Wrong password ✕");
    else setStatus("Save failed ✕");
  }

  const isArray = Array.isArray(data);

  if (checking)
    return (
      <div className="grid min-h-screen place-items-center bg-white text-black/40">
        Loading…
      </div>
    );

  if (!authed)
    return (
      <Login
        onSuccess={(p) => {
          setPw(p);
          setAuthed(true);
        }}
      />
    );

  return (
    <div className="min-h-screen bg-white text-[#202428]">
      <div className="mx-auto flex max-w-6xl gap-8 px-5 py-10">
        {/* Sidebar */}
        <aside className="w-56 shrink-0">
          <h1 className="text-lg font-bold">Hummingbird CMS</h1>
          <p className="mb-5 text-xs text-black/40">Edit every section</p>
          <nav className="space-y-1">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
                  section === s.key
                    ? "bg-[#18BBD0]/15 font-semibold text-[#0e8ba0]"
                    : "hover:bg-black/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => {
              localStorage.removeItem("cms_pw");
              setAuthed(false);
              setPw("");
            }}
            className="mt-8 w-full rounded-md border border-black/10 px-3 py-2 text-sm text-black/50 hover:bg-black/5"
          >
            Log out
          </button>
        </aside>

        {/* Editor */}
        <main className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">
              {SECTIONS.find((s) => s.key === section)?.label}
            </h2>
            <div className="flex items-center gap-3">
              {status && (
                <span className="text-sm text-black/50">{status}</span>
              )}
              <button
                onClick={save}
                className="rounded-full bg-[#202428] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>

          {loading || data === null ? (
            <p className="text-black/40">Loading…</p>
          ) : isArray ? (
            <Field
              value={data}
              path={[]}
              keyName={section}
              onChange={onChange}
            />
          ) : (
            <ObjectFields
              obj={data as Record<string, Json>}
              path={[]}
              onChange={onChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}
