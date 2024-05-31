import APIBase from "@/utils/apiBase";

const base_url = 'https://fakestoreapi.com'

export const productApi = new APIBase({
    baseURL: `${base_url}/products`,
    // tokenKey: true,
    // debounceDelay: 1000,
  });