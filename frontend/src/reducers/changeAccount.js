export default (state={success: false, message: ''}, action) => {
    switch(action.type){
        case 'CHANGE_ACCOUNT':
            return action.payload
        default:
            return state
    }
}