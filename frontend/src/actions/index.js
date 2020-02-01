import backend from '../apis/backend'

export const login = (username, password) => {
	return function(dispatch) {
        backend.post('', {
            username,
            password
        })
    }
};
