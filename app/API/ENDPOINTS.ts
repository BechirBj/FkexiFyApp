const APIS = {
    
    ADMIN_ROLE:"admin",
    LOGIN: "/auth/login",

    REGISTER: '/users',
    DELETE_USER:"/users",  
    UPDATE_USER:"/users",  
     
    ADD_WORKOUT:"workout/CreateWorkout",
    GET_ALL_WORKOUTS: '/workout/GetAllDashboard',
    GET_USER_WORKOUTS: '/workout/GetAll',
    DELETE_WORKOUT: '/workout/RemoveWorkout',
    UPDATE_WORKOUT: '/workout/UpdateWorkout',

    GET_EXERCISES: '/exercices/GetAll',
    ADD_EXERCISE: '/exercices/addExercise',
    DELETE_EXERCISE: '/exercices/DeleteExercise',
    UPDATE_EXERCISE: '/exercises/UpdateExercise',

    GET_EXLIST :'/exlist/GetAll',


    ADD_SET :'/sets/AddSets',
    GET_SET :'/sets/GetAll',
    GET_SET_ID  : '/sets/GetByExerciseId',
    UPDATE_SET :'/sets/UpdateSet',
    REMOVE_SET :'/sets/RemoveSet'

}
export default APIS;