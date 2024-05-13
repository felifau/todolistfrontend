<script lang="ts">
import { defineComponent } from 'vue'
import DefaultButton from '@/components/DefaultButton.vue';
import DefaultBackground from '@/components/DefaultBackground.vue'

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
  components: { DefaultButton, DefaultBackground },
  computed: {
    DefaultButton() {
      return DefaultButton
    }
  },
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
      this.addTask('WebTech M1', '28-04-2024' )
      this.addTask('WebTech M2', '12-05-2024' )
      this.addTask('Controlling Test 1', '26-04-2024' )
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
    },
    markAsUncompleted(task: Task): void {
      task.completed = false;
    }
  },
  mounted() {
    this.initTasks()
  }
})
</script>

<template>
  <DefaultBackground>
    <h2 style="color: black">{{ title }}</h2>
    <form @submit="onFormSubmitted()" @submit.prevent>
      <!-- "@submit.prevent" prevents a page refresh after submitting form -->
      <input placeholder="Enter the Title..." v-model="titleField" />
      <input placeholder="Enter the Deadline..." v-model="deadline" />
      <DefaultButton @click="onFormSubmitted" :disabled="!titleField || !deadline">
        Add Task
      </DefaultButton>
    </form>
    <table>
      <tr>
        <th>Title</th>
        <th>Deadline</th>
        <th>Completed?</th>
        <th>Actions</th>
      </tr>
      <tr v-if="!tasks.length">
        <td colspan="3">No tasks added so far!</td>
      </tr>
      <tr v-for="task in tasks" :key="task.id">
        <td>{{ task.title }}</td>
        <td>{{ task.deadline }}</td>
        <td>{{ task.completed }}</td>
        <td>
          <div class="action-buttons">
            <DefaultButton @click="markAsCompleted(task)" v-if="!task.completed">
              Complete
            </DefaultButton>
            <DefaultButton @click="markAsUncompleted(task)" v-if="task.completed">
              Uncomplete
            </DefaultButton>
            <DefaultButton @click="deleteTask(task)">Delete Task</DefaultButton>
          </div>
        </td>
      </tr>
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
</style>