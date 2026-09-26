import { Folder, FolderPlus, MessageSquarePlus, Search, Settings2, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Chat, Folder as FolderType } from "@/types/prompt";

interface Props {
  chats: Chat[];
  folders: FolderType[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onCreateFolder: () => void;
  onDeleteChat: (id: string) => void;
}

export function Sidebar({ chats, folders, activeChatId, onNewChat, onSelectChat, onCreateFolder, onDeleteChat }: Props) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/8 bg-[#08090c]/90 p-4 lg:flex lg:flex-col">
      <div className="mb-5 flex items-center gap-3 px-2">
        <div className="grid size-9 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Sparkles size={17} /></div>
        <div><div className="font-semibold tracking-tight">PromptThink</div><div className="text-[11px] text-zinc-600">think • improve • learn</div></div>
      </div>
      <Button variant="accent" className="mb-3 w-full justify-start" onClick={onNewChat}><MessageSquarePlus size={16} /> New chat</Button>
      <div className="mb-5 flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.025] px-3 py-2 text-xs text-zinc-500"><Search size={14} /> Search chats</div>

      <div className="mb-3 flex items-center justify-between px-2"><span className="text-[10px] uppercase tracking-[.2em] text-zinc-600">Folders</span><button onClick={onCreateFolder} className="text-zinc-600 transition hover:text-zinc-300" aria-label="Create folder"><FolderPlus size={14} /></button></div>
      <div className="space-y-1">
        {folders.map((folder) => {
          const folderChats = chats.filter((chat) => chat.folderId === folder.id);
          return (
            <div key={folder.id}>
              <div className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-zinc-400"><Folder size={14} className="text-zinc-600" /> {folder.name}<span className="ml-auto text-[10px] text-zinc-700">{folderChats.length}</span></div>
              {folderChats.map((chat) => (
                <div key={chat.id} className={`group ml-4 flex items-center gap-2 rounded-lg px-2 py-2 text-xs transition ${activeChatId === chat.id ? "bg-white/[0.06] text-white" : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300"}`}>
                  <button className="min-w-0 flex-1 truncate text-left" onClick={() => onSelectChat(chat.id)}>{chat.title}</button>
                  <button onClick={() => onDeleteChat(chat.id)} className="hidden text-zinc-700 hover:text-red-300 group-hover:block" aria-label={`Delete ${chat.title}`}><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="mt-auto border-t border-white/8 pt-3"><button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"><Settings2 size={15} /> Settings</button></div>
    </aside>
  );
}
