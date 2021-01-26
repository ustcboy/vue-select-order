import request from './request'

export function createDevice(data) {
    return request({
        url: '/device',
        method:'post',
        data
    })
}
  
export function updateDevice(data) {
    return request({
        url: '/device',
        method:'put',
        data
    })
}
  
export function deviceList(filter) {
    return request({
        url: '/device',
        method: 'get',
        params:{param: JSON.stringify(filter)}
    })
}
  
export function deleteDevice(data) {
    return request({
        url: '/device',
        method:'delete',
        data
    })
}

export function deviceType(){
    return request({
        url:'/deviceType',
        method:'get'
    })
}

export function deviceArray(){
    return request({
        url:'/deviceArray',
        method:'get'
    })
}