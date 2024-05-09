<script lang="ts">
import { defineComponent } from 'vue'

type Task = { id: number; title: string }
type TasksList = {
  tasks: Task[]
  titleField: string
  currentId: number
}

export default defineComponent({
  name: 'ToDoListOptionsApi',
  props: ['title'],
  data(): TasksList {
    return {
      titleField: '',
      currentId: 1,
      tasks: []
    }
  },
  methods: {
    initTasks(): void {
      this.addTask('WebTech M1')
      this.addTask('WebTech M2')
      this.addTask('Controlling Test 1')
    },
    addTask(title: string): void {
      this.tasks.push({ title, id: this.currentId++ })
    },
    onFormSubmitted(): void {
      this.addTask(this.titleField.valueOf())
    }
  },
  mounted() {
    this.initTasks()
  }
})
</script>

<template>
  <h2>{{ title }}</h2>
  <form @submit="onFormSubmitted()" @submit.prevent>
    <!-- "@submit.prevent" prevents a page refresh after submitting form -->
    <input type="text" placeholder="Title" v-model="titleField" />
    <button>Add Task</button>
  </form>
  <hr />
  <table>
    <tr>
      <th>Title</th>
      <th>ID</th>
    </tr>
    <tr v-if="!tasks.length">
      <td colspan="3">No tasks added so far!</td>
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
}
</style>