// 🏢 Insurance Service - Gestión de aseguradoras y pólizas
import apiService from "./api";

class InsuranceService {
  // ASEGURADORAS
  async getInsuranceCompanies(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/insurance/companies", queryParams);
    } catch (error) {
      console.error("Error fetching insurance companies:", error);
      throw error;
    }
  }

  async getInsuranceCompanyById(id) {
    try {
      return await apiService.get(`/insurance/companies/${id}`);
    } catch (error) {
      console.error("Error fetching insurance company:", error);
      throw error;
    }
  }

  async createInsuranceCompany(companyData) {
    try {
      return await apiService.post("/insurance/companies", companyData);
    } catch (error) {
      console.error("Error creating insurance company:", error);
      throw error;
    }
  }

  async updateInsuranceCompany(id, companyData) {
    try {
      return await apiService.put(`/insurance/companies/${id}`, companyData);
    } catch (error) {
      console.error("Error updating insurance company:", error);
      throw error;
    }
  }

  async deleteInsuranceCompany(id) {
    try {
      return await apiService.delete(`/insurance/companies/${id}`);
    } catch (error) {
      console.error("Error deleting insurance company:", error);
      throw error;
    }
  }

  // PÓLIZAS
  async getPolicies(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/insurance/policies", queryParams);
    } catch (error) {
      console.error("Error fetching policies:", error);
      throw error;
    }
  }

  async getPolicyById(id) {
    try {
      return await apiService.get(`/insurance/policies/${id}`);
    } catch (error) {
      console.error("Error fetching policy:", error);
      throw error;
    }
  }

  async createPolicy(policyData) {
    try {
      return await apiService.post("/insurance/policies", policyData);
    } catch (error) {
      console.error("Error creating policy:", error);
      throw error;
    }
  }

  async updatePolicy(id, policyData) {
    try {
      return await apiService.put(`/insurance/policies/${id}`, policyData);
    } catch (error) {
      console.error("Error updating policy:", error);
      throw error;
    }
  }

  async deletePolicy(id) {
    try {
      return await apiService.delete(`/insurance/policies/${id}`);
    } catch (error) {
      console.error("Error deleting policy:", error);
      throw error;
    }
  }
}

const insuranceService = new InsuranceService();
export default insuranceService;
