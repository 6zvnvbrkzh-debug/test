import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

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

interface Props {
  sessionId?: string
  customerName?: string
  shippingAddress?: ShippingAddress | null
  items?: OrderItem[]
  total?: string
}

const OrderConfirmationCustomerEmail = ({
  sessionId = '',
  customerName = '',
  shippingAddress = null,
  items = [],
  total = '0,00',
}: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Vielen Dank für deine Bestellung bei Barbato Electronics</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Vielen Dank{customerName ? `, ${customerName}` : ''}!</Heading>
        <Text style={intro}>
          Wir haben deine Bestellung erhalten und bearbeiten sie schnellstmöglich.
          Du erhältst eine weitere E-Mail, sobald dein Paket versendet wurde.
        </Text>
        {sessionId ? <Text style={meta}>Bestellreferenz: {sessionId}</Text> : null}

        <Text style={sectionTitle}>Deine Bestellung</Text>
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

        {shippingAddress ? (
          <>
            <Text style={sectionTitle}>Lieferadresse</Text>
            <Section style={addrBox}>
              <Text style={addrLine}>{shippingAddress.name || customerName}</Text>
              <Text style={addrLine}>{shippingAddress.line1}</Text>
              {shippingAddress.line2 ? <Text style={addrLine}>{shippingAddress.line2}</Text> : null}
              <Text style={addrLine}>
                {shippingAddress.postal_code} {shippingAddress.city}
              </Text>
              <Text style={addrLine}>{shippingAddress.country}</Text>
            </Section>
          </>
        ) : null}

        <Text style={footer}>
          Bei Fragen erreichst du uns unter barbato.electronics@gmail.com.
          <br />
          Vielen Dank für dein Vertrauen — Barbato Electronics
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmationCustomerEmail,
  subject: (data: Record<string, any>) =>
    `Deine Bestellung bei Barbato Electronics – ${data.total || '0,00'} €`,
  displayName: 'Bestellbestätigung (Kunde)',
  previewData: {
    sessionId: 'cs_test_demo_123',
    customerName: 'Max Mustermann',
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
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 12px' }
const intro = { fontSize: '14px', color: '#0f172a', lineHeight: '1.6', margin: '0 0 12px' }
const meta = { fontSize: '12px', color: '#6b7280', margin: '0 0 24px' }
const sectionTitle = { fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '20px 0 8px', fontWeight: 600 }
const addrBox = { padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }
const addrLine = { fontSize: '14px', color: '#0f172a', margin: '2px 0' }
const table = { borderTop: '2px solid #0f172a', marginTop: '4px' }
const tableRow = { borderBottom: '1px solid #e5e7eb', padding: '8px 0' }
const itemTitle = { fontSize: '14px', color: '#0f172a', fontWeight: 600, margin: '0 0 2px' }
const itemMeta = { fontSize: '13px', color: '#6b7280', margin: 0 }
const totalRow = { padding: '12px 0', textAlign: 'right' as const }
const totalLabel = { display: 'inline-block', fontSize: '14px', fontWeight: 600, color: '#0f172a', marginRight: '12px' }
const totalValue = { display: 'inline-block', fontSize: '16px', fontWeight: 700, color: '#0f172a' }
const footer = { fontSize: '12px', color: '#9ca3af', marginTop: '24px', lineHeight: '1.6' }
