<script lang="ts">
import { defineComponent } from 'vue'

type Task = { id: number; title: string; deadline: string; completed: boolean}
type TasksList = {
  tasks: Task[]
  titleField: string
  currentId: number
  deadline: string
  completed: boolean
}

export default defineComponent({
  name: 'ToDoList',
  props: ['title'],
  data(): TasksList {
    return {
      titleField: '',
      currentId: 1,
      deadline: '',
      completed: false,
      tasks: []
    }
  },
  methods: {
    initTasks(): void {
      this.addTask('WebTech M1', '31-05-2024' )
      this.addTask('WebTech M2', '31-05-2024' )
      this.addTask('Controlling Test 1', '31-05-2024' )
    },
    addTask(title: string, deadline: string): void {
      if (!title || !deadline) return; // checks if the title and deadline are empty
      this.tasks.push({ title, id: this.currentId++, deadline, completed: false })
      // Clear input fields after adding a new task
      this.titleField = '';
      this.deadline = '';
    },
    onFormSubmitted(): void {
      this.addTask(this.titleField.valueOf(), this.deadline.valueOf())
    },
    deleteTask(task: Task): void {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    },
    markAsCompleted(task: Task): void {
    task.completed = true;
    }
  },
  mounted() {
    this.initTasks()
  }
})
</script>

<template>
  <div id="background" >
    <h2 style="color: white">{{ title }}</h2>
    <form @submit="onFormSubmitted()" @submit.prevent>
      <!-- "@submit.prevent" prevents a page refresh after submitting form -->
      <input type="text" placeholder="Title" v-model="titleField" />
      <input type="text" placeholder="Deadline" v-model="deadline" />
      <button :disabled="!titleField || !deadline">Add Task</button>
    </form>
    <table>
      <tr>
        <th id="text">Title</th>
        <th id="text">Deadline</th>
        <th id="text">Completed?</th>
        <th id="text">Actions</th>
      </tr>
      <tr v-if="!tasks.length">
        <td colspan="3">No tasks added so far!</td>
      </tr>
      <tr v-for="task in tasks" :key="task.id">
        <td id="text">{{ task.title }}</td>
        <td id="text">({{ task.deadline }})</td>
        <td id="text">({{ task.completed }})</td>
        <td>
          <button @click="markAsCompleted(task)">Mark as Completed</button>
          <button @click="deleteTask(task)">Delete Task</button>
        </td>
      </tr>
    </table>
  </div>
</template>


<style scoped>
#background {
  background-color: lightseagreen;
}
#text {
  color: white;
}

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