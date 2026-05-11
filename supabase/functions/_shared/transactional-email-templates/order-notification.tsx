import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SHOP_EMAIL = 'barbato.electronics@gmail.com'

interface OrderItem {
  title: string
  quantity: number
  subtotal: number
}

interface ShippingAddress {
  name?: string
  line1?: string
  line2?: string
  postal_code?: string
  city?: string
  country?: string
}

interface OrderNotificationProps {
  sessionId?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  shippingAddress?: ShippingAddress | null
  items?: OrderItem[]
  total?: string
}

const OrderNotificationEmail = ({
  sessionId = '',
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  shippingAddress = null,
  items = [],
  total = '0,00',
}: OrderNotificationProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Neue Bestellung – {total} € – {customerName || 'Kunde'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🛒 Neue Bestellung eingegangen</Heading>
        {sessionId ? <Text style={meta}>Session: {sessionId}</Text> : null}

        <Text style={sectionTitle}>Kunde</Text>
        <Text style={row}><span style={label}>Name: </span>{customerName || '—'}</Text>
        <Text style={row}><span style={label}>E-Mail: </span>{customerEmail || '—'}</Text>
        <Text style={row}><span style={label}>Telefon: </span>{customerPhone || '—'}</Text>

        <Text style={sectionTitle}>Lieferadresse</Text>
        {shippingAddress ? (
          <Section style={addrBox}>
            <Text style={addrLine}>{shippingAddress.name || customerName}</Text>
            <Text style={addrLine}>{shippingAddress.line1}</Text>
            {shippingAddress.line2 ? <Text style={addrLine}>{shippingAddress.line2}</Text> : null}
            <Text style={addrLine}>
              {shippingAddress.postal_code} {shippingAddress.city}
            </Text>
            <Text style={addrLine}>{shippingAddress.country}</Text>
          </Section>
        ) : (
          <Text style={row}>—</Text>
        )}

        <Text style={sectionTitle}>Artikel</Text>
        <Section style={table}>
          {items.map((item, i) => (
            <Section key={i} style={tableRow}>
              <Text style={itemTitle}>{item.title}</Text>
              <Text style={itemMeta}>
                {item.quantity} × — {item.subtotal.toFixed(2).replace('.', ',')}&nbsp;€
              </Text>
            </Section>
          ))}
          <Section style={totalRow}>
            <Text style={totalLabel}>Gesamt</Text>
            <Text style={totalValue}>{total}&nbsp;€</Text>
          </Section>
        </Section>

        <Text style={footer}>
          Diese E-Mail wurde automatisch von Barbato Electronics versendet.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderNotificationEmail,
  subject: (data: Record<string, any>) =>
    `🛒 Neue Bestellung – ${data.total || '0,00'} € – ${data.customerName || 'Kunde'}`,
  to: SHOP_EMAIL,
  displayName: 'Bestelleingang',
  previewData: {
    sessionId: 'cs_test_demo_123',
    customerName: 'Max Mustermann',
    customerEmail: 'max@example.com',
    customerPhone: '+49 170 1234567',
    shippingAddress: {
      name: 'Max Mustermann',
      line1: 'Musterstraße 12',
      postal_code: '10115',
      city: 'Berlin',
      country: 'DE',
    },
    items: [
      { title: 'Formuler Z11 Pro Max 4K UHD Android IPTV Box', quantity: 1, subtotal: 229 },
    ],
    total: '229,00',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 8px' }
const meta = { fontSize: '12px', color: '#6b7280', margin: '0 0 24px' }
const sectionTitle = { fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '20px 0 8px', fontWeight: 600 }
const row = { fontSize: '14px', color: '#0f172a', margin: '4px 0' }
const label = { color: '#6b7280' }
const addrBox = { padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }
const addrLine = { fontSize: '14px', color: '#0f172a', margin: '2px 0' }
const table = { borderTop: '2px solid #0f172a', marginTop: '4px' }
const tableRow = { borderBottom: '1px solid #e5e7eb', padding: '8px 0' }
const itemTitle = { fontSize: '14px', color: '#0f172a', fontWeight: 600, margin: '0 0 2px' }
const itemMeta = { fontSize: '13px', color: '#6b7280', margin: 0 }
const totalRow = { padding: '12px 0', textAlign: 'right' as const }
const totalLabel = { display: 'inline-block', fontSize: '14px', fontWeight: 600, color: '#0f172a', marginRight: '12px' }
const totalValue = { display: 'inline-block', fontSize: '16px', fontWeight: 700, color: '#0f172a' }
const footer = { fontSize: '12px', color: '#9ca3af', marginTop: '24px' }
