import axiosInstance from './axiosInstance'

const BASE = '/restaurant'

export const getAllRestaurants = async () => {
  const res = await axiosInstance.get(BASE)
  return res.data.data
}

export const getRestaurantById = async (id) => {
  const res = await axiosInstance.get(`${BASE}/${id}`)
  return res.data.data
}

export const createRestaurant = async (restaurant) => {
  const res = await axiosInstance.post(BASE, restaurant)
  return res.data.data
}

export const updateRestaurant = async (restaurant) => {
  const res = await axiosInstance.patch(BASE, restaurant)
  return res.data.data
}

export const deleteRestaurant = async (id) => {
  const res = await axiosInstance.delete(`${BASE}/${id}`)
  return res.data.data
}

export const searchByName = async (name) => {
  const res = await axiosInstance.get(`${BASE}/name/${name}`)
  return res.data.data
}

export const searchByLocation = async (location) => {
  const res = await axiosInstance.get(`${BASE}/location/${location}`)
  return res.data.data
}