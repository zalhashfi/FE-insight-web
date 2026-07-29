import { useState } from 'react';
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
import { AddStationDialog } from './AddStationDialog';
import { logToCloudflare } from '@/utils/logger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TableSkeleton } from '@/components/ui/skeleton';

type Station = {
  uuid: string;
  name: string;
  projectName: string;
  type: string;
  macAddress: string | null;
  currentVersion: string | null;
  latitude: number | null;
  longitude: number | null;
};

async function fetchStations(): Promise<Station[]> {
  const res = await fetch('/api/stations', { credentials: 'include' });
  if (!res.ok) {
    logToCloudflare('error', 'Failed to fetch stations', { status: res.status });
    throw new Error('Failed to fetch stations');
  }
  const data = await res.json();
  return data.stations;
}

async function updateStation(data: { uuid: string, payload: Partial<Station> }) {
  const res = await fetch(`/api/stations/${data.uuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data.payload),
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update station');
  }
  return res.json();
}

async function deleteStation(uuid: string) {
  const res = await fetch(`/api/stations/${uuid}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete station');
  }
  return res.json();
}

export function StationList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const canEdit = user?.role === 'admin' || user?.role === 'engineer';

  const [editStation, setEditStation] = useState<Station | null>(null);
  const [deleteStationObj, setDeleteStationObj] = useState<Station | null>(null);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editProjectName, setEditProjectName] = useState('');
  const [editType, setEditType] = useState('');
  const [editMacAddress, setEditMacAddress] = useState('');
  const [editLat, setEditLat] = useState('');
  const [editLng, setEditLng] = useState('');
  const [editConfirm, setEditConfirm] = useState('');

  // Delete form state
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: stations, isLoading, isError } = useQuery({
    queryKey: ['stations'],
    queryFn: fetchStations,
  });

  const updateMutation = useMutation({
    mutationFn: updateStation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      setEditStation(null);
    },
    onError: (err: any) => {
      setErrorMsg(err.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      setDeleteStationObj(null);
    },
    onError: (err: any) => {
      setErrorMsg(err.message);
    }
  });

  const openEdit = (station: Station) => {
    setEditStation(station);
    setEditName(station.name);
    setEditProjectName(station.projectName);
    setEditType(station.type);
    setEditMacAddress(station.macAddress || '');
    setEditLat(station.latitude?.toString() || '');
    setEditLng(station.longitude?.toString() || '');
    setEditConfirm('');
    setErrorMsg('');
  };

  const openDelete = (station: Station) => {
    setDeleteStationObj(station);
    setDeleteConfirm('');
    setErrorMsg('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editConfirm !== 'confirm') return;
    if (editStation) {
      updateMutation.mutate({
        uuid: editStation.uuid,
        payload: {
          name: editName,
          projectName: editProjectName,
          type: editType,
          macAddress: editMacAddress || null,
          latitude: editLat ? parseFloat(editLat) : null,
          longitude: editLng ? parseFloat(editLng) : null,
        }
      });
    }
  };

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirm !== 'confirm') return;
    if (deleteStationObj) {
      deleteMutation.mutate(deleteStationObj.uuid);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Daftar Alat (Stations)</CardTitle>
        {canEdit && <AddStationDialog />}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Alat</TableHead>
              <TableHead>Proyek</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>MAC Address</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Versi Firmware</TableHead>
              {canEdit && <TableHead>Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={canEdit ? 7 : 6} className="p-4">
                  <TableSkeleton rows={5} cols={canEdit ? 7 : 6} />
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={canEdit ? 7 : 6} className="text-center py-8 text-destructive">
                  Gagal memuat data alat.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && stations?.length === 0 && (
              <TableRow>
                <TableCell colSpan={canEdit ? 7 : 6} className="text-center py-8 text-muted-foreground">
                  Belum ada alat yang terdaftar.
                </TableCell>
              </TableRow>
            )}
            {stations?.map((station) => (
              <TableRow key={station.uuid}>
                <TableCell className="font-medium">{station.name}</TableCell>
                <TableCell>{station.projectName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="uppercase">{station.type}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{station.macAddress || '-'}</TableCell>
                <TableCell>
                  {station.latitude && station.longitude 
                    ? `${station.latitude}, ${station.longitude}` 
                    : '-'}
                </TableCell>
                <TableCell>{station.currentVersion || '-'}</TableCell>
                {canEdit && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(station)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDelete(station)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Station Dialog */}
      <Dialog open={!!editStation} onOpenChange={(open) => !open && setEditStation(null)}>
        <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Alat</DialogTitle>
            <DialogDescription>
              Ubah data informasi alat.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Nama Alat</Label>
              <Input id="editName" value={editName} onChange={(e) => setEditName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProjectName">Nama Proyek</Label>
              <Input id="editProjectName" value={editProjectName} onChange={(e) => setEditProjectName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editType">Tipe (mis. AQMS, AWS)</Label>
              <Input id="editType" value={editType} onChange={(e) => setEditType(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editMacAddress">MAC Address (opsional)</Label>
              <Input id="editMacAddress" value={editMacAddress} onChange={(e) => setEditMacAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editLat">Latitude (opsional)</Label>
                <Input id="editLat" type="number" step="any" value={editLat} onChange={(e) => setEditLat(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLng">Longitude (opsional)</Label>
                <Input id="editLng" type="number" step="any" value={editLng} onChange={(e) => setEditLng(e.target.value)} />
              </div>
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
              <Button type="button" variant="outline" onClick={() => setEditStation(null)}>Batal</Button>
              <Button type="submit" disabled={updateMutation.isPending || editConfirm !== 'confirm'}>
                {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteStationObj} onOpenChange={(open) => !open && setDeleteStationObj(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Alat</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus alat ini? Tindakan ini tidak dapat dibatalkan.
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
              <Button type="button" variant="outline" onClick={() => setDeleteStationObj(null)}>Batal</Button>
              <Button variant="destructive" type="submit" disabled={deleteMutation.isPending || deleteConfirm !== 'confirm'}>
                {deleteMutation.isPending ? 'Menghapus...' : 'Hapus Alat'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
