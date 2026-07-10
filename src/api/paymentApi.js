import axiosInstance from './axiosInstance'

const BASE = '/payment'

export const getPaymentById = async (id) => {
  const res = await axiosInstance.get(`${BASE}/${id}`)
  return res.data.data
}

export const getByPaymentStatus = async (status) => {
  const res = await axiosInstance.get(`${BASE}/paymentStatus/${status}`)
  return res.data.data
}

export const getByPaymentMethod = async (method) => {
  const res = await axiosInstance.get(`${BASE}/paymentMethod/${method}`)
  return res.data.data
}

export const updatePaymentStatus = async (paymentStatus, id) => {
  const res = await axiosInstance.patch(`${BASE}/${paymentStatus}/${id}`)
  return res.data.data
}