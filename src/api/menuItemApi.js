import axiosInstance from './axiosInstance'

const BASE = '/menuItem'

export const getAllMenuItems = async () => {
  const res = await axiosInstance.get(BASE)
  return res.data.data
}

// backend expects a List, even for one item — so we wrap it in an array
export const createMenuItem = async (menuItem) => {
  const res = await axiosInstance.post(BASE, [menuItem])
  return res.data.data
}

export const updateMenuItem = async (menuItem) => {
  const res = await axiosInstance.patch(BASE, menuItem)
  return res.data.data
}

export const deleteMenuItem = async (id) => {
  const res = await axiosInstance.delete(`${BASE}/${id}`)
  return res.data.data
}