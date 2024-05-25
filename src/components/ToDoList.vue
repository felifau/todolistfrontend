<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from 'vue';
import axios from 'axios';
import { format, parseISO } from 'date-fns'
import DefaultBackground from '@/components/DefaultBackground.vue';
import DefaultButton from '@/components/DefaultButton.vue'

export default defineComponent({
  components: { DefaultButton, DefaultBackground },
  setup() {
    type Task = { id: number; title: string; details: string; deadline: string; completed: boolean }

    const tasks: Ref<Task[]> = ref([])
    const titleField = ref('')
    const detailsField = ref('')
    const deadlineField = ref('')
    const completedField = ref(false)

    const url = import.meta.env.VITE_APP_BACKEND_BASE_URL;

    function createTask(): void {
      const task = {
        title: titleField.value,
        deadline: deadlineField.value,
        details: detailsField.value,
        completed: completedField.value,
      }

      axios
        .post<Task>(`${url}/`, task)
        .then((response) => tasks.value.push(response.data))
        .catch((error) => console.log(error))
    }

    function requestTasks(): void {
      axios
        .get<Task[]>(`${url}/`)
        .then((response) => {
          tasks.value = response.data.map(task => ({
            ...task,
            deadline: format(parseISO(task.deadline), 'yyyy-MM-dd')
          }));
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
        });
    }

    function removeTask(id: number): void {
      axios
        .delete<void>(`${url}/${id}`)
        .then(() => (tasks.value = tasks.value.filter((t) => t.id !== id)))
        .catch((error) => console.log(error));
    }

    onMounted(() => requestTasks())

    return {
      tasks,
      titleField,
      detailsField,
      deadlineField,
      completedField,
      createTask,
      removeTask,
      requestTasks,
    }
  },
})
</script>

<template>
  <DefaultBackground>
    <h2 style="color: black">Task Manager</h2>
    <form @submit="createTask()" @submit.prevent>
      <input type="text" placeholder="Enter the Title..." v-model="titleField" />
      <input type="date" placeholder="Enter the Deadline..." v-model="deadlineField" />
      <DefaultButton @click="createTask()" :disabled="!titleField || !deadlineField">
        Add Task
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
        <td>{{ task.deadline }}</td>
        <td>{{ task.completed ? 'Yes' : 'No' }}</td>
        <td>
          <div class="action-buttons">
            <DefaultButton @click="removeTask(task.id)">Delete Task</DefaultButton>
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
