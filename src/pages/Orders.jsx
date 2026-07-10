import { useEffect, useState } from 'react'
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, IconButton, InputLabel, MenuItem as MuiMenuItem, Select, Paper,
  Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography,
  Menu, Divider, useMediaQuery, useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { getAllOrders, updateOrderStatus, cancelOrder, placeOrder } from '../api/orderApi'
import { getAllCustomers } from '../api/customerApi'
import { getAllMenuItems } from '../api/menuItemApi'

const statusColors = {
  ORDERED: 'default',
  PREPARING: 'warning',
  SERVED: 'success',
  CANCELLED: 'error',
}

const statusOptions = ['ORDERED', 'PREPARING', 'SERVED', 'CANCELLED']
const paymentMethods = ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH']

const emptyLine = { menuItemId: '', quantity: 1 }

export default function Orders() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [menuItems, setMenuItems] = useState([])

  const [open, setOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [lines, setLines] = useState([{ ...emptyLine }])

  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuRow, setMenuRow] = useState(null)

  const loadOrders = async () => {
    const data = await getAllOrders()
    setOrders(data)
  }

  const loadCustomers = async () => {
    const data = await getAllCustomers()
    setCustomers(data)
  }

  const loadMenuItems = async () => {
    const data = await getAllMenuItems()
    setMenuItems(data)
  }

  useEffect(() => {
    loadOrders()
    loadCustomers()
    loadMenuItems()
  }, [])

  const handleOpenAdd = () => {
    setCustomerId('')
    setPaymentMethod('')
    setLines([{ ...emptyLine }])
    setErrorMsg('')
    setOpen(true)
  }

  const handleClose = () => {
    setErrorMsg('')
    setOpen(false)
  }

  const addLine = () => setLines([...lines, { ...emptyLine }])
  const removeLine = (index) => setLines(lines.filter((_, i) => i !== index))
  const updateLine = (index, field, value) => {
    const next = [...lines]
    next[index] = { ...next[index], [field]: value }
    setLines(next)
  }

  const estimatedTotal = lines.reduce((sum, line) => {
    const menu = menuItems.find((m) => m.id === line.menuItemId)
    if (!menu || !line.quantity) return sum
    return sum + menu.price * Number(line.quantity)
  }, 0)

  const handlePlaceOrder = async () => {
    setErrorMsg('')
    if (!customerId) return setErrorMsg('Please select a customer')
    if (!paymentMethod) return setErrorMsg('Please select a payment method')
    if (lines.some((l) => !l.menuItemId)) return setErrorMsg('Please select a menu item for every row')

    const payload = {
      customer: { id: customerId },
      payment: { paymentMethod, paymentStatus: 'COMPLETED' },
      orderItem: lines.map((l) => ({
        menuItem: { id: l.menuItemId },
        quantity: Number(l.quantity),
      })),
    }

    try {
      await placeOrder(payload)
      setOpen(false)
      loadOrders()
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to place order')
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(newStatus, id)
      loadOrders()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleCancel = async (id) => {
    setMenuAnchor(null)
    try {
      await cancelOrder(id)
      loadOrders()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order')
    }
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
          Orders
        </Typography>
        {isMobile ? (
          <IconButton color="primary" onClick={handleOpenAdd}>
            <AddIcon />
          </IconButton>
        ) : (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
            Place Order
          </Button>
        )}
      </Box>

      <Paper elevation={0} sx={{ borderRadius: isMobile ? 2 : 4, overflow: 'hidden', border: '1px solid #e5e8ec' }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fb' }}>
              <TableCell sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#5a6472' }}>ID</TableCell>
              {!isMobile && (
                <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#5a6472' }}>Date/Time</TableCell>
              )}
              <TableCell sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#5a6472' }}>Customer</TableCell>
              <TableCell sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#5a6472' }}>Total</TableCell>
              {!isMobile && (
                <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#5a6472' }}>Status</TableCell>
              )}
              <TableCell align="right" sx={{ width: 56 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id} hover>
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>{o.id}</TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontSize: 14, py: 1.5 }}>
                    {o.orderDateTime ? new Date(o.orderDateTime).toLocaleString() : '—'}
                  </TableCell>
                )}
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: isMobile ? 12 : 14 }}>{o.customer?.name || '—'}</Typography>
                    {isMobile && (
                      <Chip
                        size="small"
                        label={o.status}
                        color={statusColors[o.status]}
                        sx={{ mt: 0.5, height: 18, fontSize: 10, width: 'fit-content' }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>₹{o.totalAmount}</TableCell>
                {!isMobile && (
                  <TableCell sx={{ py: 1.5 }}>
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                      <Select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        renderValue={(val) => <Chip size="small" label={val} color={statusColors[val]} />}
                      >
                        {statusOptions.map((s) => (
                          <MuiMenuItem key={s} value={s}>{s}</MuiMenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                )}
                <TableCell align="right" sx={{ py: isMobile ? 1 : 1.5 }}>
                  {isMobile ? (
                    <IconButton size="small" onClick={(e) => openRowMenu(e, o)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <IconButton size="small" onClick={() => handleCancel(o.id)}>
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeRowMenu}>
        <MuiMenuItem disabled sx={{ fontSize: 12, opacity: '1 !important' }}>
          {menuRow?.orderDateTime ? new Date(menuRow.orderDateTime).toLocaleString() : '—'}
        </MuiMenuItem>
        <Divider />
        <MuiMenuItem onClick={() => handleCancel(menuRow?.id)}>
          <CancelIcon fontSize="small" sx={{ mr: 1 }} /> Cancel Order
        </MuiMenuItem>
      </Menu>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Place Order</DialogTitle>

        {errorMsg && (
          <Box sx={{ color: 'error.main', fontSize: 14, px: 3, pt: 1 }}>
            {errorMsg}
          </Box>
        )}

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Customer</InputLabel>
            <Select label="Customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              {customers.map((c) => (
                <MuiMenuItem key={c.id} value={c.id}>{c.name} ({c.contact})</MuiMenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select label="Payment Method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {paymentMethods.map((m) => (
                <MuiMenuItem key={m} value={m}>{m.replace('_', ' ')}</MuiMenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle2" sx={{ mt: 1 }}>Items</Typography>

          {lines.map((line, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl sx={{ flex: 2 }}>
                <InputLabel>Menu Item</InputLabel>
                <Select
                  label="Menu Item"
                  value={line.menuItemId}
                  onChange={(e) => updateLine(index, 'menuItemId', e.target.value)}
                >
                  {menuItems.map((m) => (
                    <MuiMenuItem key={m.id} value={m.id}>
                      {m.itemName} — ₹{m.price} ({m.restaurant?.name || 'no restaurant'})
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Qty"
                type="number"
                sx={{ width: 90 }}
                value={line.quantity}
                onChange={(e) => updateLine(index, 'quantity', e.target.value)}
                inputProps={{ min: 1 }}
              />
              <IconButton onClick={() => removeLine(index)} disabled={lines.length === 1}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <Button startIcon={<AddIcon />} onClick={addLine} sx={{ alignSelf: 'flex-start' }}>
            Add Item
          </Button>

          <Typography variant="subtitle1" sx={{ textAlign: 'right', mt: 1 }}>
            Estimated Total: ₹{estimatedTotal.toFixed(2)}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handlePlaceOrder}>Place Order</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}