"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  FileText,
  Highlighter,
  List,
  Menu,
  Minus,
  Moon,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Sun,
  Trash2,
  X,
  BookOpen,
  Edit3,
  Check,
  Clock,
  StickyNote,
  Search,
} from "lucide-react";

interface Section {
  title: string;
  page: number;
}

interface Chapter {
  id: string;
  title: string;
  pageStart: number;
  pageEnd: number;
  sections: Section[];
}

interface Highlight {
  id: string;
  text: string;
  color: string;
  page: number;
  chapterId: string;
  createdAt: string;
}

interface Note {
  id: string;
  text: string;
  page: number;
  chapterId: string;
  highlightId?: string;
  createdAt: string;
}

interface ReaderContentProps {
  bookId: string;
  title: string;
  author: string;
  chapters: Chapter[];
  totalPages: number;
  initialPage?: number;
}

const highlightColors = ["#FBBF24", "#34D399", "#60A5FA", "#F472B6", "#A78BFA"];

const fontFamilies = {
  sans: "font-['Source_Sans_3',sans-serif]",
  serif: "font-['Merriweather',serif]",
  mono: "font-['Fira_Code',monospace]",
};

const fontLabels = { sans: "Source Sans", serif: "Merriweather", mono: "Fira Code" };

export default function ReaderContent({
  bookId,
  title,
  author,
  chapters,
  totalPages,
  initialPage = 1,
}: ReaderContentProps) {
  const [page, setPage] = useState(initialPage);
  const [activeChId, setActiveChId] = useState(chapters[0]?.id || "");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [dark, setDark] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [font, setFont] = useState<"sans" | "serif" | "mono">("sans");
  const [expanded, setExpanded] = useState<string[]>([chapters[0]?.id]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"notes" | "highlights">("notes");
  const [notes, setNotes] = useState<Note[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTxt, setEditTxt] = useState("");
  const [hlColor, setHlColor] = useState(highlightColors[0]);
  const [settings, setSettings] = useState(false);

  const chIdx = chapters.findIndex((c) => c.id === activeChId);
  const ch = chapters[chIdx >= 0 ? chIdx : 0];
  const idx = chIdx >= 0 ? chIdx : 0;
  const progress = Math.round((page / totalPages) * 100);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "b") setBookmarked((p) => !p);
      else if (e.key === "Escape") {
        if (notesOpen) setNotesOpen(false);
        else if (mobileSidebar) setMobileSidebar(false);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [page, notesOpen, mobileSidebar]);

  const fNotes = notes.filter((n) => !query || n.text.toLowerCase().includes(query.toLowerCase()));
  const fHighlights = highlights.filter((h) => !query || h.text.toLowerCase().includes(query.toLowerCase()));

  const toggle = (id: string) => {
    setExpanded((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    if (!expanded.includes(id)) setActiveChId(id);
  };

  const go = (c: Chapter) => {
    setActiveChId(c.id);
    setPage(c.pageStart);
    setMobileSidebar(false);
    setExpanded((p) => (p.includes(c.id) ? p : [...p, c.id]));
  };

  const next = useCallback(() => {
    if (page >= totalPages) return;
    const p = page + 1;
    setPage(p);
    const c = chapters.find((ch) => p >= ch.pageStart && p <= ch.pageEnd);
    if (c) setActiveChId(c.id);
  }, [page, totalPages, chapters]);

  const prev = useCallback(() => {
    if (page <= 1) return;
    const p = page - 1;
    setPage(p);
    const c = chapters.find((ch) => p >= ch.pageStart && p <= ch.pageEnd);
    if (c) setActiveChId(c.id);
  }, [page, chapters]);

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes((p) => [
      {
        id: Date.now().toString(),
        text: newNote.trim(),
        page,
        chapterId: activeChId,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      },
      ...p,
    ]);
    setNewNote("");
  };

  const del = (id: string) => setNotes((p) => p.filter((n) => n.id !== id));
  const delH = (id: string) => setHighlights((p) => p.filter((h) => h.id !== id));

  const content = `Chapter ${idx + 1}: ${ch.title}

1.1 Introduction to ${ch.title}
The foundation of ${ch.title.toLowerCase()} lies in understanding the core principles and frameworks that govern this subject area. This chapter explores the fundamental concepts that every aspirant must master to build a strong knowledge base. The material is structured to provide both theoretical understanding and practical application.

1.2 Historical Context and Evolution
The evolution of this topic spans several decades of policy changes and administrative reforms. Understanding the historical context is essential for comprehending the current framework and anticipating future developments. Key milestones include landmark decisions, policy shifts, and institutional changes that have shaped the present landscape.

1.3 Core Principles and Framework
The theoretical framework encompasses multiple interconnected concepts that form the backbone of this subject. These principles are not isolated but work in concert to create a comprehensive understanding of how various elements interact within the system.

2.1 Key Concepts and Definitions
Mastering the precise definitions and terminology is crucial for effective communication and accurate analysis. Each concept has specific nuances that distinguish it from related ideas, and understanding these distinctions is fundamental to academic and professional success in this field.

2.2 Practical Applications and Case Studies
Real-world applications demonstrate how theoretical concepts translate into practice. Case studies from various contexts illustrate the diverse ways in which these principles are applied, providing valuable insights for examination and professional contexts.

2.3 Current Trends and Developments
The contemporary landscape is shaped by emerging trends, technological advancements, and evolving best practices. Staying current with these developments is essential for maintaining relevance and competitiveness.

3.1 Policy Framework Analysis
A systematic analysis of the policy framework reveals the intricate relationships between different regulatory mechanisms and their implementation. Understanding these relationships is key to effective policy analysis and formulation.

3.2 Administrative Structure and Governance
The administrative structure provides the institutional framework through which policies are implemented and services are delivered. Understanding the governance mechanisms, accountability structures, and coordination processes is essential for effective administration.

3.3 Recent Amendments and Updates
Recent amendments to existing policies reflect changing priorities, emerging challenges, and lessons learned from implementation experience. Staying informed about these changes is crucial for accurate and current knowledge.`;

  const lines = content.split("\n");

  /* ── Coursera Theme Tokens ── */
  const T = dark
    ? {
        bg: "bg-[#111111]",
        sidebar: "bg-[#1a1a1a] border-[#2d2d2d]",
        card: "bg-[#222222] border-[#333333]",
        cardHover: "hover:bg-[#2a2a2a] hover:border-[#404040]",
        input: "bg-[#222222] border-[#333333] text-white placeholder:text-[#6b6b6b]",
        topBar: "bg-[#111111]/90 border-[#2d2d2d]",
        text: "text-white",
        text2: "text-[#9a9a9a]",
        text3: "text-[#6b6b6b]",
        muted: "bg-[#222222]",
        activeBg: "bg-[#0056D2]/10",
        activeTxt: "text-[#41a0ff]",
        badge: "bg-[#0056D2] text-white",
        hover: "hover:bg-[#222222]",
        border: "border-[#2d2d2d]",
        body: "text-[#d4d4d4]",
      }
    : {
        bg: "bg-white",
        sidebar: "bg-white border-[#e5e5e5]",
        card: "bg-[#f9f9f9] border-[#e5e5e5]",
        cardHover: "hover:bg-white hover:border-[#d4d4d4] hover:shadow-sm",
        input: "bg-white border-[#d4d4d4] text-[#1f1f1f] placeholder:text-[#6b6b6b]",
        topBar: "bg-white/95 border-[#e5e5e5]",
        text: "text-[#1f1f1f]",
        text2: "text-[#6b6b6b]",
        text3: "text-[#9a9a9a]",
        muted: "bg-[#f5f5f5]",
        activeBg: "bg-[#0056D2]/8",
        activeTxt: "text-[#0056D2]",
        badge: "bg-[#0056D2] text-white",
        hover: "hover:bg-[#f5f5f5]",
        border: "border-[#e5e5e5]",
        body: "text-[#373737]",
      };

  return (
    <div className={cn("flex h-screen overflow-hidden transition-colors duration-300", T.bg)}>

      {/* ═══════ CHAPTER SIDEBAR ═══════ */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex-shrink-0",
          T.sidebar,
          sidebarOpen ? "w-[300px]" : "w-0 !border-0 overflow-hidden"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn("flex items-center justify-between px-5 py-5 border-b", T.border)}>
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", T.activeBg)}>
                <BookOpen className={cn("h-5 w-5", T.activeTxt)} />
              </div>
              <div>
                <p className={cn("text-sm font-bold", T.text)}>Table of Contents</p>
                <p className={cn("text-[11px] mt-0.5", T.text3)}>
                  {chapters.length} chapters
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={cn("h-8 w-8 rounded-xl flex items-center justify-center transition-colors", T.text3, T.hover)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Progress */}
          <div className={cn("px-5 py-4 border-b", T.border)}>
            <div className="flex items-center justify-between mb-3">
              <span className={cn("text-[10px] font-bold uppercase tracking-[0.15em]", T.text3)}>
                Progress
              </span>
              <span className={cn("text-sm font-black tabular-nums", T.activeTxt)}>
                {progress}%
              </span>
            </div>
            <div className={cn("h-1.5 rounded-full overflow-hidden", dark ? "bg-white/[0.06]" : "bg-gray-100")}>
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#0056D2] to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* Chapters */}
          <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
            {chapters.map((c) => {
              const isActive = activeChId === c.id;
              const isExpanded = expanded.includes(c.id);
              const ci = chapters.indexOf(c);
              const p = Math.round(
                ((Math.min(page, c.pageEnd) - c.pageStart + 1) / (c.pageEnd - c.pageStart + 1)) * 100
              );

              return (
                <div key={c.id}>
                  <button
                    onClick={() => toggle(c.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl text-left transition-all duration-200 group",
                      isActive ? T.activeBg : "transparent",
                      !isActive && T.hover
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black flex-shrink-0 transition-all",
                        isActive ? T.badge : cn(T.muted, T.text3)
                      )}
                    >
                      {ci + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[13px] font-bold truncate", isActive ? T.text : "text-gray-700 dark:text-zinc-200")}>
                        {c.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={cn("h-1 flex-1 rounded-full overflow-hidden", dark ? "bg-white/[0.06]" : "bg-gray-100")}>
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#0056D2] to-blue-400 transition-all duration-700"
                            style={{ width: `${Math.max(p, 3)}%` }}
                          />
                        </div>
                        <span className={cn("text-[10px] font-bold tabular-nums min-w-[30px] text-right", isActive ? T.activeTxt : T.text3)}>
                          {p}%
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 flex-shrink-0 transition-transform duration-300",
                        isExpanded && "rotate-90",
                        isActive ? T.activeTxt : T.text3
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="ml-[26px] pl-4 border-l-2 border-gray-100 dark:border-zinc-800 py-1 mb-1">
                          {c.sections.map((s) => {
                            const cur = page >= s.page;
                            return (
                              <button
                                key={s.title}
                                onClick={() => {
                                  setActiveChId(c.id);
                                  setPage(s.page);
                                  setMobileSidebar(false);
                                }}
                                className={cn(
                                  "w-full flex items-center gap-2 py-2 px-2 -mx-2 rounded-xl text-left transition-all",
                                  cur ? cn(T.activeTxt, "font-semibold") : cn(T.text3, "hover:text-gray-600 dark:hover:text-zinc-300")
                                )}
                              >
                                <div className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", cur ? "bg-[#0056D2]" : dark ? "bg-zinc-700" : "bg-gray-200")} />
                                <span className="text-[11px]">{s.title}</span>
                                {cur && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#0056D2] animate-pulse" />}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Top Bar ── */}
        <div className={cn("sticky top-0 z-40 border-b backdrop-blur-2xl transition-colors", T.topBar)}>
          <div className="flex h-[56px] items-center justify-between px-3 sm:px-5">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={() => setMobileSidebar(true)}>
                <Menu className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href={`/books/${bookId}`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 hidden lg:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <List className="h-4 w-4" />
              </Button>

              <div className={cn("w-px h-5 mx-1.5 hidden sm:block", dark ? "bg-white/10" : "bg-gray-200")} />

              <div className="hidden sm:block">
                <p className={cn("text-[13px] font-bold line-clamp-1 max-w-[280px]", T.text)}>
                  {title}
                </p>
                <p className={cn("text-[10px] tabular-nums font-medium", T.text3)}>
                  {ch.title} · p.{page}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-9 w-9 transition-colors", bookmarked && T.activeTxt)}
                onClick={() => setBookmarked(!bookmarked)}
              >
                {bookmarked ? <BookmarkCheck className="h-[18px] w-[18px] fill-current" /> : <Bookmark className="h-[18px] w-[18px]" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn("h-9 w-9 transition-colors", notesOpen && T.activeTxt)}
                onClick={() => setNotesOpen(!notesOpen)}
              >
                {notesOpen ? <PanelRightClose className="h-[18px] w-[18px]" /> : <PanelRightOpen className="h-[18px] w-[18px]" />}
              </Button>

              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setDark(!dark)}>
                {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </Button>

              <div className={cn("w-px h-5 mx-1 hidden sm:block", dark ? "bg-white/10" : "bg-gray-200")} />

              {/* Font size */}
              <div className={cn("hidden sm:flex items-center rounded-2xl border px-2 py-1 gap-0.5", T.border, T.muted)}>
                <button onClick={() => setFontSize(Math.max(12, fontSize - 1))} disabled={fontSize <= 12} className={cn("h-7 w-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30", T.text2, T.hover)}>
                  <Minus className="h-3 w-3" />
                </button>
                <span className={cn("text-[11px] font-black w-7 text-center tabular-nums", T.text2)}>{fontSize}</span>
                <button onClick={() => setFontSize(Math.min(28, fontSize + 1))} disabled={fontSize >= 28} className={cn("h-7 w-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30", T.text2, T.hover)}>
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <Button variant="ghost" size="icon" className="h-9 w-9 sm:hidden" onClick={() => setSettings(!settings)}>
                <PanelRightOpen className="h-[18px] w-[18px]" />
              </Button>
            </div>
          </div>

          {/* Mobile font settings */}
          <AnimatePresence>
            {settings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("sm:hidden border-t overflow-hidden", T.border)}
              >
                <div className={cn("px-4 py-3 flex items-center justify-between", T.muted)}>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-[11px] font-bold", T.text2)}>Size</span>
                    <div className={cn("flex items-center rounded-xl border px-1", T.border)}>
                      <button onClick={() => setFontSize(Math.max(12, fontSize - 1))} className={cn("h-7 w-7 rounded-lg flex items-center justify-center", T.text2)}>
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className={cn("text-[11px] font-black w-7 text-center tabular-nums", T.text)}>{fontSize}</span>
                      <button onClick={() => setFontSize(Math.min(28, fontSize + 1))} className={cn("h-7 w-7 rounded-lg flex items-center justify-center", T.text2)}>
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                   <div className="flex items-center gap-2">
                    <span className={cn("text-[11px] font-bold", T.text2)}>Font</span>
                    <div className={cn("flex gap-0.5 p-0.5 rounded-xl", dark ? "bg-white/[0.06]" : "bg-gray-100")}>
                      {(["sans", "serif", "mono"] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => setFont(f)}
                          className={cn(
                            "h-7 px-3 text-[10px] font-bold rounded-lg transition-all",
                            font === f ? cn(T.bg, "shadow-sm", T.text) : T.text3
                          )}
                        >
                          {fontLabels[f]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Reading Area ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[860px] px-5 py-10 sm:px-12 sm:py-16 select-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={cn("max-w-none", fontFamilies[font])}
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.75, letterSpacing: "0.01em" }}
            >
              {lines.map((line, i) => {
                if (line === "") return <div key={i} className="h-5" />;

                if (line.startsWith("Chapter")) {
                  return (
                    <h2
                      key={i}
                      className={cn(
                        "text-[1.6em] font-bold mb-8 pb-5 border-b-2 border-[#0056D2]/20 leading-tight",
                        T.text
                      )}
                    >
                      {line}
                    </h2>
                  );
                }

                if (line.match(/^\d\.\d/)) {
                  return (
                    <h3
                      key={i}
                      className={cn(
                        "text-[1.05em] font-semibold mt-10 mb-4 leading-snug",
                        T.activeTxt
                      )}
                    >
                      {line}
                    </h3>
                  );
                }

                if (line.match(/^\d+\./) && !line.startsWith("1.")) {
                  return (
                    <p key={i} className={cn("ml-4 mb-2 list-item leading-[1.75]", T.body)}>
                      {line}
                    </p>
                  );
                }

                return (
                  <p key={i} className={cn("mb-4 leading-[1.75]", T.body)}>
                    {line}
                  </p>
                );
              })}
            </motion.div>

            {/* Chapter Nav */}
            <div className={cn("mt-20 pt-8 border-t flex items-center justify-between gap-4", T.border)}>
              {chIdx > 0 ? (
                <button
                  onClick={() => go(chapters[chIdx - 1])}
                  className={cn(
                    "flex items-center gap-2 h-11 px-5 rounded-2xl text-sm font-bold transition-all border",
                    T.border,
                    T.activeTxt,
                    "hover:shadow-md hover:shadow-[#0056D2]/10 border-[#0056D2]/20 hover:border-[#0056D2]/40"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
              ) : <div />}
              {chIdx < chapters.length - 1 ? (
                <button
                  onClick={() => go(chapters[chIdx + 1])}
                  className={cn(
                    "flex items-center gap-2 h-11 px-5 rounded-2xl text-sm font-bold transition-all border",
                    T.border,
                    T.activeTxt,
                    "hover:shadow-md hover:shadow-[#0056D2]/10 border-[#0056D2]/20 hover:border-[#0056D2]/40"
                  )}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : <div />}
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className={cn("border-t flex-shrink-0 backdrop-blur-2xl transition-colors", T.topBar)}>
          <div className="flex items-center gap-4 px-4 py-3.5 max-w-[860px] mx-auto">
            <button
              onClick={prev}
              disabled={page <= 1}
              className={cn("flex items-center gap-1 h-8 px-3 rounded-xl text-[11px] font-bold transition-all disabled:opacity-30", T.activeTxt)}
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>

            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1">
                <Slider
                  value={[page]}
                  onValueChange={(v) => {
                    setPage(v[0]);
                    const c = chapters.find((ch) => v[0] >= ch.pageStart && v[0] <= ch.pageEnd);
                    if (c) setActiveChId(c.id);
                  }}
                  max={totalPages}
                  min={1}
                />
              </div>
              <span className={cn("text-[11px] whitespace-nowrap tabular-nums font-black min-w-[52px] text-right", T.text2)}>
                {page}/{totalPages}
              </span>
            </div>

            <button
              onClick={next}
              disabled={page >= totalPages}
              className={cn("flex items-center gap-1 h-8 px-3 rounded-xl text-[11px] font-bold transition-all disabled:opacity-30", T.activeTxt)}
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══════ NOTES SIDEBAR ═══════ */}
      <AnimatePresence>
        {notesOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn("hidden lg:flex flex-col border-l overflow-hidden flex-shrink-0", T.sidebar)}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className={cn("flex items-center justify-between px-5 py-5 border-b", T.border)}>
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", T.activeBg)}>
                    <FileText className={cn("h-5 w-5", T.activeTxt)} />
                  </div>
                  <div>
                    <p className={cn("text-sm font-bold", T.text)}>Notes & Highlights</p>
                    <p className={cn("text-[11px] mt-0.5", T.text3)}>
                      {notes.length} notes · {highlights.length} highlights
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotesOpen(false)}
                  className={cn("h-8 w-8 rounded-xl flex items-center justify-center transition-colors", T.text3, T.hover)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className={cn("px-5 py-3 border-b", T.border)}>
                <div className={cn("flex p-1 rounded-2xl", dark ? "bg-white/[0.04]" : "bg-gray-100")}>
                  {(["notes", "highlights"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={cn(
                        "flex-1 h-9 text-[11px] font-bold rounded-xl transition-all capitalize flex items-center justify-center gap-1.5",
                        tab === t
                          ? cn(T.bg, "shadow-sm", T.activeTxt)
                          : T.text3
                      )}
                    >
                      {t === "notes" ? <StickyNote className="h-3.5 w-3.5" /> : <Highlighter className="h-3.5 w-3.5" />}
                      {t} ({t === "notes" ? notes.length : highlights.length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className={cn("px-5 py-3 border-b", T.border)}>
                <div className="relative">
                  <Search className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4", T.text3)} />
                  <input
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={cn("w-full h-10 text-sm pl-10 pr-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-[#0056D2]/30 focus:border-[#0056D2] transition-all", T.input)}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {tab === "notes" && (
                  <>
                    {/* Add note */}
                    <div className="space-y-2.5 mb-5">
                      <textarea
                        placeholder="Write a note for this page..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            addNote();
                          }
                        }}
                        className={cn(
                          "w-full h-24 text-sm p-4 rounded-2xl border resize-none focus:outline-none focus:ring-2 focus:ring-[#0056D2]/30 focus:border-[#0056D2] transition-all",
                          T.input
                        )}
                      />
                      <button
                        onClick={addNote}
                        disabled={!newNote.trim()}
                        className="w-full h-11 rounded-2xl bg-[#0056D2] hover:bg-[#004bb5] text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#0056D2]/20 hover:shadow-xl hover:shadow-[#0056D2]/30"
                      >
                        <StickyNote className="h-4 w-4" /> Add Note
                      </button>
                    </div>

                    {fNotes.map((note) => (
                      <div key={note.id} className={cn("group rounded-2xl border p-4 transition-all", T.card, T.cardHover)}>
                        {note.highlightId && (
                          <div className={cn("flex items-center gap-1.5 mb-2", T.activeTxt)}>
                            <Highlighter className="h-3 w-3" />
                            <span className="text-[10px] font-bold">Linked highlight</span>
                          </div>
                        )}
                        {editId === note.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editTxt}
                              onChange={(e) => setEditTxt(e.target.value)}
                              className={cn("w-full text-sm p-2.5 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-[#0056D2]/30", T.input)}
                              rows={2}
                              autoFocus
                            />
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                                  setNotes((p) => p.map((n) => (n.id === note.id ? { ...n, text: editTxt } : n)));
                                  setEditId(null);
                                  setEditTxt("");
                                }}
                                className="h-7 px-3 rounded-lg bg-[#0056D2] text-white text-[11px] font-bold flex items-center gap-1"
                              >
                                <Check className="h-3 w-3" /> Save
                              </button>
                              <button onClick={() => { setEditId(null); setEditTxt(""); }} className={cn("h-7 px-3 rounded-lg text-[11px] font-bold", T.text3, T.hover)}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className={cn("text-sm leading-relaxed", T.body)}>{note.text}</p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className={cn("text-[10px] font-bold flex items-center gap-1", T.text3)}>
                            <Clock className="h-2.5 w-2.5" /> {note.createdAt}
                          </span>
                          {editId !== note.id && (
                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditId(note.id); setEditTxt(note.text); }} className={cn("h-6 w-6 rounded-lg flex items-center justify-center", T.text3, T.hover)}>
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button onClick={() => del(note.id)} className="h-6 w-6 rounded-lg flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {fNotes.length === 0 && (
                      <div className="text-center py-16">
                        <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4", T.muted)}>
                          <StickyNote className={cn("h-7 w-7", T.text3)} />
                        </div>
                        <p className={cn("text-sm font-bold", T.text2)}>No notes yet</p>
                        <p className={cn("text-xs mt-1", T.text3)}>Add a note to get started</p>
                      </div>
                    )}
                  </>
                )}

                {tab === "highlights" && (
                  <>
                    <div className="mb-5">
                      <p className={cn("text-[11px] font-bold uppercase tracking-wider mb-3", T.text3)}>
                        Highlight Color
                      </p>
                      <div className="flex gap-2.5">
                        {highlightColors.map((c) => (
                          <button
                            key={c}
                            className={cn(
                              "w-9 h-9 rounded-2xl border-2 transition-all duration-200",
                              hlColor === c ? "border-[#0056D2] scale-110 shadow-lg shadow-[#0056D2]/30" : "border-transparent hover:scale-105"
                            )}
                            style={{ backgroundColor: c }}
                            onClick={() => setHlColor(c)}
                          />
                        ))}
                      </div>
                    </div>

                    {fHighlights.map((h) => (
                      <div key={h.id} className={cn("group rounded-2xl border p-4 transition-all", T.card, T.cardHover)}>
                        <div className={cn("text-sm italic mb-3 border-l-[3px] pl-3 leading-relaxed", T.body)} style={{ borderColor: h.color }}>
                          &ldquo;{h.text}&rdquo;
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={cn("text-[10px] font-bold", T.text3)}>Page {h.page}</span>
                          <button
                            onClick={() => delH(h.id)}
                            className="h-6 w-6 rounded-lg flex items-center justify-center text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {fHighlights.length === 0 && (
                      <div className="text-center py-16">
                        <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4", T.muted)}>
                          <Highlighter className={cn("h-7 w-7", T.text3)} />
                        </div>
                        <p className={cn("text-sm font-bold", T.text2)}>No highlights yet</p>
                        <p className={cn("text-xs mt-1", T.text3)}>Select text to highlight</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ═══════ MOBILE CHAPTER DRAWER ═══════ */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-md"
              onClick={() => setMobileSidebar(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={cn("lg:hidden fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] shadow-2xl", T.sidebar)}
            >
              <div className="flex flex-col h-full">
                <div className={cn("flex items-center justify-between px-5 py-5 border-b", T.border)}>
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", T.activeBg)}>
                      <BookOpen className={cn("h-5 w-5", T.activeTxt)} />
                    </div>
                    <p className={cn("text-sm font-bold", T.text)}>Contents</p>
                  </div>
                  <button onClick={() => setMobileSidebar(false)} className={cn("h-8 w-8 rounded-xl flex items-center justify-center", T.text3, T.hover)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className={cn("px-5 py-4 border-b", T.border)}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn("text-[10px] font-bold uppercase tracking-[0.15em]", T.text3)}>Progress</span>
                    <span className={cn("text-sm font-black tabular-nums", T.activeTxt)}>{progress}%</span>
                  </div>
                  <div className={cn("h-1.5 rounded-full overflow-hidden", dark ? "bg-white/[0.06]" : "bg-gray-100")}>
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#0056D2] to-blue-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
                  {chapters.map((c) => {
                    const isActive = activeChId === c.id;
                    const ci = chapters.indexOf(c);
                    return (
                      <button
                        key={c.id}
                        onClick={() => go(c)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl text-left transition-all",
                          isActive ? T.activeBg : T.hover
                        )}
                      >
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black", isActive ? T.badge : cn(T.muted, T.text3))}>
                          {ci + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-[13px] font-bold truncate", isActive ? T.text : "text-gray-700 dark:text-zinc-200")}>{c.title}</p>
                          <p className={cn("text-[10px] mt-0.5 tabular-nums font-medium", T.text3)}>
                            pp. {c.pageStart}–{c.pageEnd}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════ MOBILE NOTES BOTTOM SHEET ═══════ */}
      <AnimatePresence>
        {notesOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-md"
              onClick={() => setNotesOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={cn("lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-[32px] max-h-[85vh] shadow-2xl", T.sidebar)}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className={cn("w-10 h-1 rounded-full", dark ? "bg-zinc-700" : "bg-gray-300")} />
              </div>

              <div className="p-5 overflow-y-auto max-h-[calc(85vh-20px)]">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", T.activeBg)}>
                      <FileText className={cn("h-5 w-5", T.activeTxt)} />
                    </div>
                    <p className={cn("text-sm font-bold", T.text)}>Notes & Highlights</p>
                  </div>
                  <button onClick={() => setNotesOpen(false)} className={cn("h-8 w-8 rounded-xl flex items-center justify-center", T.text3, T.hover)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className={cn("flex p-1 rounded-2xl mb-5", dark ? "bg-white/[0.04]" : "bg-gray-100")}>
                  {(["notes", "highlights"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={cn(
                        "flex-1 h-9 text-[11px] font-bold rounded-xl transition-all capitalize flex items-center justify-center gap-1.5",
                        tab === t ? cn(T.bg, "shadow-sm", T.activeTxt) : T.text3
                      )}
                    >
                      {t === "notes" ? <StickyNote className="h-3.5 w-3.5" /> : <Highlighter className="h-3.5 w-3.5" />}
                      {t} ({t === "notes" ? notes.length : highlights.length})
                    </button>
                  ))}
                </div>

                {tab === "notes" && (
                  <div className="space-y-3">
                    <div className="space-y-2.5">
                      <textarea
                        placeholder="Write a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className={cn("w-full h-24 text-sm p-4 rounded-2xl border resize-none focus:outline-none focus:ring-2 focus:ring-[#0056D2]/30 transition-all", T.input)}
                      />
                      <button
                        onClick={addNote}
                        disabled={!newNote.trim()}
                        className="w-full h-11 rounded-2xl bg-[#0056D2] hover:bg-[#004bb5] text-white text-sm font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-[#0056D2]/20"
                      >
                        <StickyNote className="h-4 w-4" /> Add Note
                      </button>
                    </div>
                    {fNotes.map((note) => (
                      <div key={note.id} className={cn("rounded-2xl border p-4", T.card)}>
                        <p className={cn("text-sm leading-relaxed", T.body)}>{note.text}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={cn("text-[10px] font-bold flex items-center gap-1", T.text3)}>
                            <Clock className="h-2.5 w-2.5" /> {note.createdAt}
                          </span>
                          <div className="flex gap-0.5">
                            <button onClick={() => { setEditId(note.id); setEditTxt(note.text); setNotesOpen(true); }} className={cn("h-6 w-6 rounded-lg flex items-center justify-center", T.text3)}>
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button onClick={() => del(note.id)} className="h-6 w-6 rounded-lg flex items-center justify-center text-red-400">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {fNotes.length === 0 && (
                      <div className="text-center py-12">
                        <StickyNote className={cn("h-10 w-10 mx-auto mb-3", T.text3, "opacity-40")} />
                        <p className={cn("text-sm font-bold", T.text2)}>No notes yet</p>
                      </div>
                    )}
                  </div>
                )}

                {tab === "highlights" && (
                  <div className="space-y-3">
                    {fHighlights.map((h) => (
                      <div key={h.id} className={cn("rounded-2xl border p-4", T.card)}>
                        <div className={cn("text-sm italic mb-3 border-l-[3px] pl-3 leading-relaxed", T.body)} style={{ borderColor: h.color }}>
                          &ldquo;{h.text}&rdquo;
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={cn("text-[10px] font-bold", T.text3)}>Page {h.page}</span>
                          <button onClick={() => delH(h.id)} className="h-6 w-6 rounded-lg flex items-center justify-center text-red-400">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {fHighlights.length === 0 && (
                      <div className="text-center py-12">
                        <Highlighter className={cn("h-10 w-10 mx-auto mb-3", T.text3, "opacity-40")} />
                        <p className={cn("text-sm font-bold", T.text2)}>No highlights yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
