import request from './request'

export function createOrder(data) {
    return request({
        url: '/order',
        method:'post',
        data
    })
}
  
export function updateOrder(data) {
    return request({
        url: '/order',
        method:'put',
        data
    })
}
  
export function orderList(filter) {
    return request({
        url: '/order',
        method: 'get',
        params:{param: JSON.stringify(filter)}
    })
}
  
export function deleteOrder(data) {
    return request({
        url: '/order',
        method:'delete',
        data
    })
}

export function exportOrder(data) {
    return request({
        url:'/exportOrder',
        method: 'post',
        data,
        responseType: 'blob'
    })
}