import { useEffect, useState } from 'react'
import {
  Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Typography, Menu, MenuItem as MuiMenuItem, Divider, useMediaQuery, useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  getAllCustomers, createCustomer, updateCustomer, deleteCustomer, searchByContact,
} from '../api/customerApi'

const emptyForm = { id: null, name: '', email: '', contact: '', address: '' }

export default function Customers() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [customers, setCustomers] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [isEditing, setIsEditing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuRow, setMenuRow] = useState(null)

  const loadCustomers = async () => {
  try {
    const data = await getAllCustomers()
    setCustomers(data)
  } catch (err) {
    setCustomers([])
  }
}

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleOpenAdd = () => {
    setForm(emptyForm)
    setIsEditing(false)
    setErrorMsg('')
    setOpen(true)
  }

  const handleOpenEdit = (customer) => {
    setForm(customer)
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
      const payload = { ...form, contact: Number(form.contact) }
      if (isEditing) {
        await updateCustomer(payload)
      } else {
        await createCustomer(payload)
      }
      setOpen(false)
      loadCustomers()
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    setMenuAnchor(null)
    try {
      await deleteCustomer(id)
      loadCustomers()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete customer')
    }
  }

  const handleSearch = async () => {
    if (!searchValue.trim()) return
    try {
      const data = await searchByContact(searchValue)
      setCustomers([data])
    } catch (err) {
      setCustomers([])
    }
  }

  const handleClearSearch = () => {
    setSearchValue('')
    loadCustomers()
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
          Customers
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
              Add Customer
            </Button>
          )}
        </Box>
      </Box>

      <Collapse in={searchOpen}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search by contact number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ width: isMobile ? 160 : 220 }}
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
                <>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#5a6472' }}>Email</TableCell>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#5a6472' }}>Contact</TableCell>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#5a6472' }}>Address</TableCell>
                </>
              )}
              <TableCell align="right" sx={{ width: 56 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>{c.id}</TableCell>
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: isMobile ? 12 : 14 }}>{c.name}</Typography>
                    {isMobile && (
                      <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25 }}>
                        {c.contact}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={{ fontSize: 14, py: 1.5 }}>{c.email}</TableCell>
                    <TableCell sx={{ fontSize: 14, py: 1.5 }}>{c.contact}</TableCell>
                    <TableCell sx={{ fontSize: 14, py: 1.5 }}>{c.address}</TableCell>
                  </>
                )}
                <TableCell align="right" sx={{ py: isMobile ? 1 : 1.5 }}>
                  {isMobile ? (
                    <IconButton size="small" onClick={(e) => openRowMenu(e, c)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleOpenEdit(c)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(c.id)}>
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
        <MuiMenuItem disabled sx={{ fontSize: 12, opacity: '1 !important' }}>
          {menuRow?.email}
        </MuiMenuItem>
        <MuiMenuItem disabled sx={{ fontSize: 12, opacity: '1 !important' }}>
          {menuRow?.address}
        </MuiMenuItem>
        <Divider />
        <MuiMenuItem onClick={() => handleOpenEdit(menuRow)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleDelete(menuRow?.id)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MuiMenuItem>
      </Menu>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? 'Edit Customer' : 'Add Customer'}</DialogTitle>

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
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Contact"
            type="number"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
          <TextField
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
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