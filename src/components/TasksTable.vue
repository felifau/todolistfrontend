<script lang="ts">
import { defineComponent } from 'vue'
import TaskRow from '@/components/TaskRow.vue'

export default defineComponent({
  name: 'TasksTable',
  components: { TaskRow },
  props: {
    task: Object,
    tasks: {
      type: Array,
      required: true
    }
  },
  methods: {
    markAsCompleted(task) {
      this.$emit('mark-as-completed', task);
    },
    markAsUncompleted(task) {
      this.$emit('mark-as-uncompleted', task);
    },
    deleteTask(task) {
      this.$emit('delete-task', task);
    }
  }
})
</script>

<template>
  <table>
    <tr>
      <th>Title</th>
      <th>Deadline</th>
      <th>Completed?</th>
      <th>Actions</th>
    </tr>
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
  </table>
</template>

<style scoped>

</style>