import API from './api'
export const getProducts = (published)=>{
    const params = published !== undefined ? {published} : {}
    return API.get('/products',{params})
}

export const getProduct = (id) => API.get(`/products/${id}`)
export const createProduct = (data) => API.post('/products',data)
export const updateProduct = (id,data) => API.put(`/products/${id}`,data)
export const togglePublish = (id) => API.patch(`/products/${id}/publish`)
export const deleteProduct = (id) =>  API.delete(`/products/${id}`)