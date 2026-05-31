export default function ProspectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prospects</h1>
        <p className="text-muted-foreground">
          Manage your outreach targets
        </p>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No prospects yet. Add your first prospect to get started.</p>
      </div>
    </div>
  );
}
