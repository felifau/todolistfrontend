<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from 'vue';
import axios from 'axios';

import DefaultBackground from '@/components/DefaultBackground.vue';
import DefaultButton from '@/components/DefaultButton.vue';
import TasksTable from '@/components/TasksTable.vue';

export default defineComponent({
  components: { TasksTable, DefaultButton, DefaultBackground },
  setup() {
    type Task = { id: number; title: string; details: string; deadline: string; completed: boolean }

    const tasks: Ref<Task[]> = ref([])
    const titleField = ref('')
    const detailsField = ref('')
    const deadlineField = ref('')
    const completedField = ref(false)

    const url = import.meta.env.VITE_APP_BACKEND_BASE_URL

    function createTask(): void {
      const task = {
        title: titleField.value,
        deadline: deadlineField.value,
        details: detailsField.value,
        completed: completedField.value,
      }

      axios
        .post<Task>(`${url}/task`, task)
        .then((response) => tasks.value.push(response.data))
        .catch((error) => console.log(error))
    }

    function requestTasks(): void {
      axios
        .get<Task[]>(`${url}/task`)
        .then((response) => (tasks.value = response.data))
        .catch((error) => console.log(error))
    }

    function removeTask(id: number): void {
      axios
        .delete<void>(`${url}/task/${id}`)
        .then(() => (tasks.value = tasks.value.filter((t) => t.id !== id)))
        .catch((error) => console.log(error))
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
      <input placeholder="Enter the Deadline..." v-model="deadlineField" />
      <DefaultButton @click="createTask()" :disabled="!titleField || !deadlineField">
        Add Task
      </DefaultButton>
    </form>
    <TasksTable
      :tasks="tasks"
      @delete-task="removeTask"
    />
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
</style>