import axiosInstance from './axiosInstance'

const BASE = '/customer'

export const getAllCustomers = async () => {
  const res = await axiosInstance.get(BASE)
  return res.data.data
}

export const getCustomerById = async (id) => {
  const res = await axiosInstance.get(`${BASE}/${id}`)
  return res.data.data
}

export const createCustomer = async (customer) => {
  const res = await axiosInstance.post(BASE, customer)
  return res.data.data
}

export const updateCustomer = async (customer) => {
  const res = await axiosInstance.patch(BASE, customer)
  return res.data.data
}

export const deleteCustomer = async (id) => {
  const res = await axiosInstance.delete(`${BASE}/${id}`)
  return res.data.data
}

export const searchByContact = async (contact) => {
  const res = await axiosInstance.get(`${BASE}/contact/${contact}`)
  return res.data.data
}