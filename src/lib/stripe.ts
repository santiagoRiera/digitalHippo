import Stripe from 'stripe'

console.log('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY)

//if (!process.env.STRIPE_SECRET_KEY) {
  //throw new Error("Falta la variable de entorno STRIPE_SECRET_KEY");
//}

export const stripe = new Stripe('sk_test_51Q8tgD09kLMcYpFRISXiHG8c04cVDwcY8y0by1udaAuaTHXKI6L63KBIR7MXeZ2j4V1Xg3HOeaRmzDV007jzu93P00crRDQyip', {
  apiVersion: '2024-09-30.acacia',
  typescript: true,
})
