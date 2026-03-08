const API_URL = "/api";

async function fetchWithTimeout(url: string, options: any = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error("Tempo de resposta esgotado. Tente novamente.");
    }
    throw error;
  }
}

export const api = {
  async login(identifier: string, password: string) {
    const res = await fetchWithTimeout(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async getStudents(userId: number) {
    const res = await fetchWithTimeout(`${API_URL}/admin/students`, {
      headers: { "x-user-id": userId.toString() },
    });
    return res.json();
  },

  async createStudent(userId: number, data: any) {
    const res = await fetchWithTimeout(`${API_URL}/admin/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async updateStudent(userId: number, studentId: number, data: any) {
    const res = await fetchWithTimeout(`${API_URL}/admin/students/${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async deleteStudent(userId: number, studentId: number) {
    const res = await fetchWithTimeout(`${API_URL}/admin/students/${studentId}`, {
      method: "DELETE",
      headers: { "x-user-id": userId.toString() },
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async resetStudent(userId: number, studentId: number) {
    const res = await fetchWithTimeout(`${API_URL}/admin/students/${studentId}/reset`, {
      method: "POST",
      headers: { "x-user-id": userId.toString() },
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async adminTransaction(userId: number, data: any) {
    const res = await fetchWithTimeout(`${API_URL}/admin/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async getAdminQuestions(userId: number) {
    const res = await fetchWithTimeout(`${API_URL}/admin/questions`, {
      headers: { "x-user-id": userId.toString() },
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async createQuestion(userId: number, data: any) {
    const res = await fetchWithTimeout(`${API_URL}/admin/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async updateQuestion(userId: number, questionId: number, data: any) {
    const res = await fetchWithTimeout(`${API_URL}/admin/questions/${questionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async deleteQuestion(userId: number, questionId: number) {
    const res = await fetchWithTimeout(`${API_URL}/admin/questions/${questionId}`, {
      method: "DELETE",
      headers: { "x-user-id": userId.toString() },
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async getAdminProducts(userId: number) {
    const res = await fetchWithTimeout(`${API_URL}/admin/products`, {
      headers: { "x-user-id": userId.toString() },
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async createProduct(userId: number, data: any) {
    const res = await fetchWithTimeout(`${API_URL}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async updateProduct(userId: number, productId: number, data: any) {
    const res = await fetchWithTimeout(`${API_URL}/admin/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async deleteProduct(userId: number, productId: number) {
    const res = await fetchWithTimeout(`${API_URL}/admin/products/${productId}`, {
      method: "DELETE",
      headers: { "x-user-id": userId.toString() },
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async getStudentQuestions(userId: number) {
    const res = await fetchWithTimeout(`${API_URL}/student/questions`, {
      headers: { "x-user-id": userId.toString() },
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async answerQuestion(userId: number, questionId: number, selectedIndex: number) {
    const res = await fetchWithTimeout(`${API_URL}/student/questions/${questionId}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify({ selected_index: selectedIndex }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async getStudentDashboard(userId: number) {
    const res = await fetchWithTimeout(`${API_URL}/student/dashboard`, {
      headers: { "x-user-id": userId.toString() },
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async purchase(userId: number, productId: number) {
    const res = await fetchWithTimeout(`${API_URL}/student/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async transfer(userId: number, data: any) {
    const res = await fetchWithTimeout(`${API_URL}/student/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async createGoal(userId: number, data: any) {
    const res = await fetchWithTimeout(`${API_URL}/student/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateGoal(userId: number, goalId: number, currentAmount: number) {
    const res = await fetchWithTimeout(`${API_URL}/student/goals/${goalId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify({ currentAmount }),
    });
    return res.json();
  },

  async getRanking(userId: number) {
    const res = await fetchWithTimeout(`${API_URL}/admin/reports/ranking`, {
      headers: { "x-user-id": userId.toString() },
    });
    return res.json();
  },

  async getAllTransactions(userId: number) {
    const res = await fetchWithTimeout(`${API_URL}/admin/reports/transactions`, {
      headers: { "x-user-id": userId.toString() },
    });
    return res.json();
  },
  
  async getStoreStatus(userId: number) {
    const res = await fetchWithTimeout(`${API_URL}/admin/store/status`, {
      headers: { "x-user-id": userId.toString() },
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async toggleStoreStatus(userId: number, status: 'open' | 'closed') {
    const res = await fetchWithTimeout(`${API_URL}/admin/store/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  
  async changeAdminPassword(userId: number, data: any) {
    const res = await fetchWithTimeout(`${API_URL}/admin/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  
  async updateProfile(userId: number, data: { avatar_url: string }) {
    const res = await fetchWithTimeout(`${API_URL}/student/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async changeStudentPassword(userId: number, data: any) {
    const res = await fetchWithTimeout(`${API_URL}/student/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId.toString(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
};
