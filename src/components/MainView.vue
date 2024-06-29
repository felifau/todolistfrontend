<template>
  <DefaultBackground>
    <TaskManagerLine />

    <div>
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" v-for="(list, index) in lists" :key="list.id">
          <button class="nav-link"
                  :class="{ 'active': index === activeTab }"
                  @click="activeTab = index"
                  :aria-labelledby="'tab-' + index"
                  style="font-size: 1.2em; color: black; border: 1px gray; padding: 4px;">
            <span style="font-size: 12px; color: black;">{{ list.title }}</span>
          </button>
        </li>
      </ul>

      <div class="tab-content">
        <div v-for="(list, index) in lists" :key="list.id" v-show="index === activeTab">

          <div class="action-buttons">
            <div style="display: inline-block;">
              <DefaultButton @click="deleteList(list.id)"
                             title="Deletes the list, all tasks will be reassigned to the Main list"
                             style="margin-right: 10px;">
                <i class="bi bi-trash"></i>
              </DefaultButton>
              <form @submit.prevent="updateList(list)" style="display: inline-block;">
                <input type="text" v-model="list.title" placeholder="Enter new List Title..."
                       style="margin-right: 10px; padding: 5px; font-size: 1em;
                       display: inline-block;" />
                <DefaultButton type="submit" style="display: inline-block;">
                  <i class="bi bi-pen"></i>
                </DefaultButton>
              </form>
            </div>
          </div>

          <form @submit.prevent="setupTask(list.id)">
            <input type="text" placeholder="Enter the Title..." v-model="titleField" />
            <input type="date" placeholder="Enter the Deadline..." v-model="deadlineField" />
            <DefaultButton :disabled="!titleField || !deadlineField">
              {{ 'Add Task' }}
            </DefaultButton>
          </form>
          <TaskTable
            :tasks="tasks"
            :filteredTasks="filteredTasks"
            @edit-task="editTask"
            @remove-task="removeTask"
            @mark-as-completed="markAsCompleted"
            @mark-as-uncompleted="markAsUncompleted"
            @toggle-mark-task="toggleMarkTask"
          ></TaskTable>
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
import type { Task } from '@/types/types'
import type { ListOfTasks } from '@/types/ListOfTasks'
import DefaultButton from '@/components/DefaultButton.vue'
import EditTaskModal from '@/components/EditTaskModal.vue'
import DefaultBackground from '@/components/DefaultBackground.vue'
import TaskTable from '@/components/Table.vue'
import TaskManagerLine from '@/components/TaskManagerLine.vue'

export default defineComponent({
  components: {
    TaskManagerLine,
    TaskTable,
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

    interface ListOfTasks {
      id: number;
      title: string;
    }
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
    tasks.value = mockTasks;
    lists.value = mockLists;

    const titleField = ref('');
    const detailsField = ref('');
    const deadlineField = ref();
    const completedField = ref(false);
    const markedField = ref(false);

    const titleOfListField = ref(1);

    const editMode = ref(false);
    const editTaskId = ref<number | null>(null);
    const showModal = ref(false);
    const currentTask = ref<Task | null>(null);
    const currentListOfTasks = ref<number | null>(null);
    // default active Tab
    const activeTab = ref(1);

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
      const activeListId = lists.value[activeTab.value].id;
      return tasks.value.filter(task => task.listOfTasksId === activeListId);
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
  flex-direction:column  ;
  margin-bottom: 100px;
}

input {
  margin-bottom: 20px;
}

table {
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 2px;
}
</style>