import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function RequiereSesion({ children }) {
  const { usuarioActual } = useApp()
  if (!usuarioActual) return <Navigate to="/login" replace />
  return children
}
