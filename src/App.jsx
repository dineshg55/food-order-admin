import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Restaurants from './pages/Restaurants'
import MenuItems from './pages/MenuItems'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import Payments from './pages/Payments'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/restaurants" replace />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/menu-items" element={<MenuItems />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payments" element={<Payments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App