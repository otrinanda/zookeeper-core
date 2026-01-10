export default function DashboardPage() {
  return (
    <div className="space-y-4 bg-amber-600">
      <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Contoh Card Statistik Sederhana */}
        <div className="p-6 bg-red rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-slate-500">Total Hewan</h3>
          <p className="text-2xl font-bold mt-2">124</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-slate-500">Kandang Terisi</h3>
          <p className="text-2xl font-bold mt-2">45/50</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-slate-500">Staf Aktif</h3>
          <p className="text-2xl font-bold mt-2">12</p>
        </div>
      </div>
    </div>
  );
}