export function PartnerStrip() {
  const partners = [
    { name: "Google Safe Browsing", logo: "🔒" },
    { name: "FTC", logo: "🛡️" },
    { name: "BBC", logo: "📰" },
    { name: "Scamwatch", logo: "👁️" },
  ]

  return (
    <section className="py-12 px-4 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-6">Powered by trusted sources</p>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {partners.map((partner) => (
            <div key={partner.name} className="flex items-center gap-2 text-muted-foreground">
              <span className="text-2xl">{partner.logo}</span>
              <span className="text-sm font-medium">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
