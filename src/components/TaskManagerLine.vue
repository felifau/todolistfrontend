<template>
  <div class="task-manager-header">
    <h2 class="task-manager-title">Task Manager</h2>
    <DefaultButton @click="handleCreateListOfTasks" title="Create New List of Tasks">
      <i class="bi bi-pen"></i>
    </DefaultButton>
  </div>
</template>

<script setup lang="ts">
import DefaultButton from '@/components/DefaultButton.vue';
import { useListOfTasksController } from '@/types/ListOfTasksMixin';

const { createListOfTasks, requestListsOfTasks } = useListOfTasksController();

function handleCreateListOfTasks() {
  createListOfTasks();
  requestListsOfTasks();
}
</script>

<style scoped>
.task-manager-header {
  display: flex;
  align-items: center;
}

.task-manager-title {
  color: white;
  margin-right: 10px;
}

.task-manager-header > * {
  margin-right: 10px;
  padding: 5px;
}
</style>