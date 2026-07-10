import axiosInstance from './axiosInstance'

const BASE = '/order'

export const getAllOrders = async () => {
  const res = await axiosInstance.get(BASE)
  return res.data.data
}

export const getOrderById = async (id) => {
  const res = await axiosInstance.get(`${BASE}/${id}`)
  return res.data.data
}

export const getOrdersByCustomer = async (customerId) => {
  const res = await axiosInstance.get(`${BASE}/customer/${customerId}`)
  return res.data.data
}

export const placeOrder = async (order) => {
  const res = await axiosInstance.post(BASE, order)
  return res.data.data
}

export const updateOrderStatus = async (orderStatus, id) => {
  const res = await axiosInstance.patch(`${BASE}/status/${orderStatus}/${id}`)
  return res.data.data
}

export const cancelOrder = async (id) => {
  const res = await axiosInstance.delete(`${BASE}/${id}`)
  return res.data.data
}

export const getOrdersByStatus = async (status) => {
  const res = await axiosInstance.get(`${BASE}/orderStatus/${status}`)
  return res.data.data
}

export const getOrdersByDate = async (date) => {
  // expects date as 'YYYY-MM-DD' to match LocalDate on the backend
  const res = await axiosInstance.get(`${BASE}/date/${date}`)
  return res.data.data
}

export const getOrdersByTotalAmountBetween = async (startPrice, endPrice) => {
  const res = await axiosInstance.get(`${BASE}/${startPrice}/${endPrice}`)
  return res.data.data
}

export const getOrdersByRestaurant = async (restaurantId) => {
  const res = await axiosInstance.get(`${BASE}/restaurant/${restaurantId}`)
  return res.data.data
}