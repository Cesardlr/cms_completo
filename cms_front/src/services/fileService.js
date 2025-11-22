// 📁 File Service - Gestión de archivos y asociaciones
import apiService from "./api";

class FileService {
  // ARCHIVOS
  async getFiles(params = {}) {
    try {
      return await apiService.get("/files", params);
    } catch (error) {
      console.error("Error fetching files:", error);
      throw error;
    }
  }

  async getFileById(id) {
    try {
      return await apiService.get(`/files/${id}`);
    } catch (error) {
      console.error("Error fetching file:", error);
      throw error;
    }
  }

  async uploadFile(fileData) {
    try {
      return await apiService.post("/files", fileData);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async updateFile(id, fileData) {
    try {
      return await apiService.put(`/files/${id}`, fileData);
    } catch (error) {
      console.error("Error updating file:", error);
      throw error;
    }
  }

  async deleteFile(id) {
    try {
      return await apiService.delete(`/files/${id}`);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  // ASOCIACIONES DE ARCHIVOS
  async getFileAssociations(params = {}) {
    try {
      return await apiService.get("/files/associations", params);
    } catch (error) {
      console.error("Error fetching file associations:", error);
      throw error;
    }
  }

  async getFileAssociationById(id) {
    try {
      return await apiService.get(`/files/associations/${id}`);
    } catch (error) {
      console.error("Error fetching file association:", error);
      throw error;
    }
  }

  async createFileAssociation(associationData) {
    try {
      return await apiService.post("/files/associations", associationData);
    } catch (error) {
      console.error("Error creating file association:", error);
      throw error;
    }
  }

  async updateFileAssociation(id, associationData) {
    try {
      return await apiService.put(`/files/associations/${id}`, associationData);
    } catch (error) {
      console.error("Error updating file association:", error);
      throw error;
    }
  }

  async deleteFileAssociation(id) {
    try {
      return await apiService.delete(`/files/associations/${id}`);
    } catch (error) {
      console.error("Error deleting file association:", error);
      throw error;
    }
  }
}

const fileService = new FileService();
export default fileService;
