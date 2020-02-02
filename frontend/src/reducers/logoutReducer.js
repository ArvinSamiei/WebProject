export default (state=flase, action) => {
    switch(action.type){
        case 'LOGOUT':
            return true
        default:
            return state
    }
}