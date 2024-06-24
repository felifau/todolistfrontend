<template>
  <DefaultBackground>
    <h2 style="color: black">Task Manager</h2>
    <form @submit.prevent="editMode ? updateTask() : createTask()">
      <input type="text" placeholder="Enter the Title..." v-model="titleField" />
      <input type="date" placeholder="Enter the Deadline..." v-model="deadlineField" />
      <DefaultButton :disabled="!titleField || !deadlineField">
        {{ editMode ? 'Update Task' : 'Add Task' }}
      </DefaultButton>
      <DefaultButton v-if="editMode" type="button" @click="resetForm">
        Cancel Edit
      </DefaultButton>
    </form>

    <div>
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" v-for="list in lists" :key="list.id">
          <button class="nav-link" @click="loadTasks(list.id)">{{ list.name }}</button>
        </li>
      </ul>
    </div>

    <table>
      <thead>
      <tr>
        <th>Title</th>
        <th>Deadline</th>
        <th>Completed?</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="!tasks.length">
        <td colspan="4">No tasks added so far!</td>
      </tr>
      <tr v-for="task in tasks" :key="task.id">
        <td>{{ task.title }}</td>
        <td>{{ task.deadline }}</td>
        <td>{{ task.completed ? 'Yes' : 'No' }}</td>
        <td>
          <div class="action-buttons">
            <DefaultButton @click="editTask(task.id)">
              <i class="bi bi-pen"></i>
            </DefaultButton>
            <DefaultButton @click="removeTask(task.id)">
              <i class="bi bi-trash"></i>
            </DefaultButton>
            <DefaultButton v-if="!task.completed" @click="markAsCompleted(task.id)">
              <i class="bi bi-check"></i>
            </DefaultButton>
            <DefaultButton v-else @click="markAsUncompleted(task.id)">
              Mark Uncompleted
            </DefaultButton>
            <button
              :class="['btn', task.marked ? 'btn-danger' : 'btn-secondary']"
              @click="toggleMarkTask(task.id)">
              <i :class="task.marked ? 'bi bi-star-fill' : 'bi bi-star'"></i>
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <EditTaskModal
      v-if="showModal && currentTask"
      :task="currentTask"
      @close="closeModal"
      @update="handleUpdateTask"
    />
  </DefaultBackground>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from 'vue';
import axios from 'axios';
import { format } from 'date-fns';
import DefaultBackground from '@/components/DefaultBackground.vue';
import DefaultButton from '@/components/DefaultButton.vue';
import EditTaskModal from '@/components/EditTaskModal.vue';

interface Task {
  id: number;
  title: string;
  details: string;
  deadline: Date;
  completed: boolean;
  marked: boolean;
}

interface ListOfTasks {
  id: number;
  name: string;
}

export default defineComponent({
  methods: { format },
  components: { DefaultButton, DefaultBackground, EditTaskModal },
  setup() {
    const tasks: Ref<Task[]> = ref([]);
    const titleField = ref('');
    const detailsField = ref('');
    const deadlineField = ref();
    const completedField = ref(false);
    const markedField = ref(false);
    const editMode = ref(false);
    const editTaskId = ref<number | null>(null);
    const showModal = ref(false);
    const currentTask = ref<Task | null>(null);
    const lists: Ref<ListOfTasks[]> = ref([]);

    const url = import.meta.env.VITE_APP_BACKEND_BASE_URL;

    function createTask(): void {
      const task = {
        title: titleField.value,
        deadline: deadlineField.value,
        details: detailsField.value,
        completed: completedField.value,
        marked: markedField.value,
      };

      axios
        .post<Task>(`${url}/tasks`, task)
        .then((response) => {
          tasks.value.push(response.data);
          resetForm();
        })
        .catch((error) => {
          console.error('Error creating task:', error);
        });
    }

    function createListOfTasks(): void {
      const listOfTasks = {
        title: titleField.value
      };

      axios
        .post<ListOfTasks>(`${url}/lists`, listOfTasks)
        .then((response) => {
          lists.value.push(response.data);
          resetForm();
        })
        .catch((error) => {
          console.error('Error creating list of Tasks:', error);
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

    function requestListsOfTasks(): void {
      axios
        .get<ListOfTasks[]>(`${url}/lists`)
        .then((response) => {
          lists.value = response.data.map((ListOfTasks) => {
            return ListOfTasks;
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

    // completed and uncompleted requests
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
              t.completed = false;
            }
            return t;
          });
        })
        .catch((error) => {
          console.error('Error marking task as uncompleted:', error);
        });
    }

    function editTask(id: number): void {
      const task = tasks.value.find((t) => t.id === id);
      if (task) {
        currentTask.value = { ...task };
        showModal.value = true;
      }
    }

    function updateTask(): void {
      if (editTaskId.value !== null) {
        const updatedTask = {
          id: editTaskId.value,
          title: titleField.value,
          details: detailsField.value,
          deadline: deadlineField.value,
          completed: completedField.value,
          marked: markedField.value
        };

        axios
          .put<Task>(`${url}/tasks/${updatedTask.id}`, updatedTask)
          .then((response) => {
            tasks.value = tasks.value.map((t) => {
              if (t.id === updatedTask.id) {
                return response.data;
              }
              return t;
            });
            resetForm();
          })
          .catch((error) => {
            console.error('Error updating task:', error);
          });
      }
    }

    function handleUpdateTask(updatedTask: Task): void {
      axios
        .put<Task>(`${url}/tasks/${updatedTask.id}`, updatedTask)
        .then((response) => {
          tasks.value = tasks.value.map((t) => {
            if (t.id === updatedTask.id) {
              return response.data;
            }
            return t;
          });
          closeModal();
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }

    function closeModal(): void {
      showModal.value = false;
      currentTask.value = null;
    }

    function resetForm(): void {
      titleField.value = '';
      detailsField.value = '';
      deadlineField.value = '';
      completedField.value = false;
      editMode.value = false;
      editTaskId.value = null;
    }

    onMounted(() => {
      requestTasks();
      requestListsOfTasks();
    });

    return {
      tasks,
      lists,
      titleField,
      detailsField,
      deadlineField,
      completedField,
      editMode,
      editTaskId,
      showModal,
      currentTask,
      createTask,
      removeTask,
      requestTasks,
      markAsCompleted,
      markAsUncompleted,
      editTask,
      updateTask,
      handleUpdateTask,
      closeModal,
      resetForm,
      toggleMarkTask,
      loadTasks,
    };
  },
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

input {
  margin-bottom: 10px;
}

table {
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>
