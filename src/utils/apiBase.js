import axios from "axios";
import Swal from "sweetalert2";

export default class APIBase {
  // Constructor to initialize APIBase with custom configuration
  constructor(config) {
    if (!config.baseURL) throw new Error("Base URL cannot be empty");
    // if (!config.defaultHeaders) throw new Error('Default headers cannot be empty');
    // console.log('HEADERS: ',JSON.stringify(config))

    // Configuration defaults are set here, allowing for customization
    this.config = {
      baseURL: config.baseURL, // Base URL for API requests
      defaultHeaders: config.defaultHeaders || {
        "Content-Type": "application/json",
      }, // Default headers for all requests
      timeout: config.timeout || 30000, // Request timeout in milliseconds
      tokenKey: config.tokenKey || false, // Key for storing JWT token in local storage
      retryLimit: config.retryLimit || 1, // Number of retries for failed requests
      debounceDelay: config.debounceDelay || 0,
      // Delay for debouncing requests
      // Additional configurable parameters can be added here
    };


    // Creating an axios instance with the provided configuration
    this.apiClient = axios.create({
      baseURL: this.config.baseURL,
      headers: this.config.defaultHeaders,
      timeout: this.config.timeout,
    });

    // Bind methods to ensure 'this' context
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);

    // Interceptors for handling request and response
    this.apiClient.interceptors.request.use((config) => {
      // Your request interception logic here
      // E.g., adding a token
      this.addToken();
      return config;
    }, error => {
      // Do something with request error
      return Promise.reject(error);
    });


    // this.apiClient.interceptors.response.use(
    //     this.handleSuccessResponse,
    //     this.handleErrorResponse
    // );

    // Debounce Settings
    if (this.config.debounceDelay) {
      // Apply debouncing only if debounceDelay is configured
      this.get = this.debounceRequest(this.get);
      this.post = this.debounceRequest(this.post);
      // ... similarly for put, patch, delete
    }
  }

  addToken(token) {
    if (token) {
      this.config.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Method to handle request interception, e.g., to add auth tokens
  handleRequestInterception = (config) => {
    this.addToken();
  };

  // Method to handle successful responses
  handleSuccessResponse = (response) => {
    return response;
  };

  extract_error_message = (data) => {
    // Check if the data is an object and handle it accordingly
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Handle the specific case where data contains a nested response object
      if (data.response && typeof data.response === 'object') {
        const { code, invalid, message } = data.response;
        let invalidMessages = '';
        if (Array.isArray(invalid)) {
          invalidMessages = invalid?.map(item => `ID: ${item.id}, Year: ${item.year}`).join('; ');
        }
        return `${message}, Invalid: ${invalidMessages}`;
      }
  
      return Object.entries(data)
        .map(([key, value]) => {
          // Assume value is an array of messages; join them if there are many
          const messages = Array.isArray(value) ? value.join(', ') : value;
          return `${messages}`;
        })
        .join('\n'); // Separate multiple errors with a semicolon and space
    }
  
    // Default generic error message
    return data?.error || data?.detail || data?.details || data?.message || data?.response?.message || "An unexpected error occurred";
  };

  handleErrorResponse = (error) => {
    const { response } = error;
  
    if (response) {
      const { status, data, config } = response;
      const errorMessage = this.extract_error_message(data);  // Use the new function here
  
      console.error("Error status:", status, errorMessage);
      console.error("Error data:", data);
      console.error("Error config:", config);
  
      // Handling errors based on the HTTP method used
      if (['post', 'delete', 'patch', 'put'].includes(config.method.toLowerCase())) {
        switch (status) {
          case 404:
            Swal.fire("Not Found", errorMessage, "error");
            throw error;
          case 403:
            Swal.fire("Permission Denied", errorMessage, "error");
            throw error;
          case 500:
            Swal.fire("Server Error", errorMessage, "error");
            throw error;
          case 400:
            Swal.fire("Bad Request", errorMessage, "error");
            throw error;
          default:
            Swal.fire("Error", errorMessage, "error");
        }
      }
    } else if (error.request) {
      console.error("Error request:", error.request);
      Swal.fire("Network Error", "No response was received", "error");
    } else {
      console.error("Error message:", error.message);
      Swal.fire("Error", error.message || "Something went wrong", "error");
    }
  
    // return Promise.reject(error);
  };

  // General method to make an API request
  async makeRequest(
    method,
    endpoint = "",
    data = null,
    headers = {},
    params = ""
  ) {
    const fullEndpoint = endpoint || this.config.baseURL;
    const effectiveHeaders = { ...this.config.defaultHeaders, ...headers };

    const debouncedFunc = this.debounceRequest(async () => {
      const response = await this.apiClient({
        method,
        url: fullEndpoint + params,
        data,
        headers: effectiveHeaders,
      });
      return response.data;
    });

    try {
      return await debouncedFunc();
    } catch (error) {
      this.handleErrorResponse(error);
      if(error?.response?.status == 404){
        return error;
      } else{
        throw error;
      }
    }
  }

  // Specific methods for different HTTP verbs
  get(endpoint = "", params = "", headers = {}) {
    if (this.config.tokenKey) {
      // console.log("TOKEN KEY");
      headers = this.buildAuthHeader(this.getToken());
    }

    return this.makeRequest("get", endpoint, null, headers, params);
  }

  post(endpoint = "", data, headers = {}) {
    if (this.config.tokenKey) headers = this.buildAuthHeader(this.getToken());

    return this.makeRequest("post", endpoint, data, headers);
  }

  put(endpoint = "", data, headers = {}) {
    if (this.config.tokenKey) headers = this.buildAuthHeader(this.getToken());
    return this.makeRequest("put", endpoint, data, headers);
  }

  patch(endpoint = "", data, headers = {}) {
    if (this.config.tokenKey) headers = this.buildAuthHeader(this.getToken());
    return this.makeRequest("patch", endpoint, data, headers);
  }

  delete(endpoint = "", headers = {}) {
    if (this.config.tokenKey) headers = this.buildAuthHeader(this.getToken());
    return this.makeRequest("delete", endpoint, null, headers);
  }

  // Methods for token management in local storage
  getToken() {
    return localStorage.getItem("access_token");
  }

  setToken(token) {
    localStorage.setItem(this.config.tokenKey, token);
  }

  removeToken() {
    localStorage.removeItem(this.config.tokenKey);
  }

  // Utility method to format dates
  formatDate(date) {
    return new Date(date).toLocaleDateString("en-US");
  }

  // Utility method to parse JSON safely
  parseJSON(response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      return null;
    }
  }

  // Utility method to serialize URL parameters
  serializeParams(params) {
    return Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
  }

  // Method to check if response status is successful
  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(response.statusText);
    }
  }

  // Method to extract error message from response
  extractErrorMessage(error) {
    return error.response ? error.response.data.message : error.message;
  }

  // Method to build Authorization header
  buildAuthHeader(token) {
    return { Authorization: `Bearer ${token}` };
    // return {
    //   Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzNzE3NTI1LCJpYXQiOjE3MDUwNzc1MjUsImp0aSI6IjM2YzEzMTcwZjE5MTRmMWQ4ZThiYjZiY2ZhZGU4OTE1IiwidXNlcl9pZCI6Mn0.0Orq5oq6NsGmOi4KDkWofJlWU-CYnpji9HYRi3euhtw`,
    // };
  }

  // Utility method for logging requests
  logRequest(url, method, data) {
    // console.log(`Requesting ${method.toUpperCase()} ${url} with data:`, data);
  }

  // Debounce utility to prevent rapid firing of requests
  debounceRequest(func) {
    let inDebounce;
    return async (...args) => {
      clearTimeout(inDebounce);
      return new Promise((resolve, reject) => {
        inDebounce = setTimeout(async () => {
          try {
            resolve(await func(...args));
          } catch (error) {
            reject(error);
          }
        }, this.config.debounceDelay);
      });
    };
  }

  // Method for validating response schema (implementation pending)
  validateResponseSchema(response, schema) {
    // Implement schema validation logic if required
  }

  // Interceptor for token refresh logic
  tokenRefreshInterceptor(apiClient, refreshToken) {
    apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          // Implement token refresh logic here
          return apiClient(originalRequest);
        }
        return Promise.reject(error);
      }
    );
  }
}
