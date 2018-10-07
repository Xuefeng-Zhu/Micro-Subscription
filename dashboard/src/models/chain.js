import { database } from "../services/chain";

export default {
  namespace: "chain",

  state: {},

  subscriptions: {
    setup({ dispatch }) {
      database.ref().on("value", function(data) {
        dispatch({
          type: "save",
          payload: data.val()
        });
      });
    }
  },

  effects: {
    *update({ payload }, { call, put }) {
      database.ref('health').set(payload)
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
