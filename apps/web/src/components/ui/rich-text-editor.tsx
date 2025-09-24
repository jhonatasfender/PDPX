"use client";
import { cn } from "@/lib/cn";
import isHotkey from "is-hotkey";
import { useCallback, useMemo, useEffect, type ReactNode } from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
  Text,
  Range,
} from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact, useSlate, ReactEditor } from "slate-react";
import {
  Bold,
  Italic,
  Underline,
  Code as CodeIcon,
  Heading1,
  Heading2,
  Quote,
  List as ListIcon,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeightPx?: number;
};

const HOTKEYS: Record<string, string> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"] as const;
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"] as const;

export function RichTextEditor({
  value = "",
  onChange,
  placeholder,
  className = "",
  minHeightPx = 240,
}: Props) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue = useMemo<Descendant[]>(
    () => [
      { type: "paragraph", children: [{ text: String(value ?? "") }] } as any,
    ],
    [],
  );

  useEffect(() => {
    try {
      if (editor.children.length === 0) {
        Transforms.insertNodes(editor, {
          type: "paragraph",
          children: [{ text: "" }],
        } as any);
      }
      if (!editor.selection) {
        const end = Editor.end(editor, []);
        Transforms.select(editor, end);
      }
    } catch {}
  }, [editor]);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  return (
    <div
      className={cn(
        "rounded-md border border-neutral-800 overflow-hidden",
        className,
      )}
    >
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(val) => {
          try {
            onChange?.(serializeNodes(val as any[]));
          } catch {}
        }}
      >
        <div className="flex flex-wrap gap-1 p-2">
          <MarkButton format="bold" title="Negrito">
            <Bold size={16} />
          </MarkButton>
          <MarkButton format="italic" title="Itálico">
            <Italic size={16} />
          </MarkButton>
          <MarkButton format="underline" title="Sublinhado">
            <Underline size={16} />
          </MarkButton>
          <MarkButton format="code" title="Código">
            <CodeIcon size={16} />
          </MarkButton>
          <BlockButton format="heading-one" title="Título H1">
            <Heading1 size={16} />
          </BlockButton>
          <BlockButton format="heading-two" title="Título H2">
            <Heading2 size={16} />
          </BlockButton>
          <BlockButton format="block-quote" title="Citação">
            <Quote size={16} />
          </BlockButton>
          <BlockButton format="numbered-list" title="Lista ordenada">
            <ListOrdered size={16} />
          </BlockButton>
          <BlockButton format="bulleted-list" title="Lista">
            <ListIcon size={16} />
          </BlockButton>
          <BlockButton format="left" title="Alinhar à esquerda">
            <AlignLeft size={16} />
          </BlockButton>
          <BlockButton format="center" title="Centralizar">
            <AlignCenter size={16} />
          </BlockButton>
          <BlockButton format="right" title="Alinhar à direita">
            <AlignRight size={16} />
          </BlockButton>
          <BlockButton format="justify" title="Justificar">
            <AlignJustify size={16} />
          </BlockButton>
        </div>
        <Editable
          className="prose prose-invert max-w-none bg-neutral-900 px-3 py-2 text-neutral-100 outline-none overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words"
          style={{ minHeight: minHeightPx }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder ?? "Escreva a descrição..."}
          spellCheck
          onPaste={async (e) => {
            const items = e.clipboardData?.items || [];
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              if (item.kind === "file") {
                const file = item.getAsFile();
                if (file && file.type.startsWith("image/")) {
                  e.preventDefault();
                  const dataUrl = await new Promise<string>(
                    (resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(String(reader.result));
                      reader.onerror = () => reject(reader.error);
                      reader.readAsDataURL(file);
                    },
                  );
                  insertImage(editor, dataUrl);
                  break;
                }
              }
            }
          }}
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
    </div>
  );
}

function ensureSelection(editor: any) {
  try {
    ReactEditor.focus(editor);
  } catch {}
  if (!editor.selection) {
    try {
      Transforms.select(editor, Editor.end(editor, []));
    } catch {}
  }
}

function toggleMark(editor: any, format: string) {
  ensureSelection(editor);
  const isActive = isMarkActive(editor, format);
  const { selection } = editor;
  if (selection && Range.isExpanded(selection)) {
    Transforms.setNodes(editor, { [format]: !isActive } as any, {
      match: Text.isText,
      split: true,
    });
  } else {
    if (isActive) Editor.removeMark(editor, format as any);
    else Editor.addMark(editor, format as any, true);
  }
}

function isMarkActive(editor: any, format: string) {
  const marks = Editor.marks(editor) as any;
  return marks ? marks[format] === true : false;
}

function Element({ attributes, children, element }: any) {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "image":
      return (
        <div {...attributes} contentEditable={false} className="my-2">
          <img
            src={element.url}
            alt=""
            className="max-w-full h-auto max-h-80 rounded"
          />
          {children}
        </div>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
}

function Leaf({ attributes, children, leaf }: any) {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.code) children = <code>{children}</code>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span {...attributes}>{children}</span>;
}

function MarkButton({
  format,
  children,
  title,
}: {
  format: string;
  children: ReactNode;
  title?: string;
}) {
  const editor = useSlate();
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => toggleMark(editor, format)}
      className="rounded-md border border-neutral-800 px-2 py-1 text-sm hover:bg-neutral-900"
      title={title}
    >
      {children}
    </button>
  );
}

function BlockButton({
  format,
  children,
  title,
}: {
  format: string;
  children: ReactNode;
  title?: string;
}) {
  const editor = useSlate();
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => toggleBlock(editor as any, format)}
      className="rounded-md border border-neutral-800 px-2 py-1 text-sm hover:bg-neutral-900"
      title={title}
    >
      {children}
    </button>
  );
}

function isAlignType(format: string) {
  return (TEXT_ALIGN_TYPES as readonly string[]).includes(format);
}

function isListType(format: string) {
  return (LIST_TYPES as readonly string[]).includes(format as any);
}

function isBlockActive(
  editor: any,
  format: string,
  blockType: "type" | "align" = "type",
) {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: any) => {
        if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
          if (blockType === "align" && (n as any).align !== undefined)
            return (n as any).align === format;
          return (n as any).type === format;
        }
        return false;
      },
    }),
  );
  return !!match;
}

function toggleBlock(editor: any, format: string) {
  ensureSelection(editor);
  const isActive = isBlockActive(
    editor,
    format,
    isAlignType(format) ? "align" : "type",
  );
  const isList = isListType(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      isListType((n as any).type) &&
      !isAlignType(format),
    split: true,
  });

  let newProperties: Partial<SlateElement> = {};
  if (isAlignType(format)) {
    (newProperties as any) = { align: isActive ? undefined : format };
  } else {
    (newProperties as any) = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block: any = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

function serializeNodes(nodes: any[]): string {
  if (!Array.isArray(nodes)) return "";
  return nodes
    .filter(Boolean)
    .map((n) => serializeNode(n))
    .join("");
}

function serializeNode(node: any): string {
  if (!node) return "";
  if (Text.isText(node)) {
    let text = escapeHtml(node.text);
    const t: any = node;
    if (t.bold) text = `<strong>${text}</strong>`;
    if (t.italic) text = `<em>${text}</em>`;
    if (t.underline) text = `<u>${text}</u>`;
    if (t.code) text = `<code>${text}</code>`;
    return text;
  }
  const children = (node.children || []).map(serializeNode).join("");
  const style = node.align ? ` style="text-align:${node.align}"` : "";
  switch (node.type) {
    case "image":
      return `<img src="${escapeHtml(node.url || "")}" alt="" />`;
    case "heading-one":
      return `<h1${style}>${children}</h1>`;
    case "heading-two":
      return `<h2${style}>${children}</h2>`;
    case "block-quote":
      return `<blockquote${style}>${children}</blockquote>`;
    case "numbered-list":
      return `<ol${style}>${children}</ol>`;
    case "bulleted-list":
      return `<ul${style}>${children}</ul>`;
    case "list-item":
      return `<li>${children}</li>`;
    default:
      return `<p${style}>${children}</p>`;
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function insertImage(editor: any, url: string) {
  ensureSelection(editor);
  const image: any = { type: "image", url, children: [{ text: "" }] };
  Transforms.insertNodes(editor, image);
}
