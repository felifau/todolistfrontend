<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import TaskRow from '@/components/TaskRow.vue'

export default defineComponent({
  name: 'TasksTable',
  components: { TaskRow },
  props: {
    tasks: {
      type: Array as PropType<Array<{ id: number; title: string; details: string; deadline: string; completed: boolean }>>,
      required: true
    }
  },
  methods: {
    markAsCompleted(task: { id: number; title: string; details: string; deadline: string; completed: boolean }) {
      this.$emit('mark-as-completed', task);
    },
    markAsUncompleted(task: { id: number; title: string; details: string; deadline: string; completed: boolean }) {
      this.$emit('mark-as-uncompleted', task);
    },
    deleteTask(task: { id: number; title: string; details: string; deadline: string; completed: boolean }) {
      this.$emit('delete-task', task);
    }
  }
})
</script>

<template>
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
    <TaskRow
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @mark-as-completed="markAsCompleted"
      @mark-as-uncompleted="markAsUncompleted"
      @delete-task="deleteTask"
    />
    </tbody>
  </table>
</template>

<style scoped>
/* You can add your styles here */
</style>