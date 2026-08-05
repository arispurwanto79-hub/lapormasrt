import { useEffect, useState } from 'react';
import {
  User, Phone, MapPin, FileText, Tag, Upload, Send, CheckCircle2,
  Loader2, ArrowRight, AlertCircle, MapPin as LocationIcon, Flag,
} from 'lucide-react';
import { supabase, type Category, type ReportPriority } from '@/lib/supabase';
import { PriorityBadge } from '@/components/Status';

interface BuatProps {
  onNavigate: (page: string) => void;
}

interface FormState {
  name: string;
  phone: string;
  address: string;
  rt: string;
  categoryId: string;
  title: string;
  description: string;
  location: string;
  priority: ReportPriority;
  photo: File | null;
}

const emptyForm: FormState = {
  name: '', phone: '', address: '', rt: '22', categoryId: '', title: '',
  description: '', location: '', priority: 'sedang', photo: null,
};

export default function Buat({ onNavigate }: BuatProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ ticket: string } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setCategories(data as Category[]);
    })();
  }, []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    update('photo', file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const valid = form.name && form.phone && form.address && form.categoryId && form.title && form.description;

  const submit = async () => {
    if (!valid) {
      setError('Mohon lengkapi semua data wajib.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Generate ticket number client-side (matching DB format)
      const year = new Date().getFullYear();
      const { count } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .like('ticket_number', `LPR-${year}-%`);
      const seq = (count ?? 0) + 1;
      const ticketNumber = `LPR-${year}-${String(seq).padStart(4, '0')}`;

      let photoUrl: string | null = null;
      if (form.photo) {
        const ext = form.photo.name.split('.').pop();
        const path = `${ticketNumber}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('laporan-photos')
          .upload(path, form.photo);
        if (!upErr) {
          const { data: pub } = supabase.storage.from('laporan-photos').getPublicUrl(path);
          photoUrl = pub.publicUrl;
        }
      }

      const { error: insErr } = await supabase.from('reports').insert({
        ticket_number: ticketNumber,
        name: form.name,
        phone: form.phone,
        address: form.address,
        rt: form.rt,
        category_id: form.categoryId,
        title: form.title,
        description: form.description,
        location: form.location || null,
        priority: form.priority,
        status: 'menunggu',
        photo_url: photoUrl,
      });

      if (insErr) throw insErr;
      setSuccess({ ticket: ticketNumber });
      setForm(emptyForm);
      setPhotoPreview(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal mengirim laporan. Coba lagi.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 min-h-screen flex items-center">
        <div className="max-w-lg mx-auto w-full">
          <div className="glass-card rounded-30 p-8 sm:p-10 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">Laporan Terkirim!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Pengaduan Anda berhasil dikirim. Simpan nomor tiket berikut untuk melacak status.
            </p>

            <div className="rounded-20 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-white/5 dark:to-white/5 border border-primary-200 dark:border-white/10 p-6 mb-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Nomor Tiket Anda</p>
              <p className="font-mono text-2xl font-extrabold text-primary-700 dark:text-primary-300 tracking-wider">
                {success.ticket}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => onNavigate('cek')} className="btn-primary group">
                Lacak Tiket
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => { setSuccess(null); }}
                className="btn-secondary"
              >
                Buat Laporan Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <span className="badge bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 mb-4">
            <FileText className="w-3.5 h-3.5" />
            Form Pengaduan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-text mb-3">
            Buat Pengaduan
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Lengkapi data berikut. Nomor tiket akan dibuat otomatis dengan format <span className="font-mono font-bold text-primary-600">LPR-2026-0001</span>.
          </p>
        </div>

        {/* Form */}
        <div className="glass-card rounded-30 p-6 sm:p-8 animate-fade-up animate-delay-100">
          {error && (
            <div className="mb-6 p-4 rounded-20 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nama */}
            <Field icon={User} label="Nama Lengkap" required>
              <input className="input-field" placeholder="Nama Anda" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </Field>

            {/* Nomor HP */}
            <Field icon={Phone} label="Nomor HP" required>
              <input className="input-field" placeholder="08xxxxxxxxxx" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </Field>

            {/* Alamat */}
            <Field icon={MapPin} label="Alamat" required full>
              <input className="input-field" placeholder="Alamat lengkap Anda" value={form.address} onChange={(e) => update('address', e.target.value)} />
            </Field>

            {/* RT */}
            <Field icon={MapPin} label="RT">
              <input className="input-field" placeholder="22" value={form.rt} onChange={(e) => update('rt', e.target.value)} />
            </Field>

            {/* Kategori */}
            <Field icon={Tag} label="Kategori" required>
              <select className="input-field" value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
                <option value="">Pilih kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>

            {/* Judul */}
            <Field icon={FileText} label="Judul Pengaduan" required full>
              <input className="input-field" placeholder="Ringkasan singkat pengaduan" value={form.title} onChange={(e) => update('title', e.target.value)} />
            </Field>

            {/* Deskripsi */}
            <Field icon={FileText} label="Deskripsi" required full>
              <textarea className="input-field min-h-[120px] resize-y" placeholder="Jelaskan pengaduan Anda secara detail" value={form.description} onChange={(e) => update('description', e.target.value)} />
            </Field>

            {/* Lokasi */}
            <Field icon={LocationIcon} label="Lokasi Kejadian" full>
              <input className="input-field" placeholder="Contoh: Depan rumah No. 12, Dusun Gabusan" value={form.location} onChange={(e) => update('location', e.target.value)} />
            </Field>

            {/* Prioritas */}
            <Field icon={Flag} label="Prioritas" full>
              <div className="flex flex-wrap gap-2">
                {(['rendah', 'sedang', 'tinggi', 'urgent'] as ReportPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => update('priority', p)}
                    className={`px-4 py-2 rounded-20 text-sm font-semibold transition-all ${
                      form.priority === p
                        ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-surface-dark'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <PriorityBadge priority={p} />
                  </button>
                ))}
              </div>
            </Field>

            {/* Upload Foto */}
            <Field icon={Upload} label="Upload Foto (opsional)" full>
              <label className="block cursor-pointer">
                <div className={`rounded-20 border-2 border-dashed p-6 text-center transition-all ${
                  photoPreview
                    ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-500/5'
                    : 'border-slate-300 dark:border-white/10 hover:border-primary-400 dark:hover:border-primary-500/40'
                }`}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="max-h-48 mx-auto rounded-20" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Klik untuk upload foto (max 5MB)
                      </p>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </label>
            </Field>
          </div>

          {/* Submit */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={submit}
              disabled={loading || !valid}
              className="btn-primary w-full sm:w-auto group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
              ) : (
                <>Kirim Pengaduan <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              Dengan mengirim, Anda menyetujui data digunakan untuk tindak lanjut pengaduan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, required, full, children,
}: {
  icon: typeof User; label: string; required?: boolean; full?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        <Icon className="w-4 h-4 text-primary-500" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
