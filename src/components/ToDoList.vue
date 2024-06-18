<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from 'vue';
import axios from 'axios';
import { format } from 'date-fns';
import DefaultBackground from '@/components/DefaultBackground.vue';
import DefaultButton from '@/components/DefaultButton.vue';

export default defineComponent({
  components: { DefaultButton, DefaultBackground },
  setup() {
    type Task = { id: number; title: string; details: string; deadline: Date; completed: boolean }

    const tasks: Ref<Task[]> = ref([])
    const titleField = ref('')
    const detailsField = ref('')
    const deadlineField = ref('')
    const completedField = ref(false)
    const editMode = ref(false)
    const editTaskId = ref<number | null>(null)

    const url = import.meta.env.VITE_APP_BACKEND_BASE_URL;

    function createTask(): void {
      const task = {
        title: titleField.value,
        deadline: deadlineField.value,
        details: detailsField.value,
        completed: completedField.value,
      }

      console.log('Creating task:', task);

      axios
        .post<Task>(`${url}/tasks`, task)
        .then((response) => {
          console.log('Task created:', response.data);
          tasks.value.push(response.data);
        })
        .catch((error) => {
          console.error('Error creating task:', error);
        });
    }

    function requestTasks(): void {
      axios
        .get<Task[]>(`${url}/tasks`)
        .then((response) => {
          tasks.value = response.data.map(task => {
            task.deadline = new Date(task.deadline);
            return task;
          });
          console.log('Tasks fetched:', tasks.value);
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
          console.log('Task removed:', id);
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
          console.log('Task marked as completed:', id);
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
          console.log('Task marked as uncompleted:', id);
        })
        .catch((error) => {
          console.error('Error marking task as uncompleted:', error);
        });
    }

    function editTask(id: number): void {
      const task = tasks.value.find(t => t.id === id);
      if (task) {
        titleField.value = task.title;
        detailsField.value = task.details;
        deadlineField.value = format(task.deadline, 'dd-MM-yyyy');
        completedField.value = task.completed;
        editTaskId.value = id;
        editMode.value = true;
      }
    }

    function updateTask(): void {
      if (editTaskId.value === null) return;

      const task = {
        title: titleField.value,
        deadline: deadlineField.value,
        details: detailsField.value,
        completed: completedField.value,
      }

      axios
        .put<Task>(`${url}/tasks/${editTaskId.value}`, task)
        .then((response) => {
          tasks.value = tasks.value.map(t => {
            if (t.id === editTaskId.value) {
              return response.data;
            }
            return t;
          });
          resetForm();
          console.log('Task updated:', response.data);
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }

    function resetForm(): void {
      titleField.value = '';
      detailsField.value = '';
      deadlineField.value = '';
      completedField.value = false;
      editMode.value = false;
      editTaskId.value = null;
    }

    function formatDate(date: Date): string {
      return format(date, 'dd.MM.yy');
    }

    onMounted(() => {
      console.log('Component mounted, fetching tasks');
      requestTasks();
    });

    return {
      tasks,
      titleField,
      detailsField,
      deadlineField,
      completedField,
      editMode,
      editTaskId,
      createTask,
      removeTask,
      requestTasks,
      markAsCompleted,
      markAsUncompleted,
      editTask,
      updateTask,
      resetForm,
      formatDate,
    }
  },
})
</script>

<template>
  <DefaultBackground>
    <h2 style="color: black">Task Manager</h2>
    <form @submit.prevent="editMode ? updateTask() : createTask()">
      <input type="text" placeholder="Enter the Title..." v-model="titleField" />
      <input type="date" placeholder="Enter the Deadline..." v-model="deadlineField" />
      <DefaultButton :disabled="!titleField || !deadlineField">
        {{ editMode ? 'Update Task' : 'Add Task' }}
      </DefaultButton>
      <DefaultButton v-if="editMode" @click="resetForm">
        Cancel Edit
      </DefaultButton>
    </form>
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
        <td>{{ formatDate(task.deadline) }}</td>
        <td>{{ task.completed ? 'Yes' : 'No' }}</td>
        <td>
          <div class="action-buttons">
            <DefaultButton @click="editTask(task.id)">Edit Task</DefaultButton>
            <DefaultButton @click="removeTask(task.id)">Delete Task</DefaultButton>
            <DefaultButton v-if="!task.completed" @click="markAsCompleted(task.id)">
              Mark Completed
            </DefaultButton>
            <DefaultButton v-else @click="markAsUncompleted(task.id)">
              Mark Uncompleted
            </DefaultButton>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </DefaultBackground>
</template>

<style scoped>
form {
  display: flex;
  margin: 0 -16px;

  * {
    margin: 16px;
  }

  input {
    flex-grow: 1;
  }
}

table {
  margin: 8px -8px 0;

  th,
  td {
    padding: 8px;
  }
}

button {
  border-radius: 10px;
  padding: 8px;
  border: none;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>
