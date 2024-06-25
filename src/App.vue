<template>
  <DefaultBackground>
    <h2 style="color: black">Task Manager</h2>

    <div>
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" v-for="(list, index) in lists" :key="list.id">
          <button class="nav-link"
                  :class="{ 'active': index === activeTab }"
                  @click="activeTab = index"
                  :aria-labelledby="'tab-' + index"
                  style="font-size: 1.6em; color: gray; border: 1px solid gray; padding: 10px;">
            <span style="font-size: 12px; color: darkgrey;">{{ list.title }}</span>
          </button>
        </li>
      </ul>

      <div class="tab-content">
        <div v-for="(list, index) in lists" :key="list.id" v-show="index === activeTab">
          <div style="margin-top: 10px; display: flex; align-items: center;">
            <DefaultButton @click="deleteList(list.id)" title="Deletes the list, all tasks will be reassigned to the Main list">
              <i class="bi bi-trash"></i>
            </DefaultButton>
            <input v-model="list.title" type="text" style="margin-left: 10px; padding: 5px; font-size: 1em;" />
          </div>

          <form @submit.prevent="setupTask(list.id)">
            <input type="text" placeholder="Enter the Title..." v-model="titleField" />
            <input type="date" placeholder="Enter the Deadline..." v-model="deadlineField" />
            <DefaultButton :disabled="!titleField || !deadlineField">
              {{ 'Add Task' }}
            </DefaultButton>
          </form>

          <table v-show="index === activeTab">
            <thead>
            <tr>
              <th>Title</th>
              <th>Deadline</th>
              <th>Completed?</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="filteredTasks.length === 0">
              <td colspan="4">No tasks added so far!</td>
            </tr>
            <tr v-for="task in filteredTasks" :key="task.id">
              <td>{{ task.title }}</td>
              <td>{{ task.deadline }}</td>
              <td>{{ task.completed ? 'Yes' : 'No' }}</td>
              <td>
                <div class="action-buttons">
                  <DefaultButton @click="editTask(task.id)" title="Edit your Task!">
                    <i class="bi bi-pen"></i>
                  </DefaultButton>
                  <DefaultButton @click="removeTask(task.id)" title="Deletes your Task :<(">
                    <i class="bi bi-trash"></i>
                  </DefaultButton>
                  <DefaultButton v-if="!task.completed" @click="markAsCompleted(task.id)" title="Mark the task ad completed">
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
        </div>
      </div>
    </div>

    <EditTaskModal
      v-if="showModal && currentTask"
      :task="currentTask"
      @close="closeModal"
      @update="handleUpdateTask"
    />
  </DefaultBackground>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useTaskController } from '@/types/TaskMixin';
import { useListOfTasksController } from '@/types/ListOfTasksMixin';
import type { ListOfTasks, Task } from '@/types/types'
import DefaultButton from '@/components/DefaultButton.vue'
import EditTaskModal from '@/components/EditTaskModal.vue'
import DefaultBackground from '@/components/DefaultBackground.vue'

export default defineComponent({
  components: {
    DefaultBackground,
    EditTaskModal,
    DefaultButton,
  },

  // import from @/types
  setup() {
    const {
      tasks,
      createTask,
      loadTasks,
      requestTasks,
      removeTask,
      markAsCompleted,
      markAsUncompleted,
      toggleMarkTask,
      updateTask,
    } = useTaskController();

    const {
      lists,
      createListOfTasks,
      requestListsOfTasks,
      deleteList,
      updateList,
    } = useListOfTasksController();


    // mosks for Testing
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Task 1',
        details: 'Desc of T1',
        deadline: new Date('2024-07-01'),
        completed: false,
        marked: false,
        listOfTasksId: 1,
      },
      {
        id: 2,
        title: 'Task 2',
        details: 'Desc of T2',
        deadline: new Date('2024-07-02'),
        completed: false,
        marked: false,
        listOfTasksId: 2,
      },
    ];

    // Моки данных для списков задач
    const mockLists: ListOfTasks[] = [
      {
        id: 1,
        title: 'Base',
      },
      {
        id: 2,
        title: 'Unbase',
      },
    ];
    // tasks.value = mockTasks;
    // lists.value = mockLists;

    const titleField = ref('');
    const detailsField = ref('');
    const deadlineField = ref();
    const completedField = ref(false);
    const markedField = ref(false);


    const editMode = ref(false);
    const editTaskId = ref<number | null>(null);
    const showModal = ref(false);
    const currentTask = ref<Task | null>(null);
    const currentListOfTasks = ref<number | null>(null);
    // default active Tab
    const activeTab = ref(1);

    interface newTask{
      title: string;
      details: string;
      deadline: Date;
      completed: boolean;
      marked: boolean;
      listOfTasksId: number;
    }

    function setupTask(listId: number): void {
      const newTask = {
        title: titleField.value,
        deadline: deadlineField.value,
        details: detailsField.value,
        completed: completedField.value,
        marked: markedField.value,
        listOfTasksId: listId,
      };

      createTask(newTask);
    }

    function editTask(id: number): void {
      const task = tasks.value.find((t) => t.id === id);
      if (task) {
        currentTask.value = { ...task };
        showModal.value = true;
      }
    }

    function handleUpdateTask(updatedTask: Task): void {
      updateTask(updatedTask);
      closeModal();
    }

    function closeModal(): void {
      showModal.value = false;
      currentTask.value = null;
    }

    const filteredTasks = computed(() => {
      return tasks.value.filter(task => task.listOfTasksId === lists.value[activeTab.value].id);
    });

    onMounted(() => {
      requestTasks();
      requestListsOfTasks();
    });

    return {
      // lists of classes
      tasks,
      lists,

      // properties of Task class
      titleField,
      detailsField,
      deadlineField,
      completedField,

      // functional variables for editing
      editMode,
      editTaskId,
      showModal,
      currentTask,
      currentListOfTasks,
      activeTab,

      // functions for Task class
      createTask,
      loadTasks,
      editTask,
      removeTask,
      markAsCompleted,
      markAsUncompleted,
      toggleMarkTask,
      updateTask,

      // support functions for editing of Task class
      handleUpdateTask,
      closeModal,
      filteredTasks,
      setupTask,

      // functions for ListOfTasks class
      createListOfTasks,
      deleteList,
      updateList,
      requestTasks
    };
  },
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

input {
  margin-bottom: 10px;
}

table {
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>
