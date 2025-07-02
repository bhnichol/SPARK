
const API_URL = {
    AUTH: {
        LOGIN_URL: '/auth',
        REGISTER_URL: './register'
    },
    ORG_URL: './org',
    ORG_MAN_URL: {
        REMOVE: './org/remove/:id',
        EDIT: './org/update/:id'
    },
    EMP_URL: './employees',
    STATUS_URL: './status',
    ROLES_URL: './roles',
    PROJECT_URL: './project'
}



export default API_URL