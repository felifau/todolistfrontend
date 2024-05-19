<script lang="ts">
import { defineComponent } from 'vue'
import DefaultBackground from '@/components/DefaultBackground.vue'
import DefaultButton from '@/components/DefaultButton.vue'
import TasksTable from '@/components/TasksTable.vue'
import { Task } from '@/types/Task';

// type Task = { id: number; title: string; deadline: string; completed: boolean}
type TasksList = {
  tasks: Task[]
  titleField: string
  currentId: number
  deadline: string
  completed: boolean
}

export default defineComponent({
  name: 'ToDoList',
  components: { TasksTable, DefaultButton, DefaultBackground },
  props: ['title'],
  data(): TasksList {
    return {
      completed: false,
      currentId: 0,
      deadline: '',
      titleField: '',
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
      this.tasks.push({ id: this.currentId++, title, deadline, completed: false })
      // Clear input fields after adding a new task
      this.titleField = '';
      this.deadline = '';
    },
    onFormSubmitted(): void {
      this.addTask(this.titleField, this.deadline);
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
    <form @submit="onFormSubmitted" @submit.prevent>
      <input placeholder="Enter the Title..." v-model="titleField" />
      <input placeholder="Enter the Deadline..." v-model="deadline" />
      <DefaultButton @click="onFormSubmitted" :disabled="!titleField || !deadline">
        Add Task
      </DefaultButton>
    </form>
    <TasksTable
      :tasks="tasks"
      @mark-as-completed="markAsCompleted"
      @mark-as-uncompleted="markAsUncompleted"
      @delete-task="deleteTask"
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