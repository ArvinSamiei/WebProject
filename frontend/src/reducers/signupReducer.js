export default (state={success: false, message: ''}, action) => {
    switch(action.type){
        case 'SIGNUP':
            return action.payload
        default:
            return state
    }
}