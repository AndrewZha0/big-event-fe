// 定义store
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref({});

    const setUser = (newUser) => {
      user.value = newUser;
    };

    const removeUser = () => {
      user.value = "";
    };

    return { user, setUser, removeUser };
  },
  {
    persist: true, // 持久化存储
  }
);
