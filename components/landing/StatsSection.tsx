import { FolderOpen, LayoutGrid, HeartHandshake, RefreshCcw } from "lucide-react";

const stats = [
  { icon: FolderOpen, value: "+250", label: "Fiches pratiques" },
  { icon: LayoutGrid, value: "20", label: "Thématiques clés" },
  { icon: HeartHandshake, value: "100%", label: "Pensé pour les IDEL" },
  { icon: RefreshCcw, value: "24/7", label: "Mises à jour régulières" },
];

export default function StatsSection() {
  return (
    <section className="bg-primary-500">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 text-white sm:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="h-6 w-6 shrink-0 opacity-80" />
            <div>
              <p className="text-xl font-semibold">{value}</p>
              <p className="text-xs text-primary-50">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
