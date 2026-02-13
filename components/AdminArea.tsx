
import React, { useState, useEffect } from 'react';
import { 
  MASTER_ADMIN_EMAIL, 
  VALIDATION_ENDPOINT, 
  CAKTO_WEBHOOK_KEY, 
  CAKTO_CLIENT_ID, 
  CAKTO_CLIENT_SECRET 
} from '../constants';
import { User } from '../types';

interface AdminAreaProps {
  onBack: () => void;
}

const DURATION_OPTIONS = [
  { label: '1 Hora', value: 60 * 60 * 1000 },
  { label: '24 Horas', value: 24 * 60 * 60 * 1000 },
  { label: '7 Dias', value: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Dias', value: 30 * 24 * 60 * 60 * 1000 },
  { label: 'Vitalício', value: 3650 * 24 * 60 * 60 * 1000 },
];

const AdminArea: React.FC<AdminAreaProps> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [testResult, setTestResult] = useState<{status: string, message: string} | null>(null);
  const [testing, setTesting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    duration: DURATION_OPTIONS[1].value
  });

  useEffect(() => {
    const savedUsers = localStorage.getItem('an_hash_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const initialUsers: User[] = [
        { 
          email: MASTER_ADMIN_EMAIL, 
          name: 'Admin Master', 
          cpf: '000.000.000-00', 
          phone: '(00) 00000-0000',
          status: 'active', 
          plan: 'VIP', 
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setUsers(initialUsers);
      localStorage.setItem('an_hash_users', JSON.stringify(initialUsers));
    }
  }, []);

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('an_hash_users', JSON.stringify(updatedUsers));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, cpf, phone, duration } = formData;
    if (!email || !name || users.find(u => u.email === email)) {
      alert("Usuário já existe ou campos incompletos.");
      return;
    }
    
    const newUser: User = {
      name,
      email: email.toLowerCase().trim(),
      cpf: cpf || 'S/ CPF',
      phone: phone || 'S/ TEL',
      status: 'active',
      plan: 'Standard',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + duration).toISOString()
    };
    
    saveUsers([...users, newUser]);
    setFormData({ ...formData, name: '', email: '', cpf: '', phone: '' });
  };

  const testCaktoConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch(VALIDATION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': CAKTO_CLIENT_ID,
          'X-Client-Secret': CAKTO_CLIENT_SECRET,
          'Authorization': `Bearer ${CAKTO_WEBHOOK_KEY}`
        },
        body: JSON.stringify({ email: 'test@cakto.com' })
      });
      
      if (response.ok) {
        setTestResult({
          status: 'SUCCESS',
          message: "API respondeu corretamente. Integração estável."
        });
      } else {
        setTestResult({
          status: 'ERROR',
          message: `O servidor retornou HTTP ${response.status}. Verifique se o endpoint existe.`
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'ERROR',
        message: "Falha Crítica de Rede (CORS). O navegador bloqueou a requisição entre domínios. Certifique-se que o servidor permite conexões deste domínio."
      });
    } finally {
      setTesting(false);
    }
  };

  const deleteUser = (email: string) => {
    if (email === MASTER_ADMIN_EMAIL) return;
    if (window.confirm(`Remover acesso de ${email}?`)) {
      saveUsers(users.filter(u => u.email !== email));
    }
  };

  const isExpired = (expiresAt: string) => new Date() > new Date(expiresAt);

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen flex flex-col p-4 md:p-8 bg-black font-mono">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter">Admin Panel v7</h1>
          <p className="text-[10px] text-primary tracking-widest font-black uppercase mt-1">Gerenciador de Acessos Analíticos</p>
        </div>
        <button onClick={onBack} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">home</span>
          <span className="text-[10px] uppercase font-black">Voltar ao Início</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-panel-dark border border-white/5 p-6 rounded-[2rem] shadow-2xl">
             <h3 className="text-[10px] text-primary uppercase mb-4 tracking-widest font-black flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">security</span>
                Configuração Cakto
             </h3>
             <div className="space-y-4">
                <div className="bg-black/60 p-3 rounded-xl border border-white/5 overflow-hidden">
                   <p className="text-[7px] text-white/30 uppercase font-black mb-1">CLIENT ID</p>
                   <p className="text-[9px] text-white/70 font-mono truncate">{CAKTO_CLIENT_ID}</p>
                </div>
                <div className="bg-black/60 p-3 rounded-xl border border-white/5 overflow-hidden">
                   <p className="text-[7px] text-white/30 uppercase font-black mb-1">CLIENT SECRET</p>
                   <p className="text-[9px] text-white/70 font-mono truncate">{CAKTO_CLIENT_SECRET}</p>
                </div>
                <div className="bg-black/60 p-3 rounded-xl border border-white/5 overflow-hidden">
                   <p className="text-[7px] text-white/30 uppercase font-black mb-1">WEBHOOK KEY / TOKEN</p>
                   <p className="text-[9px] text-white/70 font-mono truncate">{CAKTO_WEBHOOK_KEY}</p>
                </div>
                
                <button 
                  onClick={testCaktoConnection}
                  disabled={testing}
                  className="w-full py-4 bg-primary/10 border border-primary/20 rounded-xl text-[10px] text-primary font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                  {testing ? 'PROCESSANDO...' : 'TESTAR INTEGRAÇÃO'}
                </button>

                {testResult && (
                  <div className={`p-4 rounded-xl border ${testResult.status === 'ERROR' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                     <p className="text-[9px] font-black uppercase mb-1">{testResult.status}</p>
                     <p className="text-[8px] leading-relaxed opacity-80">{testResult.message}</p>
                  </div>
                )}
             </div>
          </section>

          <section className="bg-panel-dark border border-white/5 p-6 rounded-[2rem] shadow-2xl">
            <h3 className="text-[10px] text-primary uppercase mb-5 tracking-widest font-black flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">person_add</span>
                Cadastro de Emergência
            </h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input 
                type="text" required value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nome do Cliente"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary/50"
              />
              <input 
                type="email" required value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="E-mail de Acesso"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary/50"
              />
              <select 
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary/50"
              >
                {DURATION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <button type="submit" className="w-full bg-primary py-4 rounded-xl text-black font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                LIBERAR ACESSO IMEDIATO
              </button>
            </form>
          </section>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="bg-panel-dark border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-[9px] uppercase font-black text-white/30 tracking-widest">Usuário</th>
                  <th className="px-6 py-4 text-[9px] uppercase font-black text-white/30 tracking-widest">Validade</th>
                  <th className="px-6 py-4 text-[9px] uppercase font-black text-white/30 tracking-widest text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => {
                  const expired = isExpired(user.expiresAt);
                  return (
                    <tr key={user.email} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-white font-black">{user.name}</span>
                          <span className="text-[9px] text-white/30 font-mono">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`text-[9px] font-black ${expired ? 'text-red-500' : 'text-green-500'}`}>
                            {expired ? 'LICENÇA EXPIRADA' : 'LICENÇA ATIVA'}
                          </span>
                          <span className="text-[8px] text-white/20">{new Date(user.expiresAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => deleteUser(user.email)} disabled={user.email === MASTER_ADMIN_EMAIL} className="w-8 h-8 rounded-lg bg-white/5 text-white/30 hover:text-red-500 transition-all disabled:opacity-0">
                           <span className="material-symbols-outlined text-sm">delete</span>
                         </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
             <p className="text-[8px] text-white/40 leading-relaxed font-mono">
               DICA: Se a API estiver apresentando erros de rede (CORS), utilize o cadastro manual acima para liberar seus clientes enquanto resolve as permissões do servidor.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminArea;
