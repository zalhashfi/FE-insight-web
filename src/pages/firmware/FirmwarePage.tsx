import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api';

type Firmware = {
  id: string;
  projectName: string;
  version: string;
  binFileUrl: string;
  releaseNotes: string;
  isLatest: boolean;
  createdAt: string;
};

type Station = {
  projectName: string;
};

async function fetchFirmwares(): Promise<Firmware[]> {
  const res = await apiFetch('/api/firmware');
  if (!res.ok) throw new Error('Failed to fetch firmware');
  const data = await res.json();
  return data.firmwares || [];
}

async function fetchStations(): Promise<Station[]> {
  const res = await apiFetch('/api/stations');
  if (!res.ok) throw new Error('Failed to fetch stations');
  const data = await res.json();
  return data.stations || [];
}

async function createFirmware(data: { projectName: string; version: string; binFileUrl: string; releaseNotes: string; isLatest: boolean }) {
  const res = await apiFetch('/api/firmware', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create firmware');
  return res.json();
}

async function updateFirmware(data: { id: string; payload: Partial<Firmware> }) {
  const res = await apiFetch(`/api/firmware/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data.payload),
  });
  if (!res.ok) throw new Error('Failed to update firmware');
  return res.json();
}

async function deleteFirmware(id: string) {
  const res = await apiFetch(`/api/firmware/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete firmware');
  return res.json();
}

export function FirmwarePage() {
  const queryClient = useQueryClient();

  const [projectName, setProjectName] = useState('');
  const [version, setVersion] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Edit State
  const [editFw, setEditFw] = useState<Firmware | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editVersion, setEditVersion] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editConfirm, setEditConfirm] = useState('');

  // Delete State
  const [deleteFw, setDeleteFw] = useState<Firmware | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const { data: firmwares, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['firmware'],
    queryFn: fetchFirmwares,
  });

  const { data: stations } = useQuery({
    queryKey: ['stations'],
    queryFn: fetchStations,
  });

  const uniqueProjects = useMemo(() => {
    if (!stations) return [];
    const projects = new Set(stations.map(s => s.projectName));
    return Array.from(projects);
  }, [stations]);

  const createMutation = useMutation({
    mutationFn: createFirmware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firmware'] });
      setProjectName('');
      setVersion('');
      setUrl('');
      setNotes('');
      setErrorMsg('');
    },
    onError: (err: any) => setErrorMsg(err.message)
  });

  const updateMutation = useMutation({
    mutationFn: updateFirmware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firmware'] });
      setEditFw(null);
    },
    onError: (err: any) => setErrorMsg(err.message)
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFirmware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firmware'] });
      setDeleteFw(null);
    },
    onError: (err: any) => setErrorMsg(err.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ projectName, version, binFileUrl: url, releaseNotes: notes, isLatest: true });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editConfirm !== 'confirm') return;
    if (editFw) {
      updateMutation.mutate({
        id: editFw.id,
        payload: { projectName: editProjectName, version: editVersion, binFileUrl: editUrl, releaseNotes: editNotes }
      });
    }
  };

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirm !== 'confirm') return;
    if (deleteFw) {
      deleteMutation.mutate(deleteFw.id);
    }
  };

  const openEdit = (fw: Firmware) => {
    setEditFw(fw);
    setEditProjectName(fw.projectName);
    setEditVersion(fw.version);
    setEditUrl(fw.binFileUrl);
    setEditNotes(fw.releaseNotes);
    setEditConfirm('');
    setErrorMsg('');
  };

  const openDelete = (fw: Firmware) => {
    setDeleteFw(fw);
    setDeleteConfirm('');
    setErrorMsg('');
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Firmware Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="projectName">Proyek</Label>
                <Select value={projectName} onValueChange={(v) => setProjectName(v || '')} required>
                  <SelectTrigger id="projectName"><SelectValue placeholder="Pilih Proyek" /></SelectTrigger>
                  <SelectContent>
                    {uniqueProjects.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="version">Versi</Label>
                <Input id="version" value={version} onChange={e => setVersion(e.target.value)} placeholder="Contoh: 2.1.0" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">Link Firmware (Bin File URL)</Label>
              <Input id="url" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Catatan Rilis</Label>
              <Input id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Perbaikan sensor..." />
            </div>
            {errorMsg && <p className="text-sm font-medium text-destructive">{errorMsg}</p>}
            <Button type="submit" className="w-fit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Menyimpan...' : 'Tambah Firmware'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manajemen Firmware</CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyek</TableHead>
                <TableHead>Versi</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="p-4">
                    <TableSkeleton rows={5} cols={6} />
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-destructive">
                    Gagal memuat data firmware.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && firmwares?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Belum ada firmware yang diunggah.
                  </TableCell>
                </TableRow>
              )}
              {firmwares?.map((fw) => (
                <TableRow key={fw.id}>
                  <TableCell>{fw.projectName}</TableCell>
                  <TableCell className="font-medium">{fw.version}</TableCell>
                  <TableCell>
                    <a href={fw.binFileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      Link
                    </a>
                  </TableCell>
                  <TableCell>{fw.releaseNotes}</TableCell>
                  <TableCell>{new Date(fw.createdAt).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(fw)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDelete(fw)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Firmware Dialog */}
      <Dialog open={!!editFw} onOpenChange={(open) => !open && setEditFw(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Firmware</DialogTitle>
            <DialogDescription>
              Ubah data firmware.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="editProjectName">Proyek</Label>
                <Select onValueChange={(v) => setEditProjectName(v || '')} value={editProjectName}>
                <SelectTrigger id="editProjectName"><SelectValue placeholder="Pilih Proyek" /></SelectTrigger>
                <SelectContent>
                  {uniqueProjects.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editVersion">Versi</Label>
              <Input id="editVersion" value={editVersion} onChange={(e) => setEditVersion(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUrl">Link Firmware</Label>
              <Input id="editUrl" type="url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNotes">Catatan Rilis</Label>
              <Input id="editNotes" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
            </div>
            <div className="space-y-2 pt-2 border-t">
              <Label htmlFor="editConfirm" className="text-destructive">Ketik "confirm" untuk menyimpan</Label>
              <Input 
                id="editConfirm" 
                value={editConfirm} 
                onChange={(e) => setEditConfirm(e.target.value)} 
                placeholder="confirm"
                required
              />
            </div>
            {errorMsg && <p className="text-sm font-medium text-destructive">{errorMsg}</p>}
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditFw(null)}>Batal</Button>
              <Button type="submit" disabled={updateMutation.isPending || editConfirm !== 'confirm'}>
                {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteFw} onOpenChange={(open) => !open && setDeleteFw(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Firmware</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus firmware ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDeleteSubmit} className="space-y-4 mt-4">
            <div className="space-y-2 pt-2">
              <Label htmlFor="deleteConfirm" className="text-destructive">Ketik "confirm" untuk menghapus</Label>
              <Input 
                id="deleteConfirm" 
                value={deleteConfirm} 
                onChange={(e) => setDeleteConfirm(e.target.value)} 
                placeholder="confirm"
                required
              />
            </div>
            {errorMsg && <p className="text-sm font-medium text-destructive">{errorMsg}</p>}
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDeleteFw(null)}>Batal</Button>
              <Button variant="destructive" type="submit" disabled={deleteMutation.isPending || deleteConfirm !== 'confirm'}>
                {deleteMutation.isPending ? 'Menghapus...' : 'Hapus Firmware'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
