import { v4 as uuidv4 } from 'uuid';

// Simulação de armazenamento local
const fileStore: Map<string, { data: string; type: string }> = new Map();

export const storageService = {
  // Upload de arquivo
  upload: async (file: File, path: string): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileId = uuidv4();
        const fileKey = `${path}/${fileId}`;
        fileStore.set(fileKey, {
          data: reader.result as string,
          type: file.type
        });
        resolve(fileKey);
      };
      reader.readAsDataURL(file);
    });
  },

  // Download de arquivo
  download: async (path: string): Promise<Blob | null> => {
    const fileData = fileStore.get(path);
    if (!fileData) return null;

    const response = await fetch(fileData.data);
    return response.blob();
  },

  // Remoção de arquivo
  remove: async (path: string): Promise<boolean> => {
    return fileStore.delete(path);
  },

  // Obter URL pública (simulada)
  getPublicUrl: (path: string): string => {
    const fileData = fileStore.get(path);
    return fileData ? fileData.data : '';
  }
};