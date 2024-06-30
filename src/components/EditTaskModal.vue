<template>
  <div class="modal">
    <div class="modal-content">
      <h3>Edit Task</h3>
      <form @submit.prevent="updateTask">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="editableTask.title" required />

        <label for="deadline">New Deadline</label>
        <input type="date" id="deadline" v-model="editableTask.deadline" required />

        <label for="details">Details</label>
        <textarea id="details" v-model="editableTask.details"></textarea>

        <button type="submit">Update Task</button>
        <button type="button" @click="closeModal">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType, ref, watch } from 'vue'
import { formatDate } from 'date-fns'

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
  methods: { formatDate },
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
  },
  emits: ['close', 'update'],
  setup(props, { emit }) {
    const editableTask = ref<Task>({ ...props.task });
    const newDeadline = ref<string | null>(null);

    const formattedCurrentDeadline = computed(() => {
      return `Current deadline ${formatDate(editableTask.value.deadline, 'dd MMMM yyyy')}`;
    });

    watch(() => props.task, (newTask) => {
      editableTask.value = { ...newTask };
    });

    function updateTask() {
      editableTask.value.deadline = new Date(editableTask.value.deadline);
      emit('update', { ...editableTask.value });
    }

    function closeModal() {
      emit('close');
    }

    return {
      newDeadline,
      formattedCurrentDeadline,
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
  background: rgb(251,226,214);
  background: radial-gradient(circle, rgba(251,226,214,0.6895133053221288) 0%, rgba(254,202,177,0.8603816526610644) 100%);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
}

label {
  display: block;
  margin-bottom: 10px;
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
  background: rgb(39,60,5);
  background: linear-gradient(0deg, rgba(39,60,5,1) 0%, rgba(41,228,84,1) 100%);
  color: white;
}

button[type='button'] {
  background: rgb(60,5,5);
  background: linear-gradient(0deg, rgba(60,5,5,1) 0%, rgba(253,45,45,1) 100%);
  color: white;
}
</style>
