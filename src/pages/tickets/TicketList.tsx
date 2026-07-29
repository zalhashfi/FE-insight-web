import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldAlert, TicketPlus, Edit } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api';

type Ticket = {
  id: number;
  stationUuid: string;
  issueTitle: string;
  issueDescription: string;
  status: 'open' | 'in_progress' | 'resolved';
  actionTaken: string | null;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
};

type Station = {
  uuid: string;
  name: string;
};

async function fetchTickets(): Promise<Ticket[]> {
  const res = await apiFetch('/api/tickets');
  if (!res.ok) throw new Error('Failed to fetch tickets');
  const data = await res.json();
  return data.tickets || [];
}

async function fetchStations(): Promise<Station[]> {
  const res = await apiFetch('/api/stations');
  if (!res.ok) throw new Error('Failed to fetch stations');
  const data = await res.json();
  return data.stations || [];
}

async function createTicket(data: { stationUuid: string; issueTitle: string; issueDescription: string }) {
  const res = await apiFetch('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create ticket');
  return res.json();
}

async function updateTicket(data: { id: number; payload: { status: string; actionTaken: string } }) {
  const res = await apiFetch(`/api/tickets/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data.payload),
  });
  if (!res.ok) throw new Error('Failed to update ticket');
  return res.json();
}

export function TicketList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const canAccess = user?.role === 'admin' || user?.role === 'engineer';

  const [isOpen, setIsOpen] = useState(false);
  const [stationUuid, setStationUuid] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [editTicket, setEditTicket] = useState<Ticket | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editActionTaken, setEditActionTaken] = useState('');

  const { data: tickets, isLoading, isError } = useQuery({
    queryKey: ['tickets'],
    queryFn: fetchTickets,
    enabled: canAccess,
  });

  const { data: stations } = useQuery({
    queryKey: ['stations'],
    queryFn: fetchStations,
    enabled: canAccess,
  });

  const createMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setIsOpen(false);
      setStationUuid('');
      setIssueTitle('');
      setIssueDescription('');
      setErrorMsg('');
    },
    onError: (err: any) => setErrorMsg(err.message)
  });

  const updateMutation = useMutation({
    mutationFn: updateTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setEditTicket(null);
    },
    onError: (err: any) => setErrorMsg(err.message)
  });

  if (!canAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold">Akses Ditolak</h2>
        <p className="text-muted-foreground">Halaman ini hanya dapat diakses oleh Admin & Engineer.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ stationUuid, issueTitle, issueDescription });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTicket) {
      updateMutation.mutate({
        id: editTicket.id,
        payload: { status: editStatus, actionTaken: editActionTaken }
      });
    }
  };

  const openEdit = (t: Ticket) => {
    setEditTicket(t);
    setEditStatus(t.status);
    setEditActionTaken(t.actionTaken || '');
    setErrorMsg('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600">Open</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tiket Masalah</h2>
          <p className="text-muted-foreground mt-1">Kelola tiket masalah untuk setiap alat (station).</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <TicketPlus className="mr-2 h-4 w-4" />
          Buat Tiket
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Masalah</TableHead>
                <TableHead>Stasiun</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dilaporkan Oleh</TableHead>
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
                    Gagal memuat data tiket.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && tickets?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Belum ada tiket masalah.
                  </TableCell>
                </TableRow>
              )}
              {tickets?.map((t) => {
                const st = stations?.find(s => s.uuid === t.stationUuid);
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.issueTitle}</TableCell>
                    <TableCell>{st ? st.name : t.stationUuid}</TableCell>
                    <TableCell>{getStatusBadge(t.status)}</TableCell>
                    <TableCell>{t.reportedBy}</TableCell>
                    <TableCell>{new Date(t.createdAt).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openEdit(t)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Buat Tiket Baru</DialogTitle>
            <DialogDescription>
              Laporkan masalah pada stasiun tertentu.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="station">Stasiun</Label>
              <Select value={stationUuid} onValueChange={(v) => setStationUuid(v || '')} required>
                <SelectTrigger id="station"><SelectValue placeholder="Pilih stasiun" /></SelectTrigger>
                <SelectContent>
                  {stations?.map(s => (
                    <SelectItem key={s.uuid} value={s.uuid}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Judul Masalah</Label>
              <Input id="title" value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Deskripsi</Label>
              <Textarea id="desc" value={issueDescription} onChange={(e: any) => setIssueDescription(e.target.value)} required />
            </div>
            {errorMsg && <p className="text-sm font-medium text-destructive">{errorMsg}</p>}
            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Menyimpan...' : 'Buat Tiket'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Ticket Dialog */}
      <Dialog open={!!editTicket} onOpenChange={(open) => !open && setEditTicket(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Tiket</DialogTitle>
            <DialogDescription>
              Ubah status atau tambahkan tindakan yang telah dilakukan.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="editStatus">Status</Label>
              <Select value={editStatus} onValueChange={(v) => setEditStatus(v || '')} required>
                <SelectTrigger id="editStatus"><SelectValue placeholder="Pilih status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionTaken">Tindakan (Action Taken)</Label>
              <Textarea id="actionTaken" value={editActionTaken} onChange={(e: any) => setEditActionTaken(e.target.value)} placeholder="Tindakan penyelesaian..." />
            </div>
            {errorMsg && <p className="text-sm font-medium text-destructive">{errorMsg}</p>}
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditTicket(null)}>Batal</Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Menyimpan...' : 'Update Tiket'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
