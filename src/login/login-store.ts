import { action, makeAutoObservable, observable } from 'mobx';

class LoginStore {
    username: string = 'SAS35052';
    password: string = 'quiz92';
    profileId: string = '14775734';

    constructor () {
        makeAutoObservable(this, {
            username: observable,
            password: observable,
            profileId: observable,
            setCredential: action
        });
    }

    setCredential (key: 'username' | 'password' | 'profileId', value: string) {
        this[key] = value
    }
}

export default LoginStore;
