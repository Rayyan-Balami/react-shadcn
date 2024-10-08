import type { Editor } from "@tiptap/core";
import type { Level } from "@tiptap/extension-heading";
import { cn } from "@/lib/utils";
import { ChevronDown, Heading } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToolbarButton } from "../toolbar-button";
import { ShortcutKey } from "../shortcut-key";

interface TextStyle {
  label: string;
  element: keyof JSX.IntrinsicElements;
  level?: Level;
  className: string;
  shortcut: string[];
}

const TEXT_STYLES: TextStyle[] = [
  {
    label: "Normal Text",
    element: "span",
    className: "text-node",
    shortcut: ["mod", "alt", "0"],
  },
  {
    label: "Heading 1",
    element: "h1",
    level: 1,
    className: "heading-node",
    shortcut: ["mod", "alt", "1"],
  },
  {
    label: "Heading 2",
    element: "h2",
    level: 2,
    className: "heading-node",
    shortcut: ["mod", "alt", "2"],
  },
  {
    label: "Heading 3",
    element: "h3",
    level: 3,
    className: "heading-node",
    shortcut: ["mod", "alt", "3"],
  },
  {
    label: "Heading 4",
    element: "h4",
    level: 4,
    className: "heading-node",
    shortcut: ["mod", "alt", "4"],
  },
  {
    label: "Heading 5",
    element: "h5",
    level: 5,
    className: "heading-node",
    shortcut: ["mod", "alt", "5"],
  },
  {
    label: "Heading 6",
    element: "h6",
    level: 6,
    className: "heading-node",
    shortcut: ["mod", "alt", "6"],
  },
];

export const SectionOne = ({ editor }: { editor: Editor }) => {
  const handleStyleChange = (level?: Level) => {
    if (level) {
      editor.chain().focus().toggleHeading({ level }).run();
    } else {
      editor.chain().focus().setParagraph().run();
    }
  };

  const renderMenuItem = ({
    label,
    element: Element,
    level,
    className,
    shortcut,
  }: TextStyle) => (
    <DropdownMenuItem
      key={label}
      onClick={() => handleStyleChange(level)}
      className={cn("flex flex-row items-center justify-between gap-4", {
        "bg-accent": level
          ? editor.isActive("heading", { level })
          : editor.isActive("paragraph"),
      })}
      aria-label={label}
    >
      <Element className={className}>{label}</Element>
      <ShortcutKey keys={shortcut} />
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          isActive={editor.isActive("heading")}
          tooltip="Text styles"
          aria-label="Text styles"
          pressed={editor.isActive("heading")}
          disabled={editor.isActive("codeBlock")}
        >
          <Heading className="size-4" />
          <ChevronDown className="size-3.5" />
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-full"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        {TEXT_STYLES.map(renderMenuItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SectionOne;
