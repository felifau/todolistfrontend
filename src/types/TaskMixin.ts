import axios from 'axios';
import { ref, type Ref } from 'vue';
import { format } from 'date-fns';
import type { Task } from '@/types/types';

const url = import.meta.env.VITE_APP_BACKEND_BASE_URL;

export function useTaskController() {
  const tasks: Ref<Task[]> = ref([]);

  const titleField = ref('');
  const detailsField = ref('');
  const deadlineField = ref();
  const completedField = ref(false);
  const markedField = ref(false);
  const listOfTasksId = ref();

  // addTask on Backend
  function createTask(listId: number): void {
    const task = {
      title: titleField.value,
      deadline: deadlineField.value,
      details: detailsField.value,
      completed: completedField.value,
      marked: markedField.value,
      listOfTasksId: listId,
    };

    axios
      .post<Task>(`${url}/tasks/{id}/task`, task)
        .then((response) => {
          tasks.value.push(response.data);
          resetForm();
        })
        .catch((error) => {
          console.error('Error creating task:', error);
        });
  }

  function loadTasks(listId: number): void {
    axios
      .get<Task[]>(`${url}/tasks/${listId}/getListOfTasks`)
      .then((response) => {
        tasks.value = response.data.map((task) => {
          task.deadline = new Date(task.deadline);
          return task;
        });
      })
      .catch((error) => {
        console.error(`Error loading tasks for list ${listId}:`, error);
      });
  }

  function requestTasks(): void {
    axios
      .get<Task[]>(`${url}/tasks`)
      .then((response) => {
        tasks.value = response.data.map((task) => {
          task.deadline = new Date(task.deadline);
          return task;
        });
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }

  function removeTask(id: number): void {
    axios
      .delete<void>(`${url}/tasks/${id}`)
      .then(() => {
        tasks.value = tasks.value.filter((t) => t.id !== id);
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  }

  function markAsCompleted(id: number): void {
    axios
      .post<void>(`${url}/tasks/${id}/complete`)
      .then(() => {
        tasks.value = tasks.value.map((t) => {
          if (t.id === id) {
            t.completed = true;
          }
          return t;
        });
      })
      .catch((error) => {
        console.error('Error marking task as completed:', error);
      });
  }

  function markAsUncompleted(id: number): void {
    axios
      .post<void>(`${url}/tasks/${id}/uncomplete`)
      .then(() => {
        tasks.value = tasks.value.map((t) => {
          if (t.id === id) {
            t.completed = false;
          }
          return t;
        });
      })
      .catch((error) => {
        console.error('Error marking task as uncompleted:', error);
      });
  }

  function toggleMarkTask(id: number): void {
    const task = tasks.value.find((t) => t.id === id);
    if (task) {
      if (task.marked) {
        unmarkTask(task.id);
      } else {
        markTask(task.id);
      }
    }
  }

  function markTask(id: number): void {
    axios
      .put<void>(`${url}/tasks/${id}/mark`)
      .then(() => {
        tasks.value = tasks.value.map((t) => {
          if (t.id === id) {
            t.marked = true;
          }
          return t;
        });
      })
      .catch((error) => {
        console.error('Error marking task as completed:', error);
      });
  }

  function unmarkTask(id: number): void {
    axios
      .put<void>(`${url}/tasks/${id}/unmark`)
      .then(() => {
        tasks.value = tasks.value.map((t) => {
          if (t.id === id) {
            t.marked = false;
          }
          return t;
        });
      })
      .catch((error) => {
        console.error('Error marking task as uncompleted:', error);
      });
  }

  function updateTask(updatedTask: Task): void {
    axios
      .put<Task>(`${url}/tasks/${updatedTask.id}`, updatedTask)
      .then((response) => {
        tasks.value = tasks.value.map((t) => {
          if (t.id === updatedTask.id) {
            return response.data;
          }
          return t;
        });
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  }

  function resetForm(): void {
    requestTasks();
  }

  return {
    tasks,
    createTask,
    loadTasks,
    requestTasks,
    removeTask,
    markAsCompleted,
    markAsUncompleted,
    toggleMarkTask,
    updateTask,
  };
}