"use client";
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface UserResult {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  university: string;
}

interface Participant {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  badge: string;
}

interface LastMessage {
  body: string;
  createdAt: string;
  senderId: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  updatedAt: string;
  other: Participant;
  lastMessage: LastMessage | null;
  unreadCount: number;
}

interface Message {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
  sender: { id: string; name: string | null; email: string; avatarUrl: string | null };
}

interface ConversationDetail {
  id: string;
  participants: Participant[];
  messages: Message[];
}

function Avatar({ user, size = 8 }: { user: { name?: string | null; email?: string; avatarUrl?: string | null }; size?: number }) {
  const px = size * 4;
  return (
    <div
      className="rounded-full bg-honey flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{ width: px, height: px }}
    >
      {user.avatarUrl ? (
        <Image src={user.avatarUrl} alt={user.name ?? "avatar"} width={px} height={px} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-hive-black text-sm">
          {(user.name || user.email || "?").charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function timeShort(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins}d`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}s`;
  return `${Math.floor(hours / 24)}g`;
}

function UserSearch({ onSelect }: { onSelect: (user: UserResult) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json() as UserResult[];
        setResults(data);
        setOpen(true);
      }
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (results.length) setOpen(true); }}
        placeholder="İsim veya e-posta ile ara..."
        className="input-field text-sm w-full"
        autoFocus
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="animate-spin w-4 h-4 text-app-muted" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-dark-card border border-app-border dark:border-dark-border rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((u) => (
            <button
              key={u.id}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onSelect(u); setQuery(""); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-app-hover dark:hover:bg-dark-hover transition-colors text-left"
            >
              <Avatar user={u} size={8} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-app-text dark:text-dark-text truncate">
                  {u.name || u.email.split("@")[0]}
                </p>
                <p className="text-xs text-app-muted dark:text-dark-muted truncate">{u.university}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {open && !loading && results.length === 0 && query.trim() && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-dark-card border border-app-border dark:border-dark-border rounded-xl shadow-lg z-50 px-4 py-3 text-sm text-app-muted dark:text-dark-muted">
          Kullanıcı bulunamadı.
        </div>
      )}
    </div>
  );
}

function MessagesContent() {
  const { data: session } = useSession();
  const currentUser = session?.user as { id?: string; name?: string; email?: string } | undefined;
  const searchParams = useSearchParams();
  const withUserId = searchParams.get("with");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [startMode, setStartMode] = useState(!withUserId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadConversations = useCallback(async () => {
    const res = await fetch("/api/messages");
    if (res.ok) setConversations(await res.json() as Conversation[]);
  }, []);

  const loadDetail = useCallback(async (convId: string) => {
    const res = await fetch(`/api/messages/${convId}`);
    if (res.ok) setDetail(await res.json() as ConversationDetail);
  }, []);

  useEffect(() => {
    if (!session) return;
    loadConversations();
  }, [session, loadConversations]);

  // Deep-link: ?with=<userId>
  useEffect(() => {
    if (!withUserId || !session) return;
    fetch(`/api/users/search?q=${encodeURIComponent(withUserId)}`)
      .then((r) => r.json())
      .catch(() => []);
    setStartMode(false);
    fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipientId: withUserId, body: " " }) })
      .then(() => loadConversations())
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withUserId, session]);

  useEffect(() => {
    if (!activeConvId) return;
    loadDetail(activeConvId);
    const timer = setInterval(() => loadDetail(activeConvId), 5000);
    return () => clearInterval(timer);
  }, [activeConvId, loadDetail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [detail?.messages]);

  function openStartMode() {
    setStartMode(true);
    setActiveConvId(null);
    setDetail(null);
    setSelectedUser(null);
    setInput("");
  }

  function handleUserSelect(user: UserResult) {
    setSelectedUser(user);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    if (startMode) {
      if (!selectedUser) return;
      setSending(true);
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: selectedUser.id, body: input.trim() }),
      });
      setSending(false);
      if (res.ok) {
        const data = await res.json() as { conversationId: string };
        setInput("");
        setStartMode(false);
        setSelectedUser(null);
        await loadConversations();
        setActiveConvId(data.conversationId);
      }
    } else {
      if (!activeConvId) return;
      setSending(true);
      await fetch(`/api/messages/${activeConvId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: input.trim() }),
      });
      setInput("");
      setSending(false);
      await loadDetail(activeConvId);
      await loadConversations();
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64 text-app-muted dark:text-dark-muted text-sm">
        Mesajları görmek için giriş yapmalısınız.
      </div>
    );
  }

  const activeOther = detail?.participants.find((p) => p.id !== currentUser?.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex h-[calc(100vh-8rem)] border border-app-border dark:border-dark-border rounded-xl overflow-hidden bg-white dark:bg-dark-card">

        {/* Conversation list */}
        <div className="w-72 flex-shrink-0 border-r border-app-border dark:border-dark-border flex flex-col">
          <div className="p-4 border-b border-app-border dark:border-dark-border flex items-center justify-between">
            <h2 className="font-bold text-app-text dark:text-dark-text">Mesajlar</h2>
            <button
              onClick={openStartMode}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-app-hover dark:hover:bg-dark-hover transition-colors text-app-muted"
              title="Yeni mesaj"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-sm text-app-muted dark:text-dark-muted p-4 text-center">Henüz konuşma yok.</p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setActiveConvId(c.id); setStartMode(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-app-hover dark:hover:bg-dark-hover transition-colors border-b border-app-border dark:border-dark-border last:border-0 ${activeConvId === c.id ? "bg-honey/10" : ""}`}
                >
                  <Avatar user={c.other} size={9} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-app-text dark:text-dark-text truncate">
                        {c.other?.name || c.other?.email?.split("@")[0]}
                      </span>
                      <span className="text-[10px] text-app-muted ml-1 flex-shrink-0">
                        {c.lastMessage ? timeShort(c.lastMessage.createdAt) : ""}
                      </span>
                    </div>
                    <p className="text-xs text-app-muted dark:text-dark-muted truncate mt-0.5">
                      {c.lastMessage?.body ?? "Konuşma başlat"}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="ml-1 min-w-[18px] h-[18px] bg-sting text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message area */}
        <div className="flex-1 flex flex-col min-w-0">
          {startMode ? (
            <form onSubmit={handleSend} className="flex flex-col h-full">
              <div className="p-4 border-b border-app-border dark:border-dark-border space-y-3">
                <p className="text-sm font-semibold text-app-text dark:text-dark-text">Yeni Mesaj</p>
                {selectedUser ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-honey/10 border border-honey/40 rounded-lg">
                    <Avatar user={selectedUser} size={7} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-app-text dark:text-dark-text truncate">
                        {selectedUser.name || selectedUser.email.split("@")[0]}
                      </p>
                      <p className="text-xs text-app-muted dark:text-dark-muted truncate">{selectedUser.university}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      className="text-app-muted hover:text-sting transition-colors flex-shrink-0"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <UserSearch onSelect={handleUserSelect} />
                )}
              </div>
              <div className="flex-1" />
              <div className="p-4 border-t border-app-border dark:border-dark-border flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={selectedUser ? "Mesaj yaz..." : "Önce kullanıcı seçin..."}
                  disabled={!selectedUser}
                  className="flex-1 input-field text-sm disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim() || !selectedUser}
                  className="btn-primary disabled:opacity-50"
                >
                  Gönder
                </button>
              </div>
            </form>
          ) : activeConvId && detail ? (
            <>
              <div className="p-4 border-b border-app-border dark:border-dark-border flex items-center gap-3">
                {activeOther && <Avatar user={activeOther} size={8} />}
                <div>
                  <span className="font-semibold text-app-text dark:text-dark-text">
                    {activeOther?.name || activeOther?.email?.split("@")[0]}
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {detail.messages.map((m) => {
                  const isMe = m.senderId === currentUser?.id;
                  return (
                    <div key={m.id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                      {!isMe && <Avatar user={m.sender} size={7} />}
                      <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-honey text-hive-black rounded-br-sm" : "bg-app-bg dark:bg-dark-bg text-app-text dark:text-dark-text border border-app-border dark:border-dark-border rounded-bl-sm"}`}>
                        {m.body}
                        <span className={`block text-[10px] mt-0.5 ${isMe ? "text-hive-black/60 text-right" : "text-app-muted"}`}>
                          {timeShort(m.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSend} className="p-4 border-t border-app-border dark:border-dark-border flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                  placeholder="Mesaj yaz..."
                  className="flex-1 input-field text-sm"
                />
                <button type="submit" disabled={sending || !input.trim()} className="btn-primary disabled:opacity-50">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-app-muted dark:text-dark-muted text-sm gap-2">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Bir konuşma seç veya yeni mesaj başlat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesContent />
    </Suspense>
  );
}
