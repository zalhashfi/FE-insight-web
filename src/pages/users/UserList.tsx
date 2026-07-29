import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { UserPlus, ShieldAlert, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/skeleton';

type User = {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'engineer' | 'user';
  createdAt: string;
};

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch users');
  const json = await res.json();
  return json.users || [];
}

async function createUser(data: any) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create user');
  }
  return res.json();
}

async function updateUser(data: { id: number; fullName: string; role: string; newPassword?: string }) {
  const { id, ...body } = data;
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update user');
  }
  return res.json();
}

async function deleteUser(id: number) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete user');
  }
  return res.json();
}

export function UserList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'engineer' | 'user'>('user');

  // Edit State
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'engineer' | 'user'>('user');
  const [editNewPassword, setEditNewPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editConfirm, setEditConfirm] = useState('');

  // Delete State
  const [deleteUserObj, setDeleteUserObj] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled: user?.role === 'admin',
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsOpen(false);
      setEmail('');
      setPassword('');
      setFullName('');
      setRole('user');
      setErrorMsg('');
      setShowPassword(false);
    },
    onError: (err: any) => {
      setErrorMsg(err.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditUser(null);
    },
    onError: (err: any) => {
      setErrorMsg(err.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteUserObj(null);
    },
    onError: (err: any) => {
      setErrorMsg(err.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters');
      return;
    }
    createMutation.mutate({ email, password, fullName, role });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editConfirm !== 'confirm') return;
    if (editUser) {
      updateMutation.mutate({
        id: editUser.id,
        fullName: editFullName,
        role: editRole,
        ...(editNewPassword ? { newPassword: editNewPassword } : {})
      });
    }
  };

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirm !== 'confirm') return;
    if (deleteUserObj) {
      deleteMutation.mutate(deleteUserObj.id);
    }
  };

  const openEditModal = (u: User) => {
    setEditUser(u);
    setEditFullName(u.fullName);
    setEditRole(u.role);
    setEditNewPassword('');
    setEditConfirm('');
    setErrorMsg('');
    setShowEditPassword(false);
  };

  const openDeleteModal = (u: User) => {
    setDeleteUserObj(u);
    setDeleteConfirm('');
    setErrorMsg('');
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold">Akses Ditolak</h2>
        <p className="text-muted-foreground">Halaman ini hanya dapat diakses oleh Administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h2>
          <p className="text-muted-foreground mt-1">Kelola daftar pengguna dan hak akses sistem.</p>
        </div>
        
        <Button onClick={() => setIsOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Tambah Pengguna
        </Button>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Dibuat Pada</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="p-4">
                  <TableSkeleton rows={5} cols={5} />
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-destructive">
                  Gagal memuat data pengguna.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && users?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Tidak ada pengguna ditemukan.
                </TableCell>
              </TableRow>
            )}
            {users?.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.fullName}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.role === 'admin' ? 'default' : u.role === 'engineer' ? 'secondary' : 'outline'}>
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleDateString('id-ID')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(u)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteModal(u)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create User Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail pengguna baru. Pastikan password kuat.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (min. 8 karakter)</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Peran (Role)</Label>
              <Select value={role} onValueChange={(v: any) => setRole(v)}>
                <SelectTrigger id="role"><SelectValue placeholder="Pilih peran" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errorMsg && <p className="text-sm font-medium text-destructive">{errorMsg}</p>}
            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Menyimpan...' : 'Simpan Pengguna'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>
              Ubah data pengguna ini. Kosongkan password jika tidak ingin mengubahnya.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="editFullName">Nama Lengkap</Label>
              <Input id="editFullName" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRole">Peran (Role)</Label>
              <Select value={editRole} onValueChange={(v: any) => setEditRole(v)}>
                <SelectTrigger id="editRole"><SelectValue placeholder="Pilih peran" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNewPassword">Password Baru (opsional)</Label>
              <div className="relative">
                <Input 
                  id="editNewPassword" 
                  type={showEditPassword ? 'text' : 'password'} 
                  value={editNewPassword} 
                  onChange={(e) => setEditNewPassword(e.target.value)} 
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                >
                  {showEditPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
              <Button type="button" variant="outline" onClick={() => setEditUser(null)}>Batal</Button>
              <Button type="submit" disabled={updateMutation.isPending || editConfirm !== 'confirm'}>
                {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUserObj} onOpenChange={(open) => !open && setDeleteUserObj(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hapus Pengguna</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
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
              <Button type="button" variant="outline" onClick={() => setDeleteUserObj(null)}>Batal</Button>
              <Button variant="destructive" type="submit" disabled={deleteMutation.isPending || deleteConfirm !== 'confirm'}>
                {deleteMutation.isPending ? 'Menghapus...' : 'Hapus Pengguna'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
