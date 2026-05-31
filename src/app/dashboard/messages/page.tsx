export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Generate and manage outreach messages
        </p>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No messages yet. Generate your first message to get started.</p>
      </div>
    </div>
  );
}
