import { createContext, useContext } from 'react';

import LoginStore from './login/login-store';

const store = {
    loginStore: new LoginStore()
};

export const StoreContext = createContext(store);

export const useStore = () => useContext<typeof store>(StoreContext);

export default store;
