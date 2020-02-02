export default (state={success: false, message: ''}, action) => {
    switch(action.type){
        case 'LOGIN':
            return action.payload
        default:
            return state
    }
}