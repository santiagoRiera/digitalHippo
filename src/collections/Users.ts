import { PrimaryActionEmailHtml } from '../components/emails/PrimaryActionEmail'
import { Access, CollectionConfig } from 'payload/types'

const adminsAndUser: Access = ({ req: { user } }) => {
  // Si no hay usuario, solo permitir acceso público si es necesario
  if (!user) return true;

  // Si el usuario es admin, permitir acceso total
  if (user.role === 'admin') return true;

  // Si es un usuario normal, solo puede ver su propio registro
  return {
    id: {
      equals: user.id,
    },
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: true,
    tokenExpiration: 7200, // 2 horas
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutos
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        return {
          ...data,
          _verified: true,
        }
      }
    ]
  },
  access: {
    read: () => true, // Permitir lectura pública
    create: () => true,
    update: ({ req }) => {
      // Manejar el caso cuando no hay usuario
      if (!req.user) return false;
      return req.user.role === 'admin'
    },
    delete: ({ req }) => {
      // Manejar el caso cuando no hay usuario
      if (!req.user) return false;
      return req.user.role === 'admin'
    },
  },
  admin: {
    hidden: ({ user }) => {
      // Manejar el caso cuando no hay usuario
      if (!user) return true;
      return user.role !== 'admin'
    },
    defaultColumns: ['id'],
  },
  fields: [
    {
      name: 'products',
      label: 'Products',
      admin: {
        condition: () => false,
      },
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'product_files',
      label: 'Product files',
      admin: {
        condition: () => false,
      },
      type: 'relationship',
      relationTo: 'product_files',
      hasMany: true,
    },
    {
      name: 'role',
      defaultValue: 'user',
      required: true,
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
  ],
}
