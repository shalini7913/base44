// Mock Base44 Client for Auth & API Services

export const base44 = {
  auth: {
    async login({ email, password }) {
      await new Promise(r => setTimeout(r, 600));
      if (!email || !password) throw new Error("Please enter email and password");
      return { user: { id: "u-123", email, name: email.split("@")[0] }, token: "mock-jwt-token" };
    },
    async resetPassword({ resetToken, newPassword }) {
      await new Promise(r => setTimeout(r, 800));
      if (!resetToken) throw new Error("Invalid or missing reset token");
      if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");
      return { success: true, message: "Password successfully updated" };
    },
    async requestPasswordReset(email) {
      await new Promise(r => setTimeout(r, 600));
      if (!email) throw new Error("Please provide a valid email");
      return { success: true, message: "Password reset link sent to your email" };
    },
    async getCurrentUser() {
      return { id: "u-123", email: "alex.mercer@resq.gov", name: "Alex Mercer" };
    }
  },
  entities: {
    user: {
      async find() { return []; },
      async create(data) { return data; }
    }
  }
};

export default base44;
