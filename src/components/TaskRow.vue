<script lang="ts">
import DefaultButton from '@/components/DefaultButton.vue'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'TaskRow',
  components: { DefaultButton },
  props: {
    task: {
      type: Object as PropType<{ id: number; title: string; details: string; deadline: string; completed: boolean }>,
      required: true
    }
  },
  methods: {
    markAsCompleted() {
      this.$emit('mark-as-completed', this.task);
    },
    markAsUncompleted() {
      this.$emit('mark-as-uncompleted', this.task);
    },
    deleteTask() {
      this.$emit('delete-task', this.task);
    }
  }
})
</script>

<template>
  <tr>
    <td>{{ task.title }}</td>
    <td>{{ task.deadline }}</td>
    <td>{{ task.completed ? 'Yes' : 'No' }}</td>
    <td>
      <div class="action-buttons">
        <DefaultButton @click="markAsCompleted" v-if="!task.completed">Complete</DefaultButton>
        <DefaultButton @click="markAsUncompleted" v-if="task.completed">Uncomplete</DefaultButton>
        <DefaultButton @click="deleteTask">Delete Task</DefaultButton>
      </div>
    </td>
  </tr>
</template>

<style scoped>
/* Add any styles specific to the TaskRow component here */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>