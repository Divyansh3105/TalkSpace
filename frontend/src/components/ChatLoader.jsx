function ChatLoader() {
  return (
    <div className="h-full min-h-[60vh] flex flex-col items-center justify-center gap-3 p-4">
      <span className="loading loading-dots loading-md text-primary" />
      <p className="text-sm text-base-content/60">Connecting to chat…</p>
    </div>
  );
}

export default ChatLoader;
