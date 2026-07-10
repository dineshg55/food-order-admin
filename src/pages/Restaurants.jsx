import { useState, useEffect } from 'react'
import {
  Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Typography, Select, MenuItem as MuiMenuItem, FormControl,
  InputLabel, Menu, useMediaQuery, useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  getAllRestaurants, createRestaurant, updateRestaurant, deleteRestaurant,
  searchByName, searchByLocation,
} from '../api/restaurantApi'

const emptyForm = { id: null, name: '', location: '' }

export default function Restaurants() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [restaurants, setRestaurants] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [isEditing, setIsEditing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchField, setSearchField] = useState('name')
  const [searchValue, setSearchValue] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuRow, setMenuRow] = useState(null)

  const loadRestaurants = async () => {
  try {
    const data = await getAllRestaurants()
    setRestaurants(data)
  } catch (err) {
    setRestaurants([])
  }
}

  useEffect(() => {
    loadRestaurants()
  }, [])

  const handleOpenAdd = () => {
    setForm(emptyForm)
    setIsEditing(false)
    setErrorMsg('')
    setOpen(true)
  }

  const handleOpenEdit = (restaurant) => {
    setForm(restaurant)
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
      if (isEditing) {
        await updateRestaurant(form)
      } else {
        await createRestaurant(form)
      }
      setOpen(false)
      loadRestaurants()
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    setMenuAnchor(null)
    try {
      await deleteRestaurant(id)
      loadRestaurants()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete restaurant')
    }
  }

  const handleSearch = async () => {
    if (!searchValue.trim()) return
    try {
      const data = searchField === 'name'
        ? await searchByName(searchValue)
        : await searchByLocation(searchValue)
      setRestaurants(data)
    } catch (err) {
      setRestaurants([])
    }
  }

  const handleClearSearch = () => {
    setSearchValue('')
    loadRestaurants()
  }

  const toggleSearch = () => {
    if (searchOpen) handleClearSearch()
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 600 }}>
          Restaurants
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
              Add Restaurant
            </Button>
          )}
        </Box>
      </Box>

      <Collapse in={searchOpen}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: isMobile ? 100 : 120 }}>
            <InputLabel>Search by</InputLabel>
            <Select label="Search by" value={searchField} onChange={(e) => setSearchField(e.target.value)}>
              <MuiMenuItem value="name">Name</MuiMenuItem>
              <MuiMenuItem value="location">Location</MuiMenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder={`Search by ${searchField}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ width: isMobile ? 130 : 180 }}
            autoFocus
          />
          <IconButton size="small" onClick={handleSearch}>
            <SearchIcon fontSize="small" />
          </IconButton>
        </Box>
      </Collapse>

      <Paper elevation={0} sx={{ borderRadius: isMobile ? 2 : 4, overflow: 'hidden', border: '1px solid #e5e8ec' }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fb' }}>
              <TableCell sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#5a6472' }}>ID</TableCell>
              <TableCell sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#5a6472' }}>Name</TableCell>
              {!isMobile && (
                <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#5a6472' }}>Location</TableCell>
              )}
              <TableCell align="right" sx={{ width: 56 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>{r.id}</TableCell>
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: isMobile ? 12 : 14 }}>{r.name}</Typography>
                    {isMobile && (
                      <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25 }}>
                        {r.location}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                {!isMobile && <TableCell sx={{ fontSize: 14, py: 1.5 }}>{r.location}</TableCell>}
                <TableCell align="right" sx={{ py: isMobile ? 1 : 1.5 }}>
                  {isMobile ? (
                    <IconButton size="small" onClick={(e) => openRowMenu(e, r)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleOpenEdit(r)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(r.id)}>
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
        <DialogTitle>{isEditing ? 'Edit Restaurant' : 'Add Restaurant'}</DialogTitle>

        {errorMsg && (
          <Box sx={{ color: 'error.main', fontSize: 14, px: 3, pt: 1 }}>
            {errorMsg}
          </Box>
        )}

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
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