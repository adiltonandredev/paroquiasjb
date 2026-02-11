"use client";

import React, { useEffect, useState, useRef } from "react";
// REMOVIDO: BubbleMenu (causador do erro)
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
// Mantemos a extensão lógica, pois ela ajuda no processamento
import BubbleMenuExtension from "@tiptap/extension-bubble-menu"; 

import { 
  Bold, Italic, Strikethrough, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, 
  Image as ImageIcon, Undo, Redo, Heading1, Heading2,
  Upload, Globe, Trash2, type LucideIcon, 
  Scaling, Move
} from "lucide-react";

import { cn } from "@/lib/utils";

// --- EXTENSÃO PERSONALIZADA DE IMAGEM ---
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
            style: `width: ${attributes.width}; height: auto; display: block;`
          };
        },
      },
      class: {
        default: 'mx-auto', 
      },
    };
  },
});

// --- BARRA DE FERRAMENTAS ---
const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fecha menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".image-menu-container")) {
        setIsImageMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) return null;

  // Verifica se uma imagem está selecionada para mostrar ferramentas especiais
  const isImageSelected = editor.isActive('image');

  // --- FUNÇÕES DE IMAGEM ---
  const addImageUrl = () => {
    const url = window.prompt("Cole a URL da imagem:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setIsImageMenuOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
    setIsImageMenuOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL do link:", previousUrl);
    
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const ToolbarBtn = ({ 
    onClick, 
    isActive = false, 
    icon: Icon,
    className,
    title
  }: { 
    onClick: () => void, 
    isActive?: boolean, 
    icon: LucideIcon,
    className?: string,
    title?: string
  }) => (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={cn(
        "h-8 w-8 flex items-center justify-center rounded-md transition-colors border-0",
        isActive 
          ? "bg-slate-200 text-slate-900" 
          : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900",
        className
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="border-b border-slate-200 bg-slate-50 p-2 flex flex-col gap-2 sticky top-0 z-10">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

      {/* LINHA 1: Ferramentas de Texto (Padrão) */}
      <div className={cn("flex flex-wrap gap-1", isImageSelected && "opacity-50 pointer-events-none")}>
        {/* Histórico */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 mr-1">
            <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} icon={Undo} />
            <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} icon={Redo} />
        </div>

        {/* Títulos */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 mr-1">
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} icon={Heading1} />
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} icon={Heading2} />
        </div>

        {/* Formatação */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 mr-1">
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} icon={Bold} />
            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} icon={Italic} />
            <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} icon={Strikethrough} />
        </div>

        {/* Alinhamento Texto */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2 mr-1">
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })} icon={AlignLeft} />
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })} icon={AlignCenter} />
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} isActive={editor.isActive({ textAlign: "right" })} icon={AlignRight} />
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("justify").run()} isActive={editor.isActive({ textAlign: "justify" })} icon={AlignJustify} />
        </div>

        {/* Listas e Mídia */}
        <div className="flex items-center gap-0.5">
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} icon={List} />
            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} icon={ListOrdered} />
            <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
            <ToolbarBtn onClick={setLink} isActive={editor.isActive("link")} icon={LinkIcon} />
            
            {/* Dropdown de Imagem */}
            <div className="relative image-menu-container">
                <ToolbarBtn onClick={() => setIsImageMenuOpen(!isImageMenuOpen)} isActive={isImageMenuOpen} icon={ImageIcon} />
                {isImageMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-50 py-1 flex flex-col">
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left">
                            <Upload className="w-3.5 h-3.5" /> Do Computador
                        </button>
                        <button onClick={addImageUrl} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left">
                            <Globe className="w-3.5 h-3.5" /> Via Link (URL)
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* LINHA 2: Ferramentas de Imagem (Aparece só quando clica na imagem) */}
      {isImageSelected && (
        <div className="flex items-center gap-2 animate-in slide-in-from-top-2 bg-blue-50/50 p-1.5 rounded-md border border-blue-100">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider px-2 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Editar Imagem:
            </span>
            
            <div className="h-4 w-[1px] bg-blue-200 mx-1"></div>

            {/* Alinhamento da Imagem */}
            <div className="flex items-center gap-1">
                <ToolbarBtn 
                    onClick={() => editor.chain().focus().updateAttributes('image', { class: 'float-left mr-4 mb-2' }).run()}
                    isActive={editor.getAttributes('image').class?.includes('float-left')}
                    icon={AlignLeft}
                    title="Alinhar à Esquerda"
                    className={editor.getAttributes('image').class?.includes('float-left') ? "bg-white text-blue-600 shadow-sm" : ""}
                />
                <ToolbarBtn 
                    onClick={() => editor.chain().focus().updateAttributes('image', { class: 'mx-auto block' }).run()}
                    isActive={editor.getAttributes('image').class?.includes('mx-auto')}
                    icon={AlignCenter}
                    title="Centralizar"
                    className={editor.getAttributes('image').class?.includes('mx-auto') ? "bg-white text-blue-600 shadow-sm" : ""}
                />
                <ToolbarBtn 
                    onClick={() => editor.chain().focus().updateAttributes('image', { class: 'float-right ml-4 mb-2' }).run()}
                    isActive={editor.getAttributes('image').class?.includes('float-right')}
                    icon={AlignRight}
                    title="Alinhar à Direita"
                    className={editor.getAttributes('image').class?.includes('float-right') ? "bg-white text-blue-600 shadow-sm" : ""}
                />
            </div>

            <div className="h-4 w-[1px] bg-blue-200 mx-1"></div>

            {/* Tamanho */}
            <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                <button onClick={() => editor.chain().focus().updateAttributes('image', { width: '25%' }).run()} className="px-2 py-1 hover:bg-white rounded hover:text-blue-600 transition-colors">25%</button>
                <button onClick={() => editor.chain().focus().updateAttributes('image', { width: '50%' }).run()} className="px-2 py-1 hover:bg-white rounded hover:text-blue-600 transition-colors">50%</button>
                <button onClick={() => editor.chain().focus().updateAttributes('image', { width: '75%' }).run()} className="px-2 py-1 hover:bg-white rounded hover:text-blue-600 transition-colors">75%</button>
                <button onClick={() => editor.chain().focus().updateAttributes('image', { width: '100%' }).run()} className="px-2 py-1 hover:bg-white rounded hover:text-blue-600 transition-colors">100%</button>
            </div>

             <div className="h-4 w-[1px] bg-blue-200 mx-1"></div>

            {/* Excluir */}
            <ToolbarBtn 
                onClick={() => editor.chain().focus().deleteSelection().run()}
                icon={Trash2}
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                title="Remover Imagem"
            />
        </div>
      )}

    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      BubbleMenuExtension, 
      CustomImage,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-4 min-h-[300px] outline-none text-slate-700 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-2 [&>h2]:mt-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mb-2 [&>h3]:mt-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-1",
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm relative">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}