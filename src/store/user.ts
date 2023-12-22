import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null,
    loginStatus: false,
  }),
  actions: {
    logout() {
      this.userInfo = null;
      this.loginStatus = false;
    },
    setUserInfo(userInfo: any) {
      delete userInfo.password;
      this.userInfo = { ...userInfo };
      this.loginStatus = true;
    },
  },
});
