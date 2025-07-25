import { apiService } from './api';
class TaskService {
  async getTasks() {
    return await apiService.get('/tasks');
  }
  async createTask(taskData) {
    return await apiService.post('/tasks', taskData);
  }
  async updateTask(taskId, taskData) {
    return await apiService.put(`/tasks/${taskId}`, taskData);
  }
  async deleteTask(taskId) {
    return await apiService.delete(`/tasks/${taskId}`);
  }
  async toggleTaskComplete(taskId) {
    return await apiService.put(`/tasks/${taskId}/toggle`);
  }
}

export const taskService = new TaskService();