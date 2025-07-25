import { apiService } from "./api";
class AuthService {
  async login(email, password) {
    return await apiService.post("/auth/login", { email, password });
  }
  async register(name, email, password) {
    return await apiService.post("/auth/register", { name, email, password });
  }
  async verifyToken() {
    return await apiService.get("/auth/verify");
  }
  async logout() {
    return await apiService.post("/auth/logout");
  }
}
export const authService = new AuthService();
