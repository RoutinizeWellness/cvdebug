export function StatsSection() {
  const stats = [
    { value: "75%", label: "Resumes rejected by ATS" },
    { value: "No BS", label: "Transparent Pricing" },
    { value: "10s", label: "Average analysis time" },
    { value: "Secure", label: "Data deleted in 30 days" },
  ];

  return (
    <section className="py-12 md:py-16 border-y border-border/50 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-border/50">
          {stats.map((stat, i) => (
            <div key={i} className="px-2 md:px-4">
              <p className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}