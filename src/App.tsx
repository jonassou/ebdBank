import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  ArrowRightLeft, 
  Target, 
  LogOut, 
  PiggyBank, 
  History,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  Search,
  AlertCircle,
  CheckCircle2,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  Store,
  Package,
  Tag,
  Lock,
  Unlock,
  Coins,
  Settings,
  RefreshCw,
  Cake,
  Gamepad2,
  Timer,
  XCircle,
  Calendar,
  Trophy,
  Medal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { api } from "./services/api";

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatCurrency = (value: number) => {
  return `${value.toLocaleString("pt-BR")}`;
};

const Currency = ({ value, className }: { value: number; className?: string }) => (
  <span className={cn("inline-flex items-center gap-1.5 font-bold", className)}>
    <div className="p-1 bg-amber-100 rounded-full">
      <Coins size={14} className="text-amber-500 fill-amber-500/20" />
    </div>
    <span>{formatCurrency(value)}</span>
  </span>
);

// --- Components ---
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: "bg-sky-500 text-white hover:bg-sky-600 shadow-[4px_4px_0px_0px_rgba(14,165,233,0.2)]",
      secondary: "bg-white text-sky-700 border-2 border-sky-100 hover:bg-sky-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]",
      danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 border-2 border-rose-100 shadow-[4px_4px_0px_0px_rgba(225,29,72,0.1)]",
      ghost: "bg-transparent text-slate-500 hover:bg-slate-100"
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:opacity-50 disabled:pointer-events-none active:scale-95 btn-playful",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("card-playful overflow-hidden", className)} {...props}>
    {children}
  </div>
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-2 text-sm font-medium ring-offset-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-300 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      {...props}
    />
  )
);

// --- Pages ---

// 1. Login Page
const LoginPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await api.login(identifier, password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <div className="text-center mb-6 lg:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-sky-500 text-white mb-4 shadow-lg shadow-sky-200">
            <PiggyBank size={28} className="lg:w-8 lg:h-8" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">EBD Bank 🚀</h1>
          <p className="text-sm lg:text-base text-slate-500 mt-2">Educação financeira para pequenos gênios! ✨</p>
        </div>

        <Card className="p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Usuário ou Conta</label>
              <Input 
                placeholder="Ex: admin ou 123456" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Senha</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? "Entrando..." : "Acessar Conta"}
            </Button>
          </form>
        </Card>
        
        <p className="text-center text-slate-400 text-sm mt-8">
          © 2024 EBD Bank • Escola do Futuro
        </p>
      </motion.div>
    </div>
  );
};

// 2. Admin Dashboard
const AdminDashboard = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'transactions' | 'reports' | 'store' | 'settings' | 'quiz' | 'ranking'>('students');
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredStudents = (students || []).filter(s => {
    if (!s) return false;
    const name = (s.name || "").toLowerCase();
    const acc = (s.account_number || "").toLowerCase();
    const term = (searchTerm || "").toLowerCase();
    return name.includes(term) || acc.includes(term);
  });
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [storeStatus, setStoreStatus] = useState<'open' | 'closed'>('open');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);
  const [questionData, setQuestionData] = useState({
    question: "",
    opt0: "",
    opt1: "",
    opt2: "",
    opt3: "",
    correctIndex: 0,
    reward: 50,
    timeLimit: 30,
    isActive: true,
    expiresAt: ""
  });

  const birthdayStudents = (students || []).filter(s => {
    if (!s.birthday) return false;
    const parts = s.birthday.split('-');
    if (parts.length < 2) return false;
    const month = parseInt(parts[1]);
    return month === new Date().getMonth() + 1;
  });
  
  // Settings state
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransModal, setShowTransModal] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [formData, setFormData] = useState({ name: "", birthday: "", password: "", initialBalance: 0 });
  const [transData, setTransData] = useState({ amount: 0, type: 'deposit', description: "" });
  const [productData, setProductData] = useState({ name: "", price: 0, stock: 0, description: "", image_url: "" });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [s, t, r, p, status, q] = await Promise.all([
        api.getStudents(user.id),
        api.getAllTransactions(user.id),
        api.getRanking(user.id),
        api.getAdminProducts(user.id),
        api.getStoreStatus(user.id),
        api.getAdminQuestions(user.id)
      ]);
      setStudents(s);
      setAllTransactions(t);
      setRanking(r);
      setProducts(p);
      setStoreStatus(status.status);
      setQuestions(q);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao carregar dados do administrador");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleToggleStore = async () => {
    const newStatus = storeStatus === 'open' ? 'closed' : 'open';
    try {
      await api.toggleStoreStatus(user.id, newStatus);
      setStoreStatus(newStatus);
    } catch (err: any) {
      alert(err.message || "Erro ao alterar status da loja");
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createStudent(user.id, formData);
      setShowAddModal(false);
      setFormData({ name: "", birthday: "", password: "", initialBalance: 0 });
      fetchData();
    } catch (err: any) {
      alert(err.message || "Erro ao criar aluno");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(user.id, editingProduct.id, productData);
      } else {
        await api.createProduct(user.id, productData);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductData({ name: "", price: 0, stock: 0, description: "", image_url: "" });
      fetchData();
    } catch (err: any) {
      alert(err.message || "Erro ao salvar produto");
    }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminTransaction(user.id, { 
        studentId: showTransModal.id, 
        ...transData 
      });
      setShowTransModal(null);
      setTransData({ amount: 0, type: 'deposit', description: "" });
      fetchData();
    } catch (err: any) {
      alert(err.message || "Erro ao realizar transação");
    }
  };

  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'reset' | 'deleteProduct';
    id: number;
    message: string;
  } | null>(null);

  const handleDelete = (id: number) => {
    setConfirmAction({
      type: 'delete',
      id,
      message: "Tem certeza que deseja excluir este aluno? Isso removerá permanentemente todos os seus dados (saldo, metas e histórico)."
    });
  };

  const handleReset = (id: number) => {
    setConfirmAction({
      type: 'reset',
      id,
      message: "Tem certeza que deseja resetar esta conta? Isso irá zerar o saldo e resetar a senha para '123'."
    });
  };

  const handleDeleteProduct = (id: number) => {
    setConfirmAction({
      type: 'deleteProduct',
      id,
      message: "Tem certeza que deseja excluir este produto?"
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    
    const { type, id } = confirmAction;
    setActionLoading(id);
    setConfirmAction(null);

    try {
      if (type === 'delete') {
        const res = await api.deleteStudent(user.id, id);
        if (res.error) alert(`Erro ao excluir aluno: ${res.error}`);
        else { alert("Aluno excluído com sucesso!"); fetchData(); }
      } else if (type === 'reset') {
        const res = await api.resetStudent(user.id, id);
        if (res.error) alert(`Erro ao resetar conta: ${res.error}`);
        else { alert(`Conta resetada com sucesso! A nova senha é: ${res.defaultPassword}`); fetchData(); }
      } else if (type === 'deleteProduct') {
        await api.deleteProduct(user.id, id);
        fetchData();
      }
    } catch (err: any) {
      alert(`Erro de conexão: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center font-bold text-sky-500">Carregando... 🎈</div>;

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Ops! Algo deu errado</h2>
        <p className="text-slate-500 mb-6 max-w-xs">{error}</p>
        <Button onClick={fetchData}>Tentar Novamente</Button>
        <Button variant="ghost" className="mt-2" onClick={onLogout}>Sair</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col lg:flex-row">
      {/* Sidebar / Mobile Nav */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col shrink-0 sticky top-0 z-30 lg:h-screen">
        <div className="p-4 lg:p-6 border-b border-slate-50 flex items-center justify-between lg:block">
          <div className="flex items-center gap-3 text-sky-600">
            <div className="p-2 bg-sky-100 rounded-xl">
              <PiggyBank size={28} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">EBD Bank 🏦</span>
          </div>
          <div className="lg:hidden flex items-center gap-2">
            <div className="text-right mr-2">
              <p className="text-xs font-bold text-slate-900">{user.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Admin</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible p-2 lg:p-4 gap-1 lg:gap-2 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('students')}
            className={cn(
              "flex items-center justify-center lg:justify-start lg:gap-3 p-2.5 lg:px-4 lg:py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:w-full",
              activeTab === 'students' ? "bg-sky-500 text-white shadow-lg shadow-sky-100" : "text-slate-500 hover:bg-slate-50"
            )}
            title="Alunos"
          >
            <Users size={20} />
            <span className="hidden lg:inline">Alunos</span>
          </button>
          <button 
            onClick={() => setActiveTab('store')}
            className={cn(
              "flex items-center justify-center lg:justify-start lg:gap-3 p-2.5 lg:px-4 lg:py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:w-full",
              activeTab === 'store' ? "bg-sky-500 text-white shadow-lg shadow-sky-100" : "text-slate-500 hover:bg-slate-50"
            )}
            title="Loja"
          >
            <Store size={20} />
            <span className="hidden lg:inline">Loja</span>
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={cn(
              "flex items-center justify-center lg:justify-start lg:gap-3 p-2.5 lg:px-4 lg:py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:w-full",
              activeTab === 'quiz' ? "bg-sky-500 text-white shadow-lg shadow-sky-100" : "text-slate-500 hover:bg-slate-50"
            )}
            title="Desafios"
          >
            <Gamepad2 size={20} />
            <span className="hidden lg:inline">Desafios</span>
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={cn(
              "flex items-center justify-center lg:justify-start lg:gap-3 p-2.5 lg:px-4 lg:py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:w-full",
              activeTab === 'transactions' ? "bg-sky-500 text-white shadow-lg shadow-sky-100" : "text-slate-500 hover:bg-slate-50"
            )}
            title="Transações"
          >
            <ArrowRightLeft size={20} />
            <span className="hidden lg:inline">Transações</span>
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={cn(
              "flex items-center justify-center lg:justify-start lg:gap-3 p-2.5 lg:px-4 lg:py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:w-full",
              activeTab === 'reports' ? "bg-sky-500 text-white shadow-lg shadow-sky-100" : "text-slate-500 hover:bg-slate-50"
            )}
            title="Relatórios"
          >
            <TrendingUp size={20} />
            <span className="hidden lg:inline">Relatórios</span>
          </button>
          <button 
            onClick={() => setActiveTab('ranking')}
            className={cn(
              "flex items-center justify-center lg:justify-start lg:gap-3 p-2.5 lg:px-4 lg:py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:w-full",
              activeTab === 'ranking' ? "bg-sky-500 text-white shadow-lg shadow-sky-100" : "text-slate-500 hover:bg-slate-50"
            )}
            title="Ranking"
          >
            <Medal size={20} />
            <span className="hidden lg:inline">Ranking</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex items-center justify-center lg:justify-start lg:gap-3 p-2.5 lg:px-4 lg:py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:w-full",
              activeTab === 'settings' ? "bg-sky-500 text-white shadow-lg shadow-sky-100" : "text-slate-500 hover:bg-slate-50"
            )}
            title="Configurações"
          >
            <Settings size={20} />
            <span className="hidden lg:inline">Configurações</span>
          </button>
        </nav>

        <div className="hidden lg:block p-4 border-t border-slate-50 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="hidden lg:flex h-20 bg-white border-b border-slate-100 px-8 items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-900">
            {activeTab === 'students' && "Gestão de Alunos 👨‍🎓"}
            {activeTab === 'store' && "Gestão da Loja 🛒"}
            {activeTab === 'transactions' && "Histórico Geral 📜"}
            {activeTab === 'reports' && "Relatórios e Insights 📊"}
            {activeTab === 'settings' && "Configurações do Sistema ⚙️"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Administrador</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold mr-2">
              AD
            </div>
            <button 
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all"
              title="Sair do Painel"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
          {activeTab === 'students' && (
            <div className="space-y-6">
              {birthdayStudents.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm text-pink-500">
                    <Cake size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-pink-900">Aniversariantes de {new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date())} 🎂</h4>
                    <p className="text-xs text-pink-700 font-medium">
                      {birthdayStudents.map(s => {
                        const day = s.birthday.split('-')[2];
                        return `${s.name} (Dia ${day})`;
                      }).join(', ')}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    className="pl-10" 
                    placeholder="Buscar aluno por nome ou conta..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={() => setShowAddModal(true)} className="gap-2 w-full sm:w-auto">
                  <Plus size={18} />
                  Novo Aluno
                </Button>
              </div>

              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aluno</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Conta</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Moedas</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                              <p className="text-xs text-slate-400">{s.birthday}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono text-slate-500">{s?.account_number || "---"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Currency value={s.balance} className="text-sm font-bold text-sky-600" />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => setShowTransModal(s)} 
                            disabled={actionLoading === s.id}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-30"
                            title="Transação"
                          >
                            <ArrowRightLeft size={18} />
                          </button>
                          <button 
                            onClick={() => handleReset(s.id)} 
                            disabled={actionLoading === s.id}
                            className="p-2 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors disabled:opacity-30"
                            title="Resetar Conta"
                          >
                            {actionLoading === s.id ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                          </button>
                          <button 
                            onClick={() => handleDelete(s.id)} 
                            disabled={actionLoading === s.id}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors disabled:opacity-30"
                            title="Excluir Aluno"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'store' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 lg:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Configurações da Lojinha</h3>
                  <p className="text-sm text-slate-500">Controle a visibilidade e vendas da loja.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex-1 sm:flex-none flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      storeStatus === 'open' ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                    )} />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      {storeStatus === 'open' ? "Aberta" : "Fechada"}
                    </span>
                  </div>
                  <Button 
                    variant={storeStatus === 'open' ? "danger" : "primary"}
                    onClick={handleToggleStore}
                    className="gap-2 flex-1 sm:flex-none"
                  >
                    {storeStatus === 'open' ? <Lock size={18} /> : <Unlock size={18} />}
                    {storeStatus === 'open' ? "Fechar" : "Abrir"}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">Produtos Cadastrados</h3>
                <Button onClick={() => { setEditingProduct(null); setProductData({ name: "", price: 0, stock: 0, description: "", image_url: "" }); setShowProductModal(true); }} className="gap-2 w-full sm:w-auto">
                  <Plus size={18} />
                  Novo Produto
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <Card key={p.id} className="p-5 flex flex-col">
                    <div className="w-full h-40 bg-slate-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Package size={48} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900">{p.name}</h4>
                        <Currency value={p.price} className="text-sky-600 font-bold" />
                      </div>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{p.description || "Sem descrição"}</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Tag size={12} />
                        Estoque: {p.stock}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Button variant="secondary" className="flex-1 h-9 text-xs" onClick={() => { setEditingProduct(p); setProductData({ name: p.name, price: p.price, stock: p.stock, description: p.description || "", image_url: p.image_url || "" }); setShowProductModal(true); }}>
                        <Edit2 size={14} className="mr-2" /> Editar
                      </Button>
                      <Button variant="danger" className="h-9 w-9 p-0" onClick={() => handleDeleteProduct(p.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Origem/Destino</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(t.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          t.type === 'deposit' ? "bg-emerald-50 text-emerald-600" : 
                          t.type === 'debit' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                        )}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {t.type === 'transfer' ? `${t.from_name} → ${t.to_name}` : (t.to_name || "Escola")}
                        </p>
                        <p className="text-xs text-slate-400">{t.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-sm font-bold",
                          t.type === 'deposit' ? "text-emerald-600" : "text-red-600"
                        )}>
                          {t.type === 'deposit' ? "+" : "-"}<Currency value={t.amount} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          )}

          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-sky-600" size={20} />
                  Ranking de Economia
                </h3>
                <div className="space-y-4">
                  {ranking.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-sm font-bold text-slate-400">#{i + 1}</span>
                        <span className="text-sm font-semibold text-slate-700">{r.name}</span>
                      </div>
                      <Currency value={r.balance} className="text-sm font-bold text-sky-600" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <History className="text-sky-600" size={20} />
                  Volume de Transações
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ranking}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">{payload[0].payload.name}</p>
                                <Currency value={payload[0].value as number} className="text-sm font-black text-sky-600" />
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="balance" radius={[4, 4, 0, 0]}>
                        {ranking.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#818cf8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'ranking' && (
            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="text-amber-500" size={24} />
                  Ranking de Desafios Bíblicos
                </h3>
                <p className="text-sm text-slate-500 mt-1">Classificação baseada no número de acertos nos desafios.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posição</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aluno</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Acertos</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ranking.map((r, i) => (
                      <tr key={r.id} className={cn(
                        "hover:bg-slate-50/50 transition-colors",
                        i === 0 ? "bg-amber-50/30" : i === 1 ? "bg-slate-50/30" : i === 2 ? "bg-amber-50/10" : ""
                      )}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {i === 0 && <Trophy size={18} className="text-amber-400" fill="currentColor" />}
                            {i === 1 && <Trophy size={18} className="text-slate-300" fill="currentColor" />}
                            {i === 2 && <Trophy size={18} className="text-amber-600" fill="currentColor" />}
                            {i > 2 && <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{i + 1}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 overflow-hidden shrink-0">
                              {r.avatar_url ? (
                                <img src={r.avatar_url} alt={r.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-sky-600">
                                  {r.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <span className="font-bold text-slate-700">{r.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-600 font-bold text-sm">
                            {r.correct_answers}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Currency value={r.balance} className="text-sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Desafios Bíblicos</h2>
                  <p className="text-slate-500">Crie perguntas para os alunos ganharem moedas.</p>
                </div>
                <Button onClick={() => {
                  setEditingQuestion(null);
                  setQuestionData({
                    question: "",
                    opt0: "",
                    opt1: "",
                    opt2: "",
                    opt3: "",
                    correctIndex: 0,
                    reward: 50,
                    timeLimit: 30,
                    isActive: true,
                    expiresAt: ""
                  });
                  setShowQuestionModal(true);
                }} className="w-full sm:w-auto shadow-lg shadow-sky-200">
                  <Plus size={20} className="mr-2" /> Novo Desafio
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((q) => {
                  const options = JSON.parse(q.options);
                  return (
                    <Card key={q.id} className={cn("p-6 relative", !q.is_active && "opacity-60")}>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingQuestion(q);
                            setQuestionData({
                              question: q.question,
                              opt0: options[0] || "",
                              opt1: options[1] || "",
                              opt2: options[2] || "",
                              opt3: options[3] || "",
                              correctIndex: q.correct_option_index,
                              reward: q.reward_amount,
                              timeLimit: q.time_limit,
                              isActive: q.is_active === 1,
                              expiresAt: q.expires_at || ""
                            });
                            setShowQuestionModal(true);
                          }}
                          className="p-2 bg-slate-100 text-slate-600 hover:bg-sky-100 hover:text-sky-600 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => setDeletingQuestionId(q.id)}
                          className="p-2 bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      {deletingQuestionId === q.id && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center rounded-3xl">
                          <p className="font-bold text-slate-900 mb-4">Excluir este desafio?</p>
                          <div className="flex gap-3 w-full">
                            <Button 
                              variant="secondary" 
                              className="flex-1"
                              onClick={() => setDeletingQuestionId(null)}
                            >
                              Cancelar
                            </Button>
                            <Button 
                              variant="danger"
                              className="flex-1"
                              onClick={async () => {
                                try {
                                  await api.deleteQuestion(user.id, q.id);
                                  setDeletingQuestionId(null);
                                  fetchData();
                                } catch (err: any) {
                                  alert(err.message || "Erro ao excluir o desafio.");
                                }
                              }}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={cn(
                          "px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wider",
                          q.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                        )}>
                          {q.is_active ? "Ativo" : "Inativo"}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                          <Coins size={12} /> +{q.reward_amount}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
                          <Timer size={12} /> {q.time_limit}s
                        </span>
                        {q.expires_at && (
                          <span className={cn(
                            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md",
                            new Date(q.expires_at) < new Date() 
                              ? "bg-red-50 text-red-600" 
                              : "bg-indigo-50 text-indigo-600"
                          )}>
                            <Calendar size={12} /> 
                            {new Date(q.expires_at) < new Date() ? "Expirado" : "Até " + new Date(q.expires_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-slate-900 mb-4 line-clamp-3">{q.question}</h3>
                      
                      <div className="space-y-2">
                        {options.map((opt: string, idx: number) => (
                          <div key={idx} className={cn(
                            "text-sm p-2 rounded-lg border",
                            idx === q.correct_option_index 
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium" 
                              : "bg-slate-50 border-slate-100 text-slate-600"
                          )}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
                {questions.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <Gamepad2 size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhum desafio criado</h3>
                    <p className="text-slate-500">Crie o primeiro desafio para os alunos jogarem.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Configurações</h2>
                  <p className="text-slate-500">Gerencie sua conta de administrador.</p>
                </div>

                <Card className="p-6 lg:p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Lock className="text-sky-600" size={20} />
                    Alterar Senha
                  </h3>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setPasswordError("");
                      setPasswordSuccess("");
                      
                      if (passwordData.new !== passwordData.confirm) {
                        setPasswordError("As novas senhas não coincidem");
                        return;
                      }

                      setPasswordLoading(true);
                      try {
                        await api.changeAdminPassword(user.id, {
                          currentPassword: passwordData.current,
                          newPassword: passwordData.new
                        });
                        setPasswordSuccess("Senha alterada com sucesso!");
                        setPasswordData({ current: "", new: "", confirm: "" });
                      } catch (err: any) {
                        setPasswordError(err.message || "Erro ao alterar senha");
                      } finally {
                        setPasswordLoading(false);
                      }
                    }} 
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Senha Atual</label>
                      <Input 
                        type="password" 
                        required 
                        value={passwordData.current} 
                        onChange={e => setPasswordData({...passwordData, current: e.target.value})} 
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Nova Senha</label>
                        <Input 
                          type="password" 
                          required 
                          value={passwordData.new} 
                          onChange={e => setPasswordData({...passwordData, new: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Confirmar Nova Senha</label>
                        <Input 
                          type="password" 
                          required 
                          value={passwordData.confirm} 
                          onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} 
                        />
                      </div>
                    </div>

                    {passwordError && (
                      <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs flex items-center gap-2">
                        <AlertCircle size={14} />
                        {passwordError}
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 text-xs flex items-center gap-2">
                        <CheckCircle2 size={14} />
                        {passwordSuccess}
                      </div>
                    )}

                    <div className="pt-2">
                      <Button type="submit" disabled={passwordLoading} className="w-full sm:w-auto">
                        {passwordLoading ? "Alterando..." : "Atualizar Senha"}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            )}
          </div>
        </main>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">Cadastrar Novo Aluno</h3>
              <form onSubmit={handleCreateStudent} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Aniversário</label>
                  <Input type="date" required value={formData.birthday} onChange={e => setFormData({...formData, birthday: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Senha de Acesso</label>
                  <Input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Moedas Iniciais</label>
                  <Input type="number" value={formData.initialBalance} onChange={e => setFormData({...formData, initialBalance: Number(e.target.value)})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancelar</Button>
                  <Button type="submit" className="flex-1">Salvar Aluno</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showQuestionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowQuestionModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">{editingQuestion ? "Editar Desafio" : "Novo Desafio"}</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const payload = {
                  question: questionData.question,
                  options: [questionData.opt0, questionData.opt1, questionData.opt2, questionData.opt3].filter(Boolean),
                  correct_option_index: questionData.correctIndex,
                  reward_amount: questionData.reward,
                  time_limit: questionData.timeLimit,
                  is_active: questionData.isActive,
                  expires_at: questionData.expiresAt ? new Date(questionData.expiresAt).toISOString() : null
                };
                
                if (payload.options.length < 2) {
                  alert("Adicione pelo menos 2 opções.");
                  return;
                }
                if (payload.correct_option_index >= payload.options.length) {
                  alert("A opção correta selecionada é inválida.");
                  return;
                }

                try {
                  if (editingQuestion) {
                    await api.updateQuestion(user.id, editingQuestion.id, payload);
                  } else {
                    await api.createQuestion(user.id, payload);
                  }
                  setShowQuestionModal(false);
                  fetchData();
                } catch (err) {
                  console.error(err);
                  alert("Erro ao salvar desafio.");
                }
              }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Pergunta</label>
                  <textarea 
                    required
                    value={questionData.question}
                    onChange={e => setQuestionData({...questionData, question: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none h-24"
                    placeholder="Ex: Quem construiu a arca?"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Opções de Resposta</label>
                  {[0, 1, 2, 3].map(idx => (
                    <div key={idx} className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="correctIndex" 
                        checked={questionData.correctIndex === idx}
                        onChange={() => setQuestionData({...questionData, correctIndex: idx})}
                        className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                      />
                      <Input 
                        value={(questionData as any)[`opt${idx}`]}
                        onChange={e => setQuestionData({...questionData, [`opt${idx}`]: e.target.value})}
                        placeholder={`Opção ${idx + 1}`}
                        className={cn(questionData.correctIndex === idx && "border-emerald-500 bg-emerald-50")}
                        required={idx < 2} // At least 2 options
                      />
                    </div>
                  ))}
                  <p className="text-xs text-slate-400">Marque a bolinha ao lado da resposta correta.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Recompensa (Moedas)</label>
                    <Input 
                      type="number" 
                      min="1"
                      required
                      value={questionData.reward}
                      onChange={e => setQuestionData({...questionData, reward: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tempo (Segundos)</label>
                    <Input 
                      type="number" 
                      min="5"
                      required
                      value={questionData.timeLimit}
                      onChange={e => setQuestionData({...questionData, timeLimit: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Validade (Opcional)</label>
                  <Input 
                    type="datetime-local" 
                    value={questionData.expiresAt ? new Date(new Date(questionData.expiresAt).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                    onChange={e => setQuestionData({...questionData, expiresAt: e.target.value})}
                  />
                  <p className="text-xs text-slate-400">Deixe em branco para não expirar.</p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={questionData.isActive}
                    onChange={e => setQuestionData({...questionData, isActive: e.target.checked})}
                    className="w-4 h-4 text-sky-500 rounded focus:ring-sky-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Desafio Ativo (Visível para alunos)</label>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowQuestionModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Salvar
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowProductModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">{editingProduct ? "Editar Produto" : "Novo Produto"}</h3>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome do Produto</label>
                  <Input required value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Preço</label>
                    <Input type="number" step="0.01" required value={productData.price} onChange={e => setProductData({...productData, price: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Estoque</label>
                    <Input type="number" required value={productData.stock} onChange={e => setProductData({...productData, stock: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">URL da Imagem (Opcional)</label>
                  <Input placeholder="https://..." value={productData.image_url} onChange={e => setProductData({...productData, image_url: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
                  <textarea 
                    className="flex min-h-[100px] w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-300 transition-all"
                    value={productData.description} 
                    onChange={e => setProductData({...productData, description: e.target.value})} 
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowProductModal(false)}>Cancelar</Button>
                  <Button type="submit" className="flex-1">Salvar Produto</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showTransModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowTransModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">Transação para Aluno</h3>
              <p className="text-slate-500 text-sm mb-6">{showTransModal?.name} ({showTransModal?.account_number})</p>
              
              <form onSubmit={handleTransaction} className="space-y-4">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setTransData({...transData, type: 'deposit'})}
                    className={cn(
                      "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                      transData.type === 'deposit' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"
                    )}
                  >DEPOSITAR</button>
                  <button 
                    type="button"
                    onClick={() => setTransData({...transData, type: 'debit'})}
                    className={cn(
                      "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                      transData.type === 'debit' ? "bg-white text-red-600 shadow-sm" : "text-slate-500"
                    )}
                  >DEBITAR</button>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Valor</label>
                  <Input type="number" step="0.01" required value={transData.amount} onChange={e => setTransData({...transData, amount: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
                  <Input placeholder="Ex: Recompensa por tarefa" value={transData.description} onChange={e => setTransData({...transData, description: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowTransModal(null)}>Cancelar</Button>
                  <Button type="submit" className={cn("flex-1", transData.type === 'deposit' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700")}>
                    Confirmar {transData.type === 'deposit' ? "Depósito" : "Débito"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {confirmAction && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setConfirmAction(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Você tem certeza?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                {confirmAction.message}
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setConfirmAction(null)}>
                  Cancelar
                </Button>
                <Button variant="danger" className="flex-1" onClick={handleConfirmAction}>
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 3. Student Dashboard
const StudentDashboard = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'store' | 'profile' | 'quiz'>('home');
  const [data, setData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [isChallengeStarted, setIsChallengeStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [confirmPurchase, setConfirmPurchase] = useState<any>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [transferData, setTransferData] = useState({ to: "", amount: 0, desc: "" });
  const [goalData, setGoalData] = useState({ name: "", target: 0, deadline: "" });
  const [error, setError] = useState("");

  // Profile state
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [d, q, r] = await Promise.all([
        api.getStudentDashboard(user.id),
        api.getStudentQuestions(user.id),
        api.getRanking(user.id)
      ]);
      setData(d);
      setQuestions(q);
      setRanking(r);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    let timer: any;
    if (activeQuestion && isChallengeStarted && timeLeft > 0 && !quizResult) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuestion, isChallengeStarted, timeLeft, quizResult]);

  useEffect(() => {
    if (activeQuestion && timeLeft === 0 && !quizResult && !quizLoading) {
      handleAnswer(-1);
    }
  }, [timeLeft, activeQuestion, quizResult, quizLoading]);

  const startQuestion = (q: any) => {
    setActiveQuestion(q);
    setTimeLeft(q.time_limit);
    setQuizResult(null);
    setIsChallengeStarted(false);
  };

  const handleAnswer = async (selectedIndex: number) => {
    if (!activeQuestion || quizResult || quizLoading) return;
    setQuizLoading(true);
    try {
      const result = await api.answerQuestion(user.id, activeQuestion.id, selectedIndex);
      setQuizResult({ ...result, selectedIndex });
      
      // Update local balance and questions list if correct
      if (result.isCorrect) {
        setData((prev: any) => ({
          ...prev,
          user: { ...prev.user, balance: prev.user.balance + result.earnedAmount }
        }));
      }
      
      // Remove question from list
      setQuestions(prev => prev.filter(q => q.id !== activeQuestion.id));
      
    } catch (err: any) {
      alert(err.message || "Erro ao responder");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.transfer(user.id, { 
        toAccountNumber: transferData.to, 
        amount: transferData.amount, 
        description: transferData.desc 
      });
      setShowTransfer(false);
      setTransferData({ to: "", amount: 0, desc: "" });
      fetchDashboard();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePurchase = async () => {
    if (!confirmPurchase) return;
    
    try {
      await api.purchase(user.id, confirmPurchase.id);
      setPurchaseStatus({ type: 'success', message: `Compra de "${confirmPurchase.name}" realizada com sucesso!` });
      setConfirmPurchase(null);
      fetchDashboard();
      
      // Clear success message after 3 seconds
      setTimeout(() => setPurchaseStatus(null), 3000);
    } catch (err: any) {
      setPurchaseStatus({ type: 'error', message: err.message });
      setConfirmPurchase(null);
      setTimeout(() => setPurchaseStatus(null), 5000);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createGoal(user.id, {
      name: goalData.name,
      targetAmount: goalData.target,
      deadline: goalData.deadline
    });
    setShowGoal(false);
    setGoalData({ name: "", target: 0, deadline: "" });
    fetchDashboard();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        await api.updateProfile(user.id, { avatar_url: base64 });
        fetchDashboard();
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError("As senhas não coincidem");
      return;
    }
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");
    try {
      await api.changeStudentPassword(user.id, {
        currentPassword: passwordData.current,
        newPassword: passwordData.new
      });
      setPasswordSuccess("Senha alterada com sucesso!");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center font-bold text-sky-500">Carregando... 🎈</div>;

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Ops! Algo deu errado</h2>
        <p className="text-slate-500 mb-6 max-w-xs">{error || "Não foi possível carregar seus dados."}</p>
        <Button onClick={fetchDashboard}>Tentar Novamente</Button>
        <Button variant="ghost" className="mt-2" onClick={onLogout}>Sair</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] pb-12">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-sky-500 to-violet-500 text-white px-4 lg:px-6 py-3 lg:py-4 sticky top-0 z-20 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 lg:gap-6 min-w-0 flex-1">
            <div className="flex items-center gap-2 font-bold text-lg shrink-0">
              <PiggyBank size={24} />
              <span className="hidden md:inline">EBD Bank</span>
            </div>
            <div className="flex gap-1 overflow-x-auto scrollbar-hide min-w-0">
              <button 
                onClick={() => setActiveTab('home')}
                className={cn(
                  "p-2 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'home' ? "bg-white/20" : "hover:bg-white/10"
                )}
                title="Início"
              >
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Início</span>
              </button>
              <button 
                onClick={() => setActiveTab('store')}
                className={cn(
                  "p-2 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'store' ? "bg-white/20" : "hover:bg-white/10"
                )}
                title="Lojinha"
              >
                <ShoppingBag size={18} />
                <span className="hidden sm:inline">Lojinha</span>
              </button>
              <button 
                onClick={() => setActiveTab('quiz')}
                className={cn(
                  "p-2 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'quiz' ? "bg-white/20" : "hover:bg-white/10"
                )}
                title="Desafios"
              >
                <Gamepad2 size={18} />
                <span className="hidden sm:inline">Desafios</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-bold text-sky-200 uppercase tracking-widest leading-none">{data?.user?.account_number}</p>
              <div className="flex items-center justify-end gap-2 mt-1">
                {ranking && ranking.findIndex(r => Number(r.id) === Number(user.id)) === 0 && <Trophy size={16} className="text-amber-400 drop-shadow-sm" fill="currentColor" />}
                {ranking && ranking.findIndex(r => Number(r.id) === Number(user.id)) === 1 && <Trophy size={16} className="text-slate-300 drop-shadow-sm" fill="currentColor" />}
                {ranking && ranking.findIndex(r => Number(r.id) === Number(user.id)) === 2 && <Trophy size={16} className="text-amber-600 drop-shadow-sm" fill="currentColor" />}
                <p className="text-sm font-bold">{data?.user?.name || "Usuário"}</p>
              </div>
            </div>
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 overflow-hidden cursor-pointer"
                onClick={() => setActiveTab('profile')}
              >
                {data?.user?.avatar_url ? (
                  <img src={data?.user?.avatar_url} alt={data?.user?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-white">
                    {data?.user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              {ranking && ranking.findIndex(r => Number(r.id) === Number(user.id)) !== -1 && ranking.findIndex(r => Number(r.id) === Number(user.id)) < 3 && (
                <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                  {ranking.findIndex(r => Number(r.id) === Number(user.id)) === 0 && <Trophy size={12} className="text-amber-400" fill="currentColor" />}
                  {ranking.findIndex(r => Number(r.id) === Number(user.id)) === 1 && <Trophy size={12} className="text-slate-300" fill="currentColor" />}
                  {ranking.findIndex(r => Number(r.id) === Number(user.id)) === 2 && <Trophy size={12} className="text-amber-600" fill="currentColor" />}
                </div>
              )}
            </div>
            <button 
              onClick={onLogout}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Purchase Status Toast */}
      <AnimatePresence>
        {purchaseStatus && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className={cn(
              "p-4 rounded-2xl shadow-xl flex items-center gap-3 border",
              purchaseStatus.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"
            )}>
              {purchaseStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-bold">{purchaseStatus.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'home' ? (
        <>
          {/* Header */}
          <header className="bg-gradient-to-br from-sky-500 to-violet-500 text-white pt-6 lg:pt-8 pb-20 lg:pb-24 px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-sky-100 text-sm font-medium">Olá, {(data?.user?.name || "Usuário").split(' ')[0]} 👋</p>
              <h1 className="text-2xl lg:text-3xl font-bold mt-1">Bem-vindo ao seu Banco 🎈</h1>
            </div>
          </header>

          <div className="max-w-4xl mx-auto px-4 lg:px-6 -mt-12 lg:-mt-16 space-y-6 lg:space-y-8">
            {/* Balance Card */}
            <Card className="p-6 lg:p-8 bg-white shadow-xl shadow-sky-100 border-none">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-slate-400 text-xs lg:text-sm font-bold uppercase tracking-wider">Saldo de Moedas</p>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mt-1 flex items-center gap-3">
                    <Coins size={28} className="text-amber-400 fill-amber-400/20 lg:w-8 lg:h-8" />
                    {formatCurrency(data?.user?.balance || 0)}
                  </h2>
                  <p className="text-slate-400 text-[10px] lg:text-xs mt-2 font-mono">Conta: {data?.user?.account_number}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => setShowTransfer(true)} className="gap-2 h-11 lg:h-12 px-6 w-full sm:w-auto">
                    <ArrowRightLeft size={18} />
                    Transferir
                  </Button>
                  <Button variant="secondary" onClick={() => setShowGoal(true)} className="gap-2 h-11 lg:h-12 px-6 w-full sm:w-auto">
                    <Target size={18} />
                    Nova Meta
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Recent Transactions */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <History className="text-sky-600" size={20} />
                  Últimas Transações
                </h3>
                <div className="space-y-3">
                  {data.transactions.length === 0 && (
                    <Card className="p-8 text-center text-slate-400">
                      Nenhuma transação realizada ainda.
                    </Card>
                  )}
                  {data.transactions.map((t: any) => {
                    const isOut = t.from_user_id === data?.user?.id || t.type === 'debit';
                    return (
                      <Card key={t.id} className="p-3 lg:p-4 flex items-center justify-between hover:border-sky-100 transition-all group gap-3">
                        <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                          <div className={cn(
                            "w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all shrink-0",
                            isOut ? "bg-red-50 text-red-500 group-hover:bg-red-100" : "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100"
                          )}>
                            {isOut ? <ArrowUpRight size={20} className="lg:w-6 lg:h-6" /> : <ArrowDownLeft size={20} className="lg:w-6 lg:h-6" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {t.type === 'transfer' 
                                ? (isOut ? `Para ${t.to_name}` : `De ${t.from_name}`)
                                : (t.type === 'deposit' ? "Depósito da Escola" : (t.description || "Pagamento/Débito"))}
                            </p>
                            <p className="text-[10px] lg:text-xs text-slate-400 truncate">
                              {new Date(t.created_at).toLocaleDateString()} • {t.description || "Sem descrição"}
                            </p>
                          </div>
                        </div>
                        <span className={cn(
                          "text-sm font-black whitespace-nowrap shrink-0",
                          isOut ? "text-red-500" : "text-emerald-500"
                        )}>
                          {isOut ? "-" : "+"}<Currency value={t.amount} />
                        </span>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="text-sky-600" size={20} />
                  Minhas Metas
                </h3>
                <div className="space-y-4">
                  {data.goals.length === 0 && (
                    <Card className="p-8 text-center text-slate-400 text-sm">
                      Crie metas para economizar moedas!
                    </Card>
                  )}
                  {data.goals.map((g: any) => {
                    const progress = Math.min((g.current_amount / g.target_amount) * 100, 100);
                    return (
                      <Card key={g.id} className="p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{g.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Até {new Date(g.deadline).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-sky-600">{Math.round(progress)}%</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="h-full bg-sky-600 rounded-full"
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <Currency value={g.current_amount} />
                            <Currency value={g.target_amount} />
                          </div>
                        </div>
                        <Button 
                          variant="secondary" 
                          className="w-full h-8 text-[10px] uppercase tracking-wider"
                          onClick={async () => {
                            const amount = prompt("Quanto você quer adicionar a esta meta?", "0");
                            if (amount) {
                              await api.updateGoal(user.id, g.id, g.current_amount + Number(amount));
                              fetchDashboard();
                            }
                          }}
                        >
                          Adicionar Economia
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : activeTab === 'quiz' ? (
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Desafios Bíblicos 🎮</h2>
              <p className="text-sm lg:text-base text-slate-500">Responda corretamente e ganhe moedas!</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Suas Moedas</p>
              <Currency value={data?.user?.balance || 0} className="text-lg font-black text-sky-600 mt-1" />
            </div>
          </div>

          {activeQuestion ? (
            <Card className="max-w-2xl mx-auto p-6 lg:p-10 border-2 border-sky-100 shadow-xl shadow-sky-100/50">
              <div className="flex justify-between items-center mb-8">
                <span className="flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                  <Coins size={16} /> Valendo {activeQuestion.reward_amount}
                </span>
                {isChallengeStarted && (
                  <span className={cn(
                    "flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg transition-colors",
                    timeLeft <= 10 ? "bg-red-50 text-red-600 animate-pulse" : "bg-sky-50 text-sky-600"
                  )}>
                    <Timer size={16} /> {timeLeft}s restantes
                  </span>
                )}
              </div>

              {!isChallengeStarted ? (
                <div className="text-center py-6 lg:py-10">
                  <div className="w-20 h-20 bg-sky-50 text-sky-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 group-hover:rotate-0 transition-transform">
                    <Gamepad2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Desafio Pronto! 🚀</h3>
                  <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                    Você terá <span className="text-sky-600 font-bold">{activeQuestion.time_limit} segundos</span> para responder após aceitar.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="ghost" className="flex-1 order-2 sm:order-1" onClick={() => setActiveQuestion(null)}>
                      Voltar
                    </Button>
                    <Button className="flex-1 order-1 sm:order-2 shadow-lg shadow-sky-200" onClick={() => setIsChallengeStarted(true)}>
                      Aceitar e Ver Pergunta
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-8 text-center leading-snug">
                    {activeQuestion.question}
                  </h3>

                  <div className="space-y-3">
                    {JSON.parse(activeQuestion.options).map((opt: string, idx: number) => {
                      let btnClass = "bg-slate-50 border-2 border-slate-100 text-slate-700 hover:bg-sky-50 hover:border-sky-200";
                      
                      if (quizResult) {
                        if (idx === quizResult.correctIndex) {
                          btnClass = "bg-emerald-50 border-2 border-emerald-500 text-emerald-700";
                        } else if (idx === quizResult.selectedIndex) {
                          btnClass = "bg-red-50 border-2 border-red-500 text-red-700";
                        } else {
                          btnClass = "bg-slate-50 border-2 border-slate-100 text-slate-400 opacity-50";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={!!quizResult || quizLoading}
                          onClick={() => handleAnswer(idx)}
                          className={cn(
                            "w-full p-4 rounded-xl text-left font-medium transition-all",
                            btnClass
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0",
                              quizResult 
                                ? (idx === quizResult.correctIndex ? "bg-emerald-200 text-emerald-800" : idx === quizResult.selectedIndex ? "bg-red-200 text-red-800" : "bg-slate-200 text-slate-500")
                                : "bg-white text-slate-500 shadow-sm"
                            )}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                            
                            {quizResult && idx === quizResult.correctIndex && <CheckCircle2 className="ml-auto text-emerald-500" size={20} />}
                            {quizResult && idx === quizResult.selectedIndex && idx !== quizResult.correctIndex && <XCircle className="ml-auto text-red-500" size={20} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {quizResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-8 text-center"
                    >
                      {quizResult.isCorrect ? (
                        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-6">
                          <h4 className="font-black text-lg mb-1 flex items-center justify-center gap-2">
                            <CheckCircle2 size={24} /> Resposta Certa! 🎉
                          </h4>
                          <p className="font-medium">Você ganhou {quizResult.earnedAmount} moedas.</p>
                        </div>
                      ) : (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
                          <h4 className="font-black text-lg mb-1 flex items-center justify-center gap-2">
                            <XCircle size={24} /> Que pena!
                          </h4>
                          <p className="font-medium">
                            {quizResult.selectedIndex === -1 ? "O tempo acabou!" : "A resposta estava incorreta."}
                          </p>
                        </div>
                      )}
                      <Button onClick={() => setActiveQuestion(null)} className="w-full">
                        Voltar aos Desafios
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {questions.map(q => (
                <Card key={q.id} className="p-6 flex flex-col hover:border-sky-200 transition-colors cursor-pointer group" onClick={() => startQuestion(q)}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Gamepad2 size={24} />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                      <Coins size={12} /> +{q.reward_amount}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">Desafio Bíblico</h3>
                  <p className="text-xs text-slate-500 italic mb-2">Revelar pergunta ao iniciar</p>
                  {q.expires_at && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                        <Calendar size={10} /> Expira em: {new Date(q.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="mt-auto pt-4 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <Timer size={14} /> {q.time_limit}s
                    </span>
                    <span className="text-sky-600 font-bold group-hover:underline">Jogar agora &rarr;</span>
                  </div>
                </Card>
              ))}
              {questions.length === 0 && (
                <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-100">
                  <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Tudo limpo!</h3>
                  <p className="text-slate-500">Você já respondeu todos os desafios disponíveis no momento.</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : activeTab === 'store' ? (
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Lojinha Escolar 🛒</h2>
              <p className="text-sm lg:text-base text-slate-500">Troque suas moedas por recompensas incríveis!</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Suas Moedas</p>
              <Currency value={data?.user?.balance || 0} className="text-lg font-black text-sky-600 mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {data.storeStatus === 'closed' && (
              <div className="absolute inset-0 z-10 bg-slate-50/60 backdrop-blur-[2px] rounded-3xl flex items-center justify-center p-8 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm border border-slate-100">
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Lojinha Fechada</h3>
                  <p className="text-slate-500 font-medium">No momento a lojinha está fechada para manutenção ou fora do horário. Volte mais tarde!</p>
                </div>
              </div>
            )}
            {data.products.map((p: any) => (
              <Card key={p.id} className={cn(
                "flex flex-col group hover:shadow-xl hover:shadow-sky-50 transition-all border-none",
                data.storeStatus === 'closed' && "opacity-50 grayscale"
              )}>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={48} className="text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                    <Currency value={p.price} className="text-xs font-bold text-sky-600" />
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="font-bold text-slate-900 mb-1">{p.name}</h4>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{p.description || "Sem descrição"}</p>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-slate-400">Disponível</span>
                      <span className={cn(p.stock < 5 ? "text-red-500" : "text-emerald-500")}>
                        {p.stock} unidades
                      </span>
                    </div>
                    <Button 
                      className="w-full gap-2" 
                      disabled={(data?.user?.balance || 0) < p.price || p.stock <= 0 || data.storeStatus === 'closed'}
                      onClick={() => setConfirmPurchase(p)}
                    >
                      <ShoppingBag size={18} />
                      {data.storeStatus === 'closed' ? "Loja Fechada" : "Comprar Agora"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 flex items-center gap-3">
              <Users className="text-sky-600" size={32} />
              Meu Perfil 👤
            </h2>
            <p className="text-slate-500 font-medium mt-1">Gerencie suas informações e sua foto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <Card className="p-8 flex flex-col items-center text-center h-fit">
              <div className="relative group">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-sky-100 overflow-hidden bg-slate-50 shadow-inner">
                  {data?.user?.avatar_url ? (
                    <img src={data?.user?.avatar_url} alt={data?.user?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl lg:text-5xl font-black text-sky-200">
                      {data?.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-sky-600 transition-all active:scale-95"
                >
                  <Plus size={20} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarUpload} 
                />
              </div>
              <div className="flex items-center justify-center gap-2 mt-6">
                {ranking && ranking.findIndex(r => Number(r.id) === Number(user.id)) === 0 && <Trophy size={24} className="text-amber-400 drop-shadow-sm" fill="currentColor" />}
                {ranking && ranking.findIndex(r => Number(r.id) === Number(user.id)) === 1 && <Trophy size={24} className="text-slate-300 drop-shadow-sm" fill="currentColor" />}
                {ranking && ranking.findIndex(r => Number(r.id) === Number(user.id)) === 2 && <Trophy size={24} className="text-amber-600 drop-shadow-sm" fill="currentColor" />}
                <h3 className="text-xl font-bold text-slate-900">{data?.user?.name || "Usuário"}</h3>
              </div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Conta: {data?.user?.account_number}</p>
              
              <div className="mt-8 w-full space-y-3">
                <div className="p-3 bg-sky-50 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-600 uppercase">Saldo</span>
                  <Currency value={data?.user?.balance || 0} />
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 uppercase">Metas</span>
                  <span className="font-bold text-amber-700">{data.goals.length}</span>
                </div>
              </div>
            </Card>

            {/* Password Section */}
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6 lg:p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Lock className="text-sky-600" size={20} />
                  Alterar Senha
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Senha Atual</label>
                    <Input 
                      type="password" 
                      required 
                      value={passwordData.current} 
                      onChange={e => setPasswordData({...passwordData, current: e.target.value})} 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Nova Senha</label>
                      <Input 
                        type="password" 
                        required 
                        value={passwordData.new} 
                        onChange={e => setPasswordData({...passwordData, new: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Confirmar Nova Senha</label>
                      <Input 
                        type="password" 
                        required 
                        value={passwordData.confirm} 
                        onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} 
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold flex items-center gap-2">
                      <AlertCircle size={14} />
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 size={14} />
                      {passwordSuccess}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={passwordLoading}>
                    {passwordLoading ? "Alterando..." : "Salvar Nova Senha"}
                  </Button>
                </form>
              </Card>

              <Card className="p-6 lg:p-8 bg-sky-50 border-sky-100">
                <h3 className="text-lg font-bold text-sky-900 mb-2">Dica de Segurança 💡</h3>
                <p className="text-sky-700 text-sm leading-relaxed">
                  Crie uma senha que seja fácil de lembrar para você, mas difícil para os outros adivinharem. 
                  Não use sua data de nascimento ou o nome do seu pet!
                </p>
              </Card>

              <Card className="p-6 lg:p-8 border-red-100 bg-red-50/30">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                  <LogOut className="text-red-500" size={20} />
                  Sair da Conta
                </h3>
                <p className="text-red-700 text-sm mb-6">
                  Deseja sair do seu banco agora? Não se esqueça de voltar logo para continuar economizando!
                </p>
                <Button variant="danger" className="w-full" onClick={onLogout}>
                  Sair do EBD Bank
                </Button>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {confirmPurchase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setConfirmPurchase(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 lg:p-8 text-center max-h-[90vh] overflow-y-auto"
            >
              <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Confirmar Compra</h3>
              <p className="text-slate-500 text-sm mb-6">
                Você deseja comprar <strong>{confirmPurchase.name}</strong> por <strong><Currency value={confirmPurchase.price} /></strong>?
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setConfirmPurchase(null)}>Cancelar</Button>
                <Button className="flex-1" onClick={handlePurchase}>Confirmar</Button>
              </div>
            </motion.div>
          </div>
        )}

        {showTransfer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowTransfer(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">Transferir Moedas</h3>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Número da Conta Destino</label>
                  <Input required placeholder="Ex: 123456" value={transferData.to} onChange={e => setTransferData({...transferData, to: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Valor</label>
                  <Input type="number" step="0.01" required value={transferData.amount} onChange={e => setTransferData({...transferData, amount: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Descrição (Opcional)</label>
                  <Input placeholder="Ex: Pagamento de lanche" value={transferData.desc} onChange={e => setTransferData({...transferData, desc: e.target.value})} />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowTransfer(false)}>Cancelar</Button>
                  <Button type="submit" className="flex-1">Confirmar Envio</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowGoal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">Nova Meta de Economia</h3>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">O que você quer comprar?</label>
                  <Input required placeholder="Ex: Bicicleta, Jogo, Viagem" value={goalData.name} onChange={e => setGoalData({...goalData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Quanto custa?</label>
                  <Input type="number" step="0.01" required value={goalData.target} onChange={e => setGoalData({...goalData, target: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Data Limite</label>
                  <Input type="date" required value={goalData.deadline} onChange={e => setGoalData({...goalData, deadline: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowGoal(false)}>Cancelar</Button>
                  <Button type="submit" className="flex-1">Criar Meta</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bank_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (u: any) => {
    setUser(u);
    localStorage.setItem("bank_user", JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("bank_user");
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  return user.role === 'admin' 
    ? <AdminDashboard user={user} onLogout={handleLogout} /> 
    : <StudentDashboard user={user} onLogout={handleLogout} />;
}
