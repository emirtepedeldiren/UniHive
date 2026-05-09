import React from "react";

export default function MessagesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <span className="text-6xl">💬</span>
      <h1 className="font-extrabold text-2xl text-app-text dark:text-dark-text mt-4 mb-2">
        Mesajlar
      </h1>
      <p className="text-app-muted">
        Doğrudan mesajlaşma özelliği yakında geliyor.
      </p>
      <p className="text-sm text-app-muted mt-2">
        Şimdilik sorularınızı ve cevaplarınızı kovan üzerinden paylaşabilirsiniz.
      </p>
    </div>
  );
}
