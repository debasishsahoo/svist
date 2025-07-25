import { API_BASE_URL } from "../utils/constants";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "API request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
  
  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
