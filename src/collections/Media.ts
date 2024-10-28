import { User } from '../payload-types'
import { Access, CollectionConfig } from 'payload/types'

const isAdminOrHasAccessToImages =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User | undefined

    if (!user) return false
    if (user.role === 'admin') return true

     //if this user owns this image, he can only see his images. User es el user field de la imagen que seteamos en el hook beforeChange
    return {
      user: {
        equals: req.user.id,
      },
    }
  }

export const Media: CollectionConfig = {
  slug: 'media',
  hooks: {
    //Antes de cambiar el producto podemos invocar cutom functions que queramos correr
    //Asociamos cada imagen directamente a un user, en lugar de hacer una relacion transitiva a traves de products
    beforeChange: [
      ({ req, data }) => {
        return { ...data, user: req.user.id }
      },
    ],
  },
  access: {
    read: async ({ req }) => {
      const referer = req.headers.referer

      if (!req.user || !referer?.includes('sell')) {
        //si no esta logueado o esta en el front se pueden ver todas las imagenes 
        return true
      }

      return await isAdminOrHasAccessToImages()({ req })
    },
    delete: isAdminOrHasAccessToImages(),
    update: isAdminOrHasAccessToImages(),
  },
  admin: {
    hidden: ({ user }) => user.role !== 'admin',
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
}
