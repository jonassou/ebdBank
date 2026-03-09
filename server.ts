import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting server initialization...");
const db = new Database("bank.db");
console.log("Database connected.");

// Initialize database
console.log("Initializing tables...");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    birthday TEXT,
    account_number TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'student')) DEFAULT 'student',
    balance REAL DEFAULT 0,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER,
    to_user_id INTEGER,
    amount REAL NOT NULL,
    type TEXT CHECK(type IN ('deposit', 'debit', 'transfer')) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(from_user_id) REFERENCES users(id),
    FOREIGN KEY(to_user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL DEFAULT 0,
    deadline TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    correct_option_index INTEGER NOT NULL,
    reward_amount REAL NOT NULL,
    time_limit INTEGER DEFAULT 30,
    is_active INTEGER DEFAULT 1,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    is_correct INTEGER NOT NULL,
    earned_amount REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(question_id) REFERENCES questions(id),
    UNIQUE(user_id, question_id)
  );

  INSERT OR IGNORE INTO settings (key, value) VALUES ('store_status', 'open');
`);
console.log("Tables initialized.");

// Migration: Add avatar_url if it doesn't exist
try {
  db.prepare("SELECT avatar_url FROM users LIMIT 1").get();
} catch (e) {
  try {
    db.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT;");
    console.log("Migration: Added avatar_url column to users table");
  } catch (err) {
    console.error("Migration error (avatar_url):", err);
  }
}

// Migration: Add birthday if it doesn't exist
try {
  db.prepare("SELECT birthday FROM users LIMIT 1").get();
} catch (e) {
  try {
    db.exec("ALTER TABLE users ADD COLUMN birthday TEXT;");
    console.log("Migration: Added birthday column to users table");
  } catch (err) {
    console.error("Migration error (birthday):", err);
  }
}

// Migration: Add image_url to products if it doesn't exist
try {
  db.prepare("SELECT image_url FROM products LIMIT 1").get();
} catch (e) {
  try {
    db.exec("ALTER TABLE products ADD COLUMN image_url TEXT;");
    console.log("Migration: Added image_url column to products table");
  } catch (err) {
    console.error("Migration error (image_url):", err);
  }
}

// Migration: Add expires_at to questions if it doesn't exist
try {
  db.prepare("SELECT expires_at FROM questions LIMIT 1").get();
} catch (e) {
  try {
    db.exec("ALTER TABLE questions ADD COLUMN expires_at DATETIME;");
    console.log("Migration: Added expires_at column to questions table");
  } catch (err) {
    console.error("Migration error (expires_at):", err);
  }
}

// Migration: Initialize store_status
try {
  const status = db.prepare("SELECT value FROM settings WHERE key = 'store_status'").get();
  if (!status) {
    db.prepare("INSERT INTO settings (key, value) VALUES ('store_status', 'open')").run();
    console.log("Migration: Initialized store_status to open");
  }
} catch (err) {
  console.error("Migration error (store_status):", err);
}

// Create default admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
if (!adminExists) {
  db.prepare("INSERT INTO users (name, account_number, password, role) VALUES (?, ?, ?, ?)")
    .run("Administrador", "admin", "admin123", "admin");
}

async function startServer() {
  console.log("Starting Express server...");
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Auth Middleware (Simple for demo)
  const auth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    if (!user) return res.status(401).json({ error: "User not found" });
    (req as any).user = user;
    next();
  };

  const adminOnly = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if ((req as any).user?.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    next();
  };

  // API Routes
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.post("/api/login", (req, res) => {
    const { identifier, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE (account_number = ? OR name = ?) AND password = ?")
      .get(identifier, identifier, password) as any;
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: "Credenciais inválidas" });
    }
  });

  // Admin: Student Management
  app.get("/api/admin/students", auth, adminOnly, (req, res) => {
    const students = db.prepare("SELECT * FROM users WHERE role = 'student' ORDER BY name ASC").all();
    res.json(students);
  });

  app.post("/api/admin/students", auth, adminOnly, (req, res) => {
    const { name, birthday, password, initialBalance } = req.body;
    const accountNumber = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const result = db.prepare("INSERT INTO users (name, birthday, account_number, password, balance, role) VALUES (?, ?, ?, ?, ?, 'student')")
        .run(name, birthday, accountNumber, password, initialBalance || 0);
      res.json({ id: result.lastInsertRowid, accountNumber });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/admin/students/:id", auth, adminOnly, (req, res) => {
    const { name, birthday, password } = req.body;
    const { id } = req.params;
    if (password) {
      db.prepare("UPDATE users SET name = ?, birthday = ?, password = ? WHERE id = ?").run(name, birthday, password, id);
    } else {
      db.prepare("UPDATE users SET name = ?, birthday = ? WHERE id = ?").run(name, birthday, id);
    }
    res.json({ success: true });
  });

  app.delete("/api/admin/students/:id", auth, adminOnly, (req, res) => {
    const { id } = req.params;
    const studentId = Number(id);

    if (isNaN(studentId)) {
      return res.status(400).json({ error: "ID de aluno inválido" });
    }
    
    const transaction = db.transaction(() => {
      // Delete user goals
      db.prepare("DELETE FROM goals WHERE user_id = ?").run(studentId);
      // Delete user transactions
      db.prepare("DELETE FROM transactions WHERE from_user_id = ? OR to_user_id = ?").run(studentId, studentId);
      // Delete user
      db.prepare("DELETE FROM users WHERE id = ?").run(studentId);
    });
    
    try {
      transaction();
      res.json({ success: true });
    } catch (e: any) {
      console.error("Delete error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/students/:id/reset", auth, adminOnly, (req, res) => {
    const { id } = req.params;
    const studentId = Number(id);
    const defaultPassword = "123"; // Simple default password for kids
    
    if (isNaN(studentId)) {
      return res.status(400).json({ error: "ID de aluno inválido" });
    }

    const transaction = db.transaction(() => {
      // Reset user balance and password
      db.prepare("UPDATE users SET balance = 0, password = ?, avatar_url = NULL WHERE id = ?").run(defaultPassword, studentId);
      // Delete user goals
      db.prepare("DELETE FROM goals WHERE user_id = ?").run(studentId);
      // Delete user transactions
      db.prepare("DELETE FROM transactions WHERE from_user_id = ? OR to_user_id = ?").run(studentId, studentId);
    });
    
    try {
      transaction();
      res.json({ success: true, defaultPassword });
    } catch (e: any) {
      console.error("Reset error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Admin: Store Management
  app.get("/api/admin/products", auth, adminOnly, (req, res) => {
    const products = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
    res.json(products);
  });

  app.post("/api/admin/products", auth, adminOnly, (req, res) => {
    const { name, price, stock, image_url, description } = req.body;
    const result = db.prepare("INSERT INTO products (name, price, stock, image_url, description) VALUES (?, ?, ?, ?, ?)")
      .run(name, price, stock, image_url, description);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/admin/products/:id", auth, adminOnly, (req, res) => {
    const { name, price, stock, image_url, description } = req.body;
    db.prepare("UPDATE products SET name = ?, price = ?, stock = ?, image_url = ?, description = ? WHERE id = ?")
      .run(name, price, stock, image_url, description, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/products/:id", auth, adminOnly, (req, res) => {
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Admin: Questions
  app.get("/api/admin/questions", auth, adminOnly, (req, res) => {
    const questions = db.prepare("SELECT * FROM questions ORDER BY created_at DESC").all();
    res.json(questions);
  });

  app.post("/api/admin/questions", auth, adminOnly, (req, res) => {
    const { question, options, correct_option_index, reward_amount, time_limit, is_active, expires_at } = req.body;
    const result = db.prepare("INSERT INTO questions (question, options, correct_option_index, reward_amount, time_limit, is_active, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(question, JSON.stringify(options), correct_option_index, reward_amount, time_limit, is_active ? 1 : 0, expires_at || null);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/admin/questions/:id", auth, adminOnly, (req, res) => {
    const { question, options, correct_option_index, reward_amount, time_limit, is_active, expires_at } = req.body;
    db.prepare("UPDATE questions SET question = ?, options = ?, correct_option_index = ?, reward_amount = ?, time_limit = ?, is_active = ?, expires_at = ? WHERE id = ?")
      .run(question, JSON.stringify(options), correct_option_index, reward_amount, time_limit, is_active ? 1 : 0, expires_at || null, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/questions/:id", auth, adminOnly, (req, res) => {
    try {
      const questionId = parseInt(req.params.id, 10);
      const deleteQuestionTx = db.transaction((id: number) => {
        db.prepare("DELETE FROM quiz_attempts WHERE question_id = ?").run(id);
        db.prepare("DELETE FROM questions WHERE id = ?").run(id);
      });
      deleteQuestionTx(questionId);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Error deleting question:", err);
      res.status(500).json({ error: err.message || "Erro ao excluir o desafio." });
    }
  });

  // Admin: Transactions
  app.post("/api/admin/transaction", auth, adminOnly, (req, res) => {
    const { studentId, amount, type, description } = req.body;
    const student = db.prepare("SELECT * FROM users WHERE id = ?").get(studentId) as any;
    if (!student) return res.status(404).json({ error: "Estudante não encontrado" });

    const newBalance = type === 'deposit' ? student.balance + amount : student.balance - amount;
    if (newBalance < 0) return res.status(400).json({ error: "Moedas insuficientes" });

    const transaction = db.transaction(() => {
      db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(newBalance, studentId);
      db.prepare("INSERT INTO transactions (to_user_id, amount, type, description) VALUES (?, ?, ?, ?)")
        .run(studentId, amount, type, description);
    });
    transaction();
    res.json({ success: true, newBalance });
  });

  // Student: Dashboard Data
  app.get("/api/student/dashboard", auth, (req, res) => {
    const user = (req as any).user;
    console.log(`Fetching dashboard for student: ${user.name} (ID: ${user.id})`);
    try {
      const transactions = db.prepare(`
        SELECT t.*, u1.name as from_name, u2.name as to_name 
        FROM transactions t
        LEFT JOIN users u1 ON t.from_user_id = u1.id
        LEFT JOIN users u2 ON t.to_user_id = u2.id
        WHERE t.from_user_id = ? OR t.to_user_id = ?
        ORDER BY t.created_at DESC
      `).all(user.id, user.id);
      
      const goals = db.prepare("SELECT * FROM goals WHERE user_id = ?").all(user.id);
      const products = db.prepare("SELECT * FROM products WHERE stock > 0").all();
      const storeStatus = db.prepare("SELECT value FROM settings WHERE key = 'store_status'").get() as any;
      
      console.log(`Dashboard data fetched successfully for ID: ${user.id}`);
      res.json({ user, transactions, goals, products, storeStatus: storeStatus?.value || 'open' });
    } catch (err) {
      console.error(`Error fetching dashboard for ID: ${user.id}`, err);
      res.status(500).json({ error: "Erro interno ao carregar dashboard" });
    }
  });

  // Student: Questions
  app.get("/api/student/questions", auth, (req, res) => {
    const user = (req as any).user;
    try {
      // Get active questions that the user hasn't attempted yet and are not expired
      const questions = db.prepare(`
        SELECT q.id, q.question, q.options, q.reward_amount, q.time_limit, q.expires_at
        FROM questions q
        LEFT JOIN quiz_attempts qa ON q.id = qa.question_id AND qa.user_id = ?
        WHERE q.is_active = 1 
          AND qa.id IS NULL
          AND (q.expires_at IS NULL OR datetime(q.expires_at) > datetime('now', 'localtime'))
        ORDER BY q.created_at DESC
      `).all(user.id);
      
      res.json(questions);
    } catch (err) {
      console.error(`Error fetching questions for ID: ${user.id}`, err);
      res.status(500).json({ error: "Erro ao carregar desafios" });
    }
  });

  app.post("/api/student/questions/:id/answer", auth, (req, res) => {
    const user = (req as any).user;
    const questionId = req.params.id;
    const { selected_index } = req.body; // -1 means timeout

    try {
      db.transaction(() => {
        // Check if already attempted
        const attempt = db.prepare("SELECT * FROM quiz_attempts WHERE user_id = ? AND question_id = ?").get(user.id, questionId);
        if (attempt) {
          throw new Error("Você já respondeu este desafio.");
        }

        const question = db.prepare("SELECT * FROM questions WHERE id = ? AND is_active = 1").get(questionId) as any;
        if (!question) {
          throw new Error("Desafio não encontrado ou inativo.");
        }

        const isCorrect = selected_index === question.correct_option_index;
        const earnedAmount = isCorrect ? question.reward_amount : 0;

        // Record attempt
        db.prepare("INSERT INTO quiz_attempts (user_id, question_id, is_correct, earned_amount) VALUES (?, ?, ?, ?)")
          .run(user.id, questionId, isCorrect ? 1 : 0, earnedAmount);

        // If correct, add balance and create transaction
        if (isCorrect) {
          db.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").run(earnedAmount, user.id);
          db.prepare("INSERT INTO transactions (to_user_id, amount, type, description) VALUES (?, ?, 'deposit', ?)")
            .run(user.id, earnedAmount, `Recompensa de Desafio: ${question.question.substring(0, 30)}...`);
        }
      })();

      const question = db.prepare("SELECT * FROM questions WHERE id = ?").get(questionId) as any;
      const isCorrect = selected_index === question.correct_option_index;
      
      res.json({ 
        success: true, 
        isCorrect, 
        correctIndex: question.correct_option_index,
        earnedAmount: isCorrect ? question.reward_amount : 0
      });
    } catch (err: any) {
      console.error(`Error answering question for ID: ${user.id}`, err);
      res.status(400).json({ error: err.message || "Erro ao processar resposta" });
    }
  });

  // Student: Purchase
  app.post("/api/student/purchase", auth, (req, res) => {
    const { productId } = req.body;
    const user = (req as any).user;
    
    try {
      const storeStatus = db.prepare("SELECT value FROM settings WHERE key = 'store_status'").get() as any;
      if (storeStatus?.value !== 'open') return res.status(400).json({ error: "A lojinha está fechada no momento." });

      const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId) as any;
      if (!product) return res.status(404).json({ error: "Produto não encontrado" });
      if (product.stock <= 0) return res.status(400).json({ error: "Produto esgotado" });
      if (user.balance < product.price) return res.status(400).json({ error: "Moedas insuficientes" });

      const transaction = db.transaction(() => {
        db.prepare("UPDATE users SET balance = balance - ? WHERE id = ?").run(product.price, user.id);
        db.prepare("UPDATE products SET stock = stock - 1 WHERE id = ?").run(productId);
        db.prepare("INSERT INTO transactions (to_user_id, amount, type, description) VALUES (?, ?, 'debit', ?)")
          .run(user.id, product.price, `Compra: ${product.name}`);
      });
      transaction();
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Admin: Store Status
  app.get("/api/admin/store/status", auth, adminOnly, (req, res) => {
    let status = db.prepare("SELECT value FROM settings WHERE key = 'store_status'").get() as any;
    if (!status) {
      db.prepare("INSERT INTO settings (key, value) VALUES ('store_status', 'open')").run();
      status = { value: 'open' };
    }
    res.json({ status: status.value });
  });

  app.post("/api/admin/store/toggle", auth, adminOnly, (req, res) => {
    const { status } = req.body; // 'open' or 'closed'
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('store_status', ?)")
      .run(status);
    res.json({ success: true, status });
  });

  // Student: Transfer
  app.post("/api/student/transfer", auth, (req, res) => {
    const { toAccountNumber, amount, description } = req.body;
    const fromUser = (req as any).user;
    
    if (fromUser.balance < amount) return res.status(400).json({ error: "Moedas insuficientes" });
    
    const toUser = db.prepare("SELECT * FROM users WHERE account_number = ?").get(toAccountNumber) as any;
    if (!toUser) return res.status(404).json({ error: "Conta destino não encontrada" });
    if (toUser.id === fromUser.id) return res.status(400).json({ error: "Não é possível transferir para si mesmo" });

    const transaction = db.transaction(() => {
      db.prepare("UPDATE users SET balance = balance - ? WHERE id = ?").run(amount, fromUser.id);
      db.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").run(amount, toUser.id);
      db.prepare("INSERT INTO transactions (from_user_id, to_user_id, amount, type, description) VALUES (?, ?, ?, 'transfer', ?)")
        .run(fromUser.id, toUser.id, amount, description);
    });
    transaction();
    res.json({ success: true });
  });

  // Student: Goals
  app.post("/api/student/goals", auth, (req, res) => {
    const { name, targetAmount, deadline } = req.body;
    const user = (req as any).user;
    db.prepare("INSERT INTO goals (user_id, name, target_amount, deadline) VALUES (?, ?, ?, ?)")
      .run(user.id, name, targetAmount, deadline);
    res.json({ success: true });
  });

  app.put("/api/student/goals/:id", auth, (req, res) => {
    const { currentAmount } = req.body;
    db.prepare("UPDATE goals SET current_amount = ? WHERE id = ? AND user_id = ?")
      .run(currentAmount, req.params.id, (req as any).user.id);
    res.json({ success: true });
  });

  // Reports
  app.get("/api/admin/reports/ranking", auth, (req, res) => {
    const ranking = db.prepare(`
      SELECT u.id, u.name, u.avatar_url, u.balance, COUNT(qa.id) as correct_answers
      FROM users u
      LEFT JOIN quiz_attempts qa ON u.id = qa.user_id AND qa.is_correct = 1
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY correct_answers DESC, u.balance DESC, u.name ASC
    `).all();
    res.json(ranking);
  });

  app.get("/api/admin/reports/transactions", auth, adminOnly, (req, res) => {
    const transactions = db.prepare(`
      SELECT t.*, u1.name as from_name, u2.name as to_name 
      FROM transactions t
      LEFT JOIN users u1 ON t.from_user_id = u1.id
      LEFT JOIN users u2 ON t.to_user_id = u2.id
      ORDER BY t.created_at DESC
    `).all();
    res.json(transactions);
  });

  app.post("/api/admin/change-password", auth, adminOnly, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = (req as any).user;

    if (user.password !== currentPassword) {
      return res.status(400).json({ error: "Senha atual incorreta" });
    }

    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(newPassword, user.id);
    res.json({ success: true });
  });

  // Student: Profile Update
  app.post("/api/student/update-profile", auth, (req, res) => {
    const { avatar_url } = req.body;
    const user = (req as any).user;
    db.prepare("UPDATE users SET avatar_url = ? WHERE id = ?").run(avatar_url, user.id);
    res.json({ success: true });
  });

  app.post("/api/student/change-password", auth, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = (req as any).user;

    if (user.password !== currentPassword) {
      return res.status(400).json({ error: "Senha atual incorreta" });
    }

    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(newPassword, user.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware ready.");
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("FATAL ERROR DURING SERVER STARTUP:", err);
});
