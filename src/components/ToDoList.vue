<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

defineProps<{ title: string }>()

type Task = { id: number; title: string}

// ; details: string; deadline: Date; completed: boolean

const tasks: Ref<Task[]> = ref([])
const titleField = ref('')
let currentId = 1

function initTasks(): void {
  addTask('WebTech M1')
  addTask('WebTech M2')
  addTask('Controlling Test 1')
}

function addTask(name: string): void {
  tasks.value.push({ title: name, id: currentId++ })
}

function onFormSubmitted(): void {
  addTask(titleField.value)
}

// Lifecycle Hook
onMounted(() => {
  initTasks()
})
</script>

<template>
  <h2>{{ title }}</h2>
  <form @submit="onFormSubmitted()" @submit.prevent>
    <!-- "@submit.prevent" prevents a page refresh after submitting form -->
    <input type="text" placeholder="Name" v-model="titleField" />
  </form>
  <hr />
  <table>
    <tr>
      <th>Title</th>
      <th>ID</th>
    </tr>
    <tr v-if="!tasks.length">
      <td colspan="2">No tasks added so far!</td>
    </tr>
    <tr v-for="task in tasks" :key="task.id">
      <td>{{ task.title }}</td>
      <td>({{ task.id }})</td>
    </tr>
  </table>
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
  border-radius: 48px;
  padding: 8px;
  border: none;
  cursor: pointer;

  &.delete {
    background: darkred;
    color: white;
  }
}
</style>