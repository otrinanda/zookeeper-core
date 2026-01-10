"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { animalService } from "@/services/animal.service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns"; // Pastikan install date-fns atau pakai native Date
import { id as idLocale } from "date-fns/locale";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  IconArrowLeft, 
  IconEdit, 
  IconMapPin, 
  IconRuler, 
  IconWeight,
  IconCalendar,
  IconDna,
  IconInfoCircle
} from "@tabler/icons-react";

// Helper Component untuk Baris Data agar Rapi
const DetailRow = ({ label, value, icon: Icon }: { label: string; value?: string | number | null; icon?: any }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-slate-100 last:border-0">
    <div className="flex items-center gap-2 text-slate-500 text-sm">
      {Icon && <Icon size={16} />}
      <span>{label}</span>
    </div>
    <div className="font-medium text-slate-900 text-sm mt-1 sm:mt-0 text-right">
      {value || "-"}
    </div>
  </div>
);

export default function AnimalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Unwrap Params
  const { id } = use(params);
  const router = useRouter();

  // 2. Fetch Data Detail
  const { data, isLoading, isError } = useQuery({
    queryKey: ["animal", "detail", id],
    queryFn: () => animalService.getById(id),
  });

  if (isLoading) return <DetailSkeleton />;
  if (isError || !data) return <ErrorView />;

  // Destructure Data agar mudah dipanggil
  const { Header, Details, Cage } = data;

  // Format Tanggal Helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: idLocale });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* --- TOP BAR --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <IconArrowLeft size={18} />
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Detail Hewan</h2>
            <p className="text-sm text-muted-foreground">ID Sistem: {id}</p>
          </div>
        </div>
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <Link href={`/dashboard/animal/${id}/edit`}>
            <IconEdit className="mr-2 h-4 w-4" /> Edit Data
          </Link>
        </Button>
      </div>

      {/* --- HEADER PROFILE CARD --- */}
      <Card className="overflow-hidden border-t-4 border-t-emerald-600">
        <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
          {/* Foto Hewan */}
          {/* <div className="relative max-h-[10px] rounded-xl overflow-hidden bg-slate-100 shadow-inner flex-shrink-0 border">
            {Details.animal_image_url ? (
              <img 
                alt={Details.animal_image_url} 
                src={`${process.env.NEXT_PUBLIC_API_URL}${Details.animal_image_url}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300">
                <IconInfoCircle size={48} />
              </div>
            )}
          </div> */}
          <div className="w-64 h-64 bg-amber-600">
            <Avatar className="w-auto h-auto rounded-xl size-12">
              {Details.animal_image_url ? (
                <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}${Details.animal_image_url}`} height={100} width={300} />
              ) : (
                <AvatarFallback>
                  <IconInfoCircle size={48} />
                </AvatarFallback>
              )}
            </Avatar>
          </div>


          {/* Info Utama */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-slate-900">{Details.animal_name}</h1>
                    <Badge variant={Details.animal_status_name === 'Alive' ? 'default' : 'destructive'}>
                        {Details.animal_status_name || 'Status Unknown'}
                    </Badge>
                </div>
                
                <div className="mt-2 space-y-1 text-slate-600">
                    <p className="font-semibold text-emerald-700">{Header.species_name} ({Header.family_name})</p>
                    <p className="text-sm italic">{Header.latin_name}</p>
                    <p className="text-sm">{Header.local_name} / {Header.english_name}</p>
                </div>
              </div>

              {/* Quick Stats Box */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border text-sm">
                <div>
                    <p className="text-slate-500 text-xs">Gender</p>
                    <p className="font-semibold">{Details.animal_genders_name}</p>
                </div>
                <div>
                    <p className="text-slate-500 text-xs">Kelompok Umur</p>
                    <p className="font-semibold">{Details.animal_age_group_name}</p>
                </div>
                <div>
                    <p className="text-slate-500 text-xs">Entitas</p>
                    <p className="font-semibold">{Details.animal_entity} ({Details.komunal_quantity})</p>
                </div>
                <div>
                    <p className="text-slate-500 text-xs">Klasifikasi</p>
                    <p className="font-semibold">{Details.animal_classification}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* --- TABS DETAIL INFO --- */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="flex gap-2">
          <TabsTrigger value="general">Umum & Fisik</TabsTrigger>
          <TabsTrigger value="habitat">Asal & Kandang</TabsTrigger>
          <TabsTrigger value="lineage">Silsilah</TabsTrigger>
          <TabsTrigger value="docs">Dokumen</TabsTrigger>
        </TabsList>

        {/* TAB 1: UMUM & FISIK */}
        <TabsContent value="general" className="mt-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
                <CardHeader><CardTitle className="text-base">Identifikasi</CardTitle></CardHeader>
                <CardContent className="space-y-0">
                    <DetailRow label="Kode Identifikasi" value={Details.identifier_code} icon={IconDna} />
                    <DetailRow label="Kode Marker" value={Details.marker_code} icon={IconDna} />
                    <DetailRow label="Tipe Hewan" value={Details.animal_type_name} />
                    <DetailRow label="Status IUCN" value={Header.iucn_name} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="text-base">Fisik & Tanggal</CardTitle></CardHeader>
                <CardContent className="space-y-0">
                    <DetailRow label="Berat" value={`${Details.weight_length || 0} ${Details.weight_unit_name || ''}`} icon={IconWeight} />
                    <DetailRow label="Panjang" value={`${Details.body_length || 0} ${Details.unit_name || ''}`} icon={IconRuler} />
                    <DetailRow label="Tgl Lahir/Menetas" value={formatDate(Details.hatching_date)} icon={IconCalendar} />
                    <DetailRow label="Tgl Kedatangan" value={formatDate(Details.arrival_date)} icon={IconCalendar} />
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: HABITAT & KANDANG */}
        <TabsContent value="habitat" className="mt-4">
           <Card>
                <CardHeader><CardTitle className="text-base">Lokasi & Asal</CardTitle></CardHeader>
                <CardContent className="space-y-0">
                    <DetailRow label="Area Asal" value={Details.animal_area} icon={IconMapPin} />
                    <Separator className="my-4" />
                    <div className="bg-emerald-50 p-4 rounded-md border border-emerald-100">
                        <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                            <IconMapPin size={18} /> Posisi Kandang Saat Ini
                        </h4>
                        {Cage ? (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500 block">Kode Kandang</span>
                                    <span className="font-medium text-lg">{Cage.code_number}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Container</span>
                                    <span className="font-medium">{Cage.container || "-"}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">Belum ditempatkan di kandang.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* TAB 3: SILSILAH */}
        <TabsContent value="lineage" className="mt-4">
            <Card>
                <CardHeader><CardTitle className="text-base">Informasi Indukan</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 border rounded-lg bg-blue-50/50 border-blue-100">
                            <h4 className="font-bold text-blue-700 mb-2">Ayah (Father)</h4>
                            <DetailRow label="Nama" value={Details.father_name} />
                            <DetailRow label="ID" value={Details.father_id} />
                        </div>
                        <div className="p-4 border rounded-lg bg-pink-50/50 border-pink-100">
                            <h4 className="font-bold text-pink-700 mb-2">Ibu (Mother)</h4>
                            <DetailRow label="Nama" value={Details.mother_name} />
                            <DetailRow label="ID" value={Details.mother_id} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* TAB 4: DOKUMEN */}
        <TabsContent value="docs" className="mt-4">
             <Card>
                <CardHeader><CardTitle className="text-base">Lampiran & Catatan</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-2">Catatan Tambahan</h4>
                        <div className="p-3 bg-slate-50 rounded border text-sm text-slate-700 min-h-[60px]">
                            {Details.noted || "Tidak ada catatan."}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-2">File Dokumen</h4>
                        {Details.document_url ? (
                             <Button variant="outline" asChild>
                                <a href={Details.document_url} target="_blank" rel="noreferrer">
                                    Lihat Dokumen
                                </a>
                             </Button>
                        ) : (
                            <p className="text-sm text-slate-400 italic">Tidak ada dokumen dilampirkan.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- SUB COMPONENTS ---

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
         <Skeleton className="h-10 w-32" />
         <Skeleton className="h-10 w-24" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function ErrorView() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
      <div className="bg-red-50 p-4 rounded-full">
        <IconInfoCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-bold">Data tidak ditemukan</h3>
      <p className="text-muted-foreground">Mungkin hewan ini sudah dihapus atau ID salah.</p>
      <Button asChild variant="outline">
        <Link href="/dashboard/animal">Kembali ke List</Link>
      </Button>
    </div>
  );
}