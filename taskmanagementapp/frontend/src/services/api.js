import axios from "axios";

// API configuration constants
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  MAX_CONCURRENT_REQUESTS: 10,
};

// Request queue for managing concurrent requests
const requestQueue = new Map();
let activeRequests = 0;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  // Enable credentials for cross-origin requests
  withCredentials: false,
});

// Request retry configuration
const retryConfig = {
  retries: API_CONFIG.RETRY_ATTEMPTS,
  retryDelay: (retryCount) => {
    return Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return (
      !error.response ||
      error.response.status >= 500 ||
      error.code === "NETWORK_ERROR" ||
      error.code === "TIMEOUT"
    );
  },
};

// Request deduplication helper
const createRequestKey = (config) => {
  return `${config.method?.toLowerCase()}-${config.url}-${JSON.stringify(
    config.params || {}
  )}-${JSON.stringify(config.data || {})}`;
};

// Network status tracking
let isOnline = navigator.onLine;
const networkListeners = new Set();

// Update network status
const updateNetworkStatus = (status) => {
  isOnline = status;
  networkListeners.forEach((callback) => callback(status));
};

// Network event listeners
window.addEventListener("online", () => updateNetworkStatus(true));
window.addEventListener("offline", () => updateNetworkStatus(false));

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Check network connectivity
    if (!isOnline) {
      throw new Error("No internet connection available");
    }

    // Add authentication token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = {
      startTime: Date.now(),
      requestId: Math.random().toString(36).substr(2, 9),
    };

    // Add API version header
    config.headers["X-API-Version"] = "1.0";

    // Add client info
    config.headers["X-Client-Version"] =
      process.env.REACT_APP_VERSION || "1.0.0";
    config.headers["X-Client-Platform"] = "web";

    // Request deduplication for GET requests
    if (config.method?.toLowerCase() === "get") {
      const requestKey = createRequestKey(config);

      if (requestQueue.has(requestKey)) {
        // Return existing promise for duplicate request
        return requestQueue.get(requestKey);
      }

      // Store request promise
      const requestPromise = new Promise((resolve, reject) => {
        config._resolve = resolve;
        config._reject = reject;
      });

      requestQueue.set(requestKey, requestPromise);

      // Clean up after request completes
      setTimeout(() => {
        requestQueue.delete(requestKey);
      }, 5000);
    }

    // Manage concurrent requests
    if (activeRequests >= API_CONFIG.MAX_CONCURRENT_REQUESTS) {
      await new Promise((resolve) => {
        const checkQueue = () => {
          if (activeRequests < API_CONFIG.MAX_CONCURRENT_REQUESTS) {
            resolve();
          } else {
            setTimeout(checkQueue, 100);
          }
        };
        checkQueue();
      });
    }

    activeRequests++;

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.group(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
      console.log("Request ID:", config.metadata.requestId);
      console.log("Headers:", config.headers);
      if (config.data) console.log("Data:", config.data);
      if (config.params) console.log("Params:", config.params);
      console.groupEnd();
    }

    return config;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);

    // Calculate request duration
    const duration = Date.now() - response.config.metadata.startTime;

    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.group(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`
      );
      console.log("Request ID:", response.config.metadata.requestId);
      console.log("Status:", response.status);
      console.log("Duration:", `${duration}ms`);
      console.log("Data:", response.data);
      console.groupEnd();
    }

    // Resolve deduplicated requests
    if (response.config._resolve) {
      response.config._resolve(response);
    }

    // Add response metadata
    response.metadata = {
      duration,
      requestId: response.config.metadata.requestId,
      cached: false,
    };

    return response;
  },
  async (error) => {
    activeRequests = Math.max(0, activeRequests - 1);

    const originalRequest = error.config;
    const requestId = originalRequest?.metadata?.requestId;

    // Calculate request duration for failed requests
    const duration = originalRequest?.metadata?.startTime
      ? Date.now() - originalRequest.metadata.startTime
      : 0;

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.group(
        `❌ API Error: ${originalRequest?.method?.toUpperCase()} ${
          originalRequest?.url
        }`
      );
      console.log("Request ID:", requestId);
      console.log("Duration:", `${duration}ms`);
      console.log("Error:", error.message);
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }
      console.groupEnd();
    }

    // Reject deduplicated requests
    if (originalRequest?._reject) {
      originalRequest._reject(error);
    }

    // Handle specific error types
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - handle token refresh or redirect to login
          await handleUnauthorizedError(originalRequest);
          break;

        case 403:
          // Forbidden - user doesn't have permission
          error.message =
            data?.message || "Access denied. Insufficient permissions.";
          break;

        case 404:
          // Not found
          error.message =
            data?.message || "The requested resource was not found.";
          break;

        case 422:
          // Validation error
          error.message = data?.message || "Validation failed.";
          error.validationErrors = data?.errors || {};
          break;

        case 429:
          // Rate limited
          error.message = "Too many requests. Please try again later.";
          const retryAfter = error.response.headers["retry-after"];
          if (retryAfter) {
            error.retryAfter = parseInt(retryAfter) * 1000;
          }
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors - attempt retry
          if (
            retryConfig.retryCondition(error) &&
            shouldRetryRequest(originalRequest)
          ) {
            return retryRequest(originalRequest, error);
          }
          error.message =
            data?.message || "Server error occurred. Please try again.";
          break;

        default:
          error.message =
            data?.message || `Request failed with status ${status}`;
      }
    } else if (error.code === "ECONNABORTED") {
      // Timeout error
      error.message =
        "Request timeout. Please check your connection and try again.";
    } else if (error.message === "Network Error" || !isOnline) {
      // Network error
      error.message = "Network error. Please check your internet connection.";
      error.code = "NETWORK_ERROR";
    } else {
      // Unknown error
      error.message = error.message || "An unexpected error occurred.";
    }

    // Add error metadata
    error.metadata = {
      duration,
      requestId,
      timestamp: new Date().toISOString(),
    };

    return Promise.reject(error);
  }
);

// Handle 401 unauthorized errors
const handleUnauthorizedError = async (originalRequest) => {
  // Prevent infinite loops
  if (originalRequest._retry) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return;
  }

  originalRequest._retry = true;

  try {
    // Attempt token refresh
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const { token } = response.data;
    localStorage.setItem("token", token);

    // Retry original request with new token
    originalRequest.headers.Authorization = `Bearer ${token}`;
    return api.request(originalRequest);
  } catch (refreshError) {
    // Refresh failed - redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    throw refreshError;
  }
};

// Request retry logic
const shouldRetryRequest = (config) => {
  return !config._retryCount || config._retryCount < retryConfig.retries;
};

const retryRequest = async (originalRequest, error) => {
  originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

  const delay = retryConfig.retryDelay(originalRequest._retryCount);

  // Wait before retrying
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Log retry attempt in development
  if (process.env.NODE_ENV === "development") {
    console.log(
      `🔄 Retrying request (${originalRequest._retryCount}/${retryConfig.retries}):`,
      originalRequest.url
    );
  }

  return api.request(originalRequest);
};

// API helper functions
const apiHelpers = {
  // Check if error is retryable
  isRetryableError: (error) => {
    return retryConfig.retryCondition(error);
  },

  // Get error message from response
  getErrorMessage: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return error.message || "An unexpected error occurred";
  },

  // Check if request was successful
  isSuccessful: (response) => {
    return response.status >= 200 && response.status < 300;
  },

  // Extract data from response
  extractData: (response) => {
    return response.data?.data || response.data;
  },

  // Handle file upload with progress
  uploadFile: async (url, file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
  },

  // Download file with progress
  downloadFile: async (url, filename, onProgress) => {
    const response = await api.get(url, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    // Create download link
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return response;
  },

  // Cancel request
  createCancelToken: () => {
    return axios.CancelToken.source();
  },

  // Check network status
  isOnline: () => isOnline,

  // Subscribe to network status changes
  onNetworkChange: (callback) => {
    networkListeners.add(callback);
    return () => networkListeners.delete(callback);
  },

  // Clear request cache
  clearCache: () => {
    requestQueue.clear();
  },

  // Get request statistics
  getStats: () => {
    return {
      activeRequests,
      queuedRequests: requestQueue.size,
      isOnline,
    };
  },
};

// Request factory functions
const createRequest = (method) => {
  return async (url, data = null, config = {}) => {
    try {
      let response;

      if (["get", "delete", "head", "options"].includes(method.toLowerCase())) {
        response = await api[method](url, { ...config, params: data });
      } else {
        response = await api[method](url, data, config);
      }

      return response;
    } catch (error) {
      // Re-throw with additional context
      const enhancedError = new Error(apiHelpers.getErrorMessage(error));
      enhancedError.originalError = error;
      enhancedError.statusCode = error.response?.status;
      enhancedError.metadata = error.metadata;
      throw enhancedError;
    }
  };
};

// Create HTTP method shortcuts
const httpMethods = {
  get: createRequest("get"),
  post: createRequest("post"),
  put: createRequest("put"),
  patch: createRequest("patch"),
  delete: createRequest("delete"),
  head: createRequest("head"),
  options: createRequest("options"),
};

// Enhanced API instance with utilities
const enhancedApi = {
  ...api,
  ...httpMethods,
  ...apiHelpers,

  // Original axios instance for advanced usage
  axios: api,

  // Configuration
  config: API_CONFIG,

  // Set base URL dynamically
  setBaseURL: (baseURL) => {
    api.defaults.baseURL = baseURL;
    API_CONFIG.BASE_URL = baseURL;
  },

  // Set default headers
  setDefaultHeaders: (headers) => {
    Object.assign(api.defaults.headers, headers);
  },

  // Set timeout
  setTimeout: (timeout) => {
    api.defaults.timeout = timeout;
    API_CONFIG.TIMEOUT = timeout;
  },
};

export default enhancedApi;
