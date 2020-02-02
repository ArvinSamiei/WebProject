export default (state={success: false, message: ''}, action) => {
    switch(action.type){
        case 'CREATE_POST':
            return action.payload
        default:
            return state
    }
}