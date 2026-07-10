import { useEffect, useState } from 'react'
import {
  Box, Button, Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, IconButton, MenuItem as MuiMenuItem, Select, Table, Paper,
  TableBody, TableCell, TableHead, TableRow, TextField, Typography,
  InputLabel, FormControl, Menu, useMediaQuery, useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../api/menuItemApi'
import { getAllRestaurants } from '../api/restaurantApi'

const emptyForm = { id: null, itemName: '', price: '', availability: true, restaurant: null }

export default function MenuItems() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [items, setItems] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [isEditing, setIsEditing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchOpen, setSearchOpen] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [restaurantFilter, setRestaurantFilter] = useState('')

  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuRow, setMenuRow] = useState(null)

  const loadItems = async () => {
  try {
    const data = await getAllMenuItems()
    setItems(data)
  } catch (err) {
    setItems([])
  }
}

  const loadRestaurants = async () => {
    const data = await getAllRestaurants()
    setRestaurants(data)
  }

  useEffect(() => {
    loadItems()
    loadRestaurants()
  }, [])

  const handleOpenAdd = () => {
    setForm(emptyForm)
    setIsEditing(false)
    setErrorMsg('')
    setOpen(true)
  }

  const handleOpenEdit = (item) => {
    setForm(item)
    setIsEditing(true)
    setErrorMsg('')
    setOpen(true)
    setMenuAnchor(null)
  }

  const handleClose = () => {
    setErrorMsg('')
    setOpen(false)
  }

  const handleSave = async () => {
    setErrorMsg('')
    try {
      const payload = { ...form, price: Number(form.price) }
      if (isEditing) {
        await updateMenuItem(payload)
      } else {
        await createMenuItem(payload)
      }
      setOpen(false)
      loadItems()
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    setMenuAnchor(null)
    try {
      await deleteMenuItem(id)
      loadItems()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete menu item')
    }
  }

  const handleClearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setRestaurantFilter('')
  }

  const toggleSearch = () => {
    if (searchOpen) handleClearFilters()
    setSearchOpen(!searchOpen)
  }

  const openRowMenu = (e, row) => {
    setMenuAnchor(e.currentTarget)
    setMenuRow(row)
  }

  const closeRowMenu = () => {
    setMenuAnchor(null)
    setMenuRow(null)
  }

  const filteredItems = items.filter((item) => {
    if (minPrice && item.price < Number(minPrice)) return false
    if (maxPrice && item.price > Number(maxPrice)) return false
    if (restaurantFilter && item.restaurant?.id !== restaurantFilter) return false
    return true
  })

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 600 }}>
          Menu Items
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={toggleSearch}>
            {searchOpen ? <ClearIcon fontSize="small" /> : <SearchIcon fontSize="small" />}
          </IconButton>
          {isMobile ? (
            <IconButton color="primary" onClick={handleOpenAdd}>
              <AddIcon />
            </IconButton>
          ) : (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
              Add Menu Item
            </Button>
          )}
        </Box>
      </Box>

      <Collapse in={searchOpen}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Min Price"
            type="number"
            size="small"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            sx={{ width: isMobile ? 100 : 110 }}
          />
          <TextField
            label="Max Price"
            type="number"
            size="small"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            sx={{ width: isMobile ? 100 : 110 }}
          />
          <FormControl size="small" sx={{ minWidth: isMobile ? 130 : 160 }}>
            <InputLabel>Restaurant</InputLabel>
            <Select
              label="Restaurant"
              value={restaurantFilter}
              onChange={(e) => setRestaurantFilter(e.target.value)}
            >
              <MuiMenuItem value="">All</MuiMenuItem>
              {restaurants.map((r) => (
                <MuiMenuItem key={r.id} value={r.id}>{r.name}</MuiMenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Collapse>

      <Paper elevation={0} sx={{ borderRadius: isMobile ? 2 : 4, overflow: 'hidden', border: '1px solid #e5e8ec' }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fb' }}>
              <TableCell sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#5a6472' }}>ID</TableCell>
              <TableCell sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#5a6472' }}>Item Name</TableCell>
              <TableCell sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#5a6472' }}>Price</TableCell>
              <TableCell sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#5a6472' }}>Available</TableCell>
              {!isMobile && (
                <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#5a6472' }}>Restaurant</TableCell>
              )}
              <TableCell align="right" sx={{ width: 56 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>{item.id}</TableCell>
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: isMobile ? 12 : 14 }}>{item.itemName}</Typography>
                    {isMobile && (
                      <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25 }}>
                        {item.restaurant?.name || '—'}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>₹{item.price}</TableCell>
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>
                  {item.availability ? 'Yes' : 'No'}
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontSize: 14, py: 1.5 }}>{item.restaurant?.name || '—'}</TableCell>
                )}
                <TableCell align="right" sx={{ py: isMobile ? 1 : 1.5 }}>
                  {isMobile ? (
                    <IconButton size="small" onClick={(e) => openRowMenu(e, item)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleOpenEdit(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(item.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeRowMenu}>
        <MuiMenuItem onClick={() => handleOpenEdit(menuRow)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleDelete(menuRow?.id)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MuiMenuItem>
      </Menu>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>

        {errorMsg && (
          <Box sx={{ color: 'error.main', fontSize: 14, px: 3, pt: 1 }}>
            {errorMsg}
          </Box>
        )}

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Item Name"
            value={form.itemName}
            onChange={(e) => setForm({ ...form, itemName: e.target.value })}
          />
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <FormControl fullWidth>
            <InputLabel>Restaurant</InputLabel>
            <Select
              label="Restaurant"
              value={form.restaurant?.id || ''}
              onChange={(e) => {
                const selected = restaurants.find((r) => r.id === e.target.value)
                setForm({ ...form, restaurant: selected })
              }}
            >
              {restaurants.map((r) => (
                <MuiMenuItem key={r.id} value={r.id}>{r.name}</MuiMenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.checked })}
              />
            }
            label="Available"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}