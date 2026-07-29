import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, User, Mail, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ProfilePage() {
  const { user } = useAuth();
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Password baru dan konfirmasi password tidak cocok');
      return;
    }
    
    if (newPassword.length < 8) {
      setErrorMsg('Password baru harus minimal 8 karakter');
      return;
    }
    
    if (confirmText !== 'confirm') {
      return;
    }
    
    if (!user) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal mengubah password');
      }
      
      setSuccessMsg('Password berhasil diubah!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setConfirmText('');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profil Pengguna</h2>
        <p className="text-muted-foreground mt-1">Kelola informasi profil dan keamanan akun Anda.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
            <CardDescription>Detail akun Anda saat ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nama Lengkap</p>
                <p className="font-medium">{user.fullName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Peran (Role)</p>
                <Badge variant={user.role === 'admin' ? 'default' : user.role === 'engineer' ? 'secondary' : 'outline'} className="mt-1">
                  {user.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ubah Password</CardTitle>
            <CardDescription>Pastikan password baru Anda kuat dan aman</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Password Lama</Label>
                <div className="relative">
                  <Input 
                    id="oldPassword" 
                    type={showOldPassword ? 'text' : 'password'} 
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} 
                    required 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru (min. 8 karakter)</Label>
                <div className="relative">
                  <Input 
                    id="newPassword" 
                    type={showNewPassword ? 'text' : 'password'} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Input 
                    id="confirmNewPassword" 
                    type={showConfirmNewPassword ? 'text' : 'password'} 
                    value={confirmNewPassword} 
                    onChange={(e) => setConfirmNewPassword(e.target.value)} 
                    required 
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  >
                    {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="confirmText" className="text-destructive">Ketik "confirm" untuk menyimpan</Label>
                <Input 
                  id="confirmText" 
                  value={confirmText} 
                  onChange={(e) => setConfirmText(e.target.value)} 
                  placeholder="confirm"
                  required
                />
              </div>

              {errorMsg && <p className="text-sm font-medium text-destructive">{errorMsg}</p>}
              {successMsg && <p className="text-sm font-medium text-green-600 dark:text-green-500">{successMsg}</p>}
              
              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={isLoading || confirmText !== 'confirm'}>
                  {isLoading ? 'Menyimpan...' : 'Perbarui Password'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
