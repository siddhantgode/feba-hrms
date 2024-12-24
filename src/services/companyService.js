import axios from "axios";

const API_URL = "http://localhost:5000/api/companies";

export const getCompanies = async () => {
  return await axios.get(API_URL);
};

export const addCompany = async (company) => {
  return await axios.post(API_URL, company);
};

export const updateCompany = async (id, company) => {
  return await axios.put(`${API_URL}/${id}`, company);
};

export const deleteCompany = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
