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
    <tr v-if="sortedTasks.length === 0">
      <td colspan="4">No tasks added so far!</td>
    </tr>
    <tr v-for="task in sortedTasks" :key="task.id">
      <td>{{ task.title }}</td>
      <td>{{ formatDate(task.deadline, 'MM/dd/yyyy') }}</td>
      <td>{{ task.completed ? 'Yes' : 'No' }}</td>
      <td>
        <div class="action-buttons">
          <DefaultButton @click="editTask(task.id)" title="Edit your Task!">
            <i class="bi bi-pen"></i>
          </DefaultButton>
          <DefaultButton @click="removeTask(task.id)" title="Deletes your Task :<(">
            <i class="bi bi-trash"></i>
          </DefaultButton>
          <DefaultButton v-if="!task.completed" @click="markAsCompleted(task.id)" title="Mark the task as completed">
            <i class="bi bi-circle"></i>
          </DefaultButton>
          <DefaultButton v-else @click="markAsUncompleted(task.id)" title="Mark the task as uncompleted">
            <i class="bi bi-check"></i>
          </DefaultButton>
          <button
            :class="['btn', task.marked ? 'btn-danger' : 'btn-secondary']"
            @click="toggleMarkTask(task.id)">
            <i :class="task.marked ? 'bi bi-star-fill' : 'bi bi-star'"></i>
          </button>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import DefaultButton from '@/components/DefaultButton.vue';
import type { Task } from '@/types/types';
import { formatDate } from 'date-fns'

export default defineComponent({
  name: 'TaskTable',
  props: {
    tasks: {
      type: Array as () => Task[],
      required: true,
    },
    filteredTasks: {
      type: Array as () => Task[],
      required: true,
    },
  },
  components: {
    DefaultButton,
  },
  methods: {
    formatDate,
    editTask(id: number): void {
      this.$emit('edit-task', id);
    },
    removeTask(id: number): void {
      this.$emit('remove-task', id);
    },
    markAsCompleted(id: number): void {
      this.$emit('mark-as-completed', id);
    },
    markAsUncompleted(id: number): void {
      this.$emit('mark-as-uncompleted', id);
    },
    toggleMarkTask(id: number): void {
      this.$emit('toggle-mark-task', id);
    },
  },
  computed: {
    sortedTasks(): Task[] {
      return this.filteredTasks.slice().sort((a, b) => {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    }
  }
});
</script>

<style scoped>
table {
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #FFFFFF;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>