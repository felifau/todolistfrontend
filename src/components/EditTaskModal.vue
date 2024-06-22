<template>
  <div class="modal">
    <div class="modal-content">
      <h3>Edit Task</h3>
      <form @submit.prevent="updateTask">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="editableTask.title" required />

        <label for="deadline">Deadline</label>
        <input type="date" id="deadline" v-model="editableTask.deadline" required />

        <label for="details">Details</label>
        <textarea id="details" v-model="editableTask.details"></textarea>

        <label>
          <input type="checkbox" v-model="editableTask.completed" />
          Completed
        </label>

        <button type="submit">Update Task</button>
        <button type="button" @click="closeModal">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref, watch } from 'vue';

interface Task {
  id: number;
  title: string;
  details: string;
  deadline: Date;
  completed: boolean;
  marked: boolean;
}

export default defineComponent({
  name: 'EditTaskModal',
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
  },
  emits: ['close', 'update'],
  setup(props, { emit }) {
    const editableTask = ref<Task>({ ...props.task });

    watch(() => props.task, (newTask) => {
      editableTask.value = { ...newTask };
    });

    function updateTask() {
      emit('update', { ...editableTask.value });
    }

    function closeModal() {
      emit('close');
    }

    return {
      editableTask,
      updateTask,
      closeModal,
    };
  },
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-right: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type='submit'] {
  background-color: #28a745;
  color: white;
}

button[type='button'] {
  background-color: #dc3545;
  color: white;
}
</style>
