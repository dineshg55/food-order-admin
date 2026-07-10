import { useEffect, useState } from 'react'
import {
  Box, Chip, FormControl, IconButton, InputLabel, MenuItem as MuiMenuItem,
  Select, Table, TableBody, TableCell, TableHead, TableRow, Typography,
  Paper, Menu, Divider, useMediaQuery, useTheme,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { getAllOrders } from '../api/orderApi'
import { updatePaymentStatus } from '../api/paymentApi'

const statusColors = {
  PENDING: 'warning',
  COMPLETED: 'success',
  FAILED: 'error',
  REFUNDED: 'default',
}

const statusOptions = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']

export default function Payments() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [orders, setOrders] = useState([])
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuRow, setMenuRow] = useState(null)

  const loadOrders = async () => {
    const data = await getAllOrders()
    setOrders(data)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      await updatePaymentStatus(newStatus, paymentId)
      loadOrders()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payment status')
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

  const payments = orders.filter((o) => o.payment)

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 600 }}>
          Payments
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: isMobile ? 2 : 4, overflow: 'hidden', border: '1px solid #e5e8ec' }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fb' }}>
              <TableCell sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#5a6472' }}>Payment ID</TableCell>
              {!isMobile && (
                <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#5a6472' }}>Order ID</TableCell>
              )}
              <TableCell sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#5a6472' }}>Customer</TableCell>
              <TableCell sx={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#5a6472' }}>Amount</TableCell>
              {!isMobile && (
                <>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#5a6472' }}>Method</TableCell>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#5a6472' }}>Status</TableCell>
                </>
              )}
              <TableCell align="right" sx={{ width: 56 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((o) => (
              <TableRow key={o.payment.id} hover>
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>{o.payment.id}</TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontSize: 14, py: 1.5 }}>{o.id}</TableCell>
                )}
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: isMobile ? 12 : 14 }}>{o.customer?.name || '—'}</Typography>
                    {isMobile && (
                      <Chip
                        size="small"
                        label={o.payment.paymentStatus}
                        color={statusColors[o.payment.paymentStatus]}
                        sx={{ mt: 0.5, height: 18, fontSize: 10, width: 'fit-content' }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 1 : 1.5 }}>₹{o.totalAmount}</TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={{ fontSize: 14, py: 1.5 }}>{o.payment.paymentMethod?.replace('_', ' ')}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                          value={o.payment.paymentStatus}
                          onChange={(e) => handleStatusChange(o.payment.id, e.target.value)}
                          renderValue={(val) => <Chip size="small" label={val} color={statusColors[val]} />}
                        >
                          {statusOptions.map((s) => (
                            <MuiMenuItem key={s} value={s}>{s}</MuiMenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </>
                )}
                <TableCell align="right" sx={{ py: isMobile ? 1 : 1.5 }}>
                  {isMobile && (
                    <IconButton size="small" onClick={(e) => openRowMenu(e, o)}>
                      <MoreVertIcon fontSize="small" />
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
          Order ID: {menuRow?.id}
        </MuiMenuItem>
        <MuiMenuItem disabled sx={{ fontSize: 12, opacity: '1 !important' }}>
          Method: {menuRow?.payment?.paymentMethod?.replace('_', ' ')}
        </MuiMenuItem>
      </Menu>
    </Box>
  )
}