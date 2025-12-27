import Stripe from 'stripe'
import { serverEnv } from '@/lib/env.server'
import { billRepository } from '@/lib/bill-repository'
import { sendSplitedBillEmail } from '@/lib/send-email'
import { formatCurrency } from '@/lib/format-currency'

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY)

/**
 * Envía el email de confirmación de pago basado en la sesión de Stripe
 */
export async function sendPaymentEmailFromSession(sessionId: string): Promise<void> {
  console.log('[EMAIL] Iniciando envío de email para sesión:', sessionId)
  
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== 'paid') {
    console.warn('[EMAIL] Pago no completado, status:', session.payment_status)
    throw new Error('El pago no ha sido completado')
  }

  const sendEmail = session.metadata?.sendEmail === 'true'
  if (!sendEmail) {
    console.log('[EMAIL] Email no solicitado por el usuario')
    return
  }
  
  console.log('[EMAIL] Email solicitado, procediendo con el envío')

  const customerEmail = session.customer_email || session.customer_details?.email
  if (!customerEmail) {
    throw new Error('No se encontró el email del cliente')
  }

  const billData = await billRepository.getBillData()
  const splitDataJson = session.metadata?.splitData
  if (!splitDataJson) {
    throw new Error('No se encontraron datos de división')
  }

  console.log('[EMAIL] Datos de división encontrados:', splitDataJson)
  console.log('[EMAIL] Datos de división encontrados:', billData)

  const splitData = JSON.parse(splitDataJson)
  const { people, personTotals, currency } = splitData
  const tip = parseFloat(session.metadata?.tip || '0')

  const distributeTip = (tip: number, numPeople: number): number[] => {
    if (tip <= 0 || numPeople <= 0) {
      return new Array(numPeople).fill(0)
    }
    const tipInCents = Math.round(tip * 100)
    const baseCentsPerPerson = Math.floor(tipInCents / numPeople)
    const remainder = tipInCents % numPeople
    const distribution = new Array(numPeople).fill(baseCentsPerPerson)
    for (let i = 0; i < remainder; i++) {
      distribution[i] += 1
    }
    return distribution.map(cents => cents / 100)
  }

  const tipDistribution = distributeTip(tip, people.length)
  const grandTotal = Object.values(personTotals as { [key: string]: number }).reduce((sum: number, total: number) => sum + total, 0)
  const totalWithTip = grandTotal + tip

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Detalles del Pago</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #1e293b; margin-top: 0;">¡Pago Realizado con Éxito!</h1>
          <p style="margin: 0;">Gracias por tu pago. Aquí están los detalles de tu transacción:</p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin-top: 0; font-size: 18px;">Información de la Mesa</h2>
          <p style="margin: 5px 0;"><strong>Mesa:</strong> ${billData.table.name}</p>
          <p style="margin: 5px 0;"><strong>Camarero:</strong> ${billData.table.server}</p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin-top: 0; font-size: 18px;">Desglose de Pagos por Persona</h2>
          <div style="margin-top: 15px;">
            ${people.map((person: { id: string; name: string }, index: number) => {
              const baseTotal = personTotals[person.id] || 0
              const tipPerPerson = tipDistribution[index] || 0
              const totalWithTipPerson = baseTotal + tipPerPerson
              return `
                <div style="background-color: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: 600; font-size: 16px; color: #1e293b;">${person.name}:</span>
                    <span style="font-weight: 700; font-size: 18px; color: #1e293b;">${formatCurrency(totalWithTipPerson, currency)}</span>
                  </div>
                  ${tip > 0 ? `
                    <div style="font-size: 13px; color: #64748b; margin-top: 5px;">
                      ${formatCurrency(baseTotal, currency)} + ${formatCurrency(tipPerPerson, currency)} propina
                    </div>
                  ` : `
                    <div style="font-size: 13px; color: #64748b; margin-top: 5px;">
                      ${formatCurrency(baseTotal, currency)}
                    </div>
                  `}
                </div>
              `
            }).join('')}
          </div>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin-top: 0; font-size: 18px; margin-bottom: 15px;">Resumen Total</h2>
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="font-weight: 600;">Subtotal:</span>
            <span>${formatCurrency(grandTotal, currency)}</span>
          </div>
          ${tip > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
              <span style="font-weight: 600;">Propina:</span>
              <span>${formatCurrency(tip, currency)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; padding: 10px 0; margin-top: 10px;">
            <span style="font-weight: 700; font-size: 18px;">Total:</span>
            <span style="font-weight: 700; font-size: 18px;">${formatCurrency(totalWithTip, currency)}</span>
          </div>
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; color: #64748b; font-size: 14px;">
          <p style="margin: 0;">ID de Sesión: ${sessionId}</p>
          <p style="margin: 5px 0 0 0;">Fecha: ${new Date().toLocaleString('es-ES')}</p>
        </div>
      </body>
    </html>
  `

  try {
    console.log('[EMAIL] Enviando email a:', customerEmail)
    await sendSplitedBillEmail({
      email: customerEmail,
      subject: `Detalles del pago - ${billData.table.name}`,
      htmlTemplate: emailHtml
    })
    console.log('[EMAIL] Email enviado exitosamente a:', customerEmail)
  } catch (error) {
    console.error('[EMAIL] Error en sendSplitedBillEmail:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      customerEmail,
    })
    throw error
  }
}

