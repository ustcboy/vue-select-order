import request from './request'

export function login(data) {
    return request({
        url: '/login',
        method: 'post',
        data
    })
}

export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}

export function createUser(data) {
    return request({
        url: '/users',
        method:'post',
        data
    })
}

export function updateUser(data) {
    return request({
        url: '/users',
        method:'put',
        data
    })
}

export function userList(filter) {
    return request({
        url: '/users',
        method: 'get',
        params:{param: JSON.stringify(filter)}
    })
}

export function deleteUser(data) {
    return request({
        url: '/users',
        method:'delete',
        data
    })
}