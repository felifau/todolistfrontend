import axios from 'axios';
import { ref, type Ref } from 'vue';
import type { ListOfTasks } from '@/types/types.ts';

const url = import.meta.env.VITE_APP_BACKEND_BASE_URL;

export function useListOfTasksController() {
  const lists: Ref<ListOfTasks[]> = ref([]);

  const titleField = ref('');

  function createListOfTasks(list: Omit<ListOfTasks, 'id'>): void {
    axios
      .post<ListOfTasks>(`${url}/lists`, list)
      .then((response) => {
        lists.value.push(response.data);
        resetForm();
      })
      .catch((error) => {
        console.error('Error creating list of tasks:', error);
      });
  }

  function requestListsOfTasks(): void {
    axios
      .get<ListOfTasks[]>(`${url}/lists`)
      .then((response) => {
        lists.value = response.data;
      })
      .catch((error) => {
        console.error('Error fetching lists of tasks:', error);
      });
  }

  function deleteList(id: number): void {
    axios
      .delete<void>(`${url}/lists/${id}`)
      .then(() => {
        lists.value = lists.value.filter((list) => list.id !== id);
      })
      .catch((error) => {
        console.error('Error deleting list:', error);
      });
  }

  function updateList(updatedList: ListOfTasks): void {
    axios
      .put<ListOfTasks>(`${url}/lists/${updatedList.id}`, updatedList)
      .then((response) => {
        lists.value = lists.value.map((list) => {
          if (list.id === updatedList.id) {
            return response.data;
          }
          return list;
        });
      })
      .catch((error) => {
        console.error('Error updating list:', error);
      });
  }

  function resetForm(): void {
    requestListsOfTasks();
  }

  return {
    lists,
    createListOfTasks,
    requestListsOfTasks,
    deleteList,
    updateList,
  };
}