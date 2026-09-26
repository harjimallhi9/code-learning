import { useEffect, useMemo, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Sidebar } from "@/components/app/Sidebar";
import { Workspace } from "@/components/app/Workspace";
import { LandingPage } from "@/components/app/LandingPage";
import type { Chat, Folder, ChatMessage } from "@/types/prompt";

const defaultFolders: Folder[] = [
  { id: "general", name: "General" },
  { id: "learning", name: "Learning" },
  { id: "projects", name: "Projects" },
];

function load<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(key); return value ? (JSON.parse(value) as T) : fallback; } catch { return fallback; }
}

export default function App() {
  const [showLanding, setShowLanding] = useState(() => localStorage.getItem("promptthink.seenLanding") !== "1");
  const [folders, setFolders] = useState<Folder[]>(() => load("promptthink.folders", defaultFolders));
  const [chats, setChats] = useState<Chat[]>(() => load("promptthink.chats", [{ id: "welcome", title: "First conversation", folderId: "general", messages: [], createdAt: Date.now(), updatedAt: Date.now() }]));
  const [activeChatId, setActiveChatId] = useState<string>(() => load<string>("promptthink.activeChat", "welcome"));

  useEffect(() => localStorage.setItem("promptthink.folders", JSON.stringify(folders)), [folders]);
  useEffect(() => localStorage.setItem("promptthink.chats", JSON.stringify(chats)), [chats]);
  useEffect(() => localStorage.setItem("promptthink.activeChat", JSON.stringify(activeChatId)), [activeChatId]);

  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeChatId) ?? chats[0], [activeChatId, chats]);
  const start = () => { localStorage.setItem("promptthink.seenLanding", "1"); setShowLanding(false); };
  const newChat = () => { const now = Date.now(); const chat: Chat = { id: crypto.randomUUID(), title: "New conversation", folderId: folders[0]?.id ?? "general", messages: [], createdAt: now, updatedAt: now }; setChats((current) => [chat, ...current]); setActiveChatId(chat.id); };
  const updateMessages = (messages: ChatMessage[]) => setChats((current) => current.map((chat) => chat.id === activeChat.id ? { ...chat, messages, title: chat.messages.length ? chat.title : messages.find((m) => m.role === "user")?.content.slice(0, 38) || chat.title, updatedAt: Date.now() } : chat));
  const createFolder = () => { const name = window.prompt("Folder name"); if (!name?.trim()) return; setFolders((current) => [...current, { id: crypto.randomUUID(), name: name.trim() }]); };
  const deleteChat = (id: string) => {
    if (chats.length <= 1) return;
    const next = chats.filter((chat) => chat.id !== id);
    setChats(next);
    if (id === activeChatId) setActiveChatId(next[0]?.id ?? "");
  };

  if (showLanding) return <LandingPage onStart={start} />;

  return (
    <main className="flex h-svh overflow-hidden bg-[#050608] text-white">
      <Sidebar chats={chats} folders={folders} activeChatId={activeChatId} onNewChat={newChat} onSelectChat={setActiveChatId} onCreateFolder={createFolder} onDeleteChat={deleteChat} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center border-b border-white/8 px-4 lg:hidden"><div className="flex items-center gap-2"><div className="grid size-7 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Sparkles size={14} /></div><span className="text-sm font-semibold">PromptThink</span></div><button onClick={newChat} className="ml-auto grid size-8 place-items-center rounded-lg bg-white text-black"><Plus size={15} /></button></div>
        <Workspace chat={activeChat} onMessagesChange={updateMessages} />
      </div>
    </main>
  );
}
