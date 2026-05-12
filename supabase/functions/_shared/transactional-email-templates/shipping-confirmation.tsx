import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface ShippingAddress {
  name?: string
  line1?: string
  line2?: string
  postal_code?: string
  city?: string
  country?: string
}

interface Props {
  customerName?: string
  orderId?: string
  trackingNumber?: string
  productTitle?: string
  shippingAddress?: ShippingAddress | null
}

const trackingUrl = (n: string) =>
  `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${encodeURIComponent(n)}`

const ShippingConfirmationEmail = ({
  customerName = '',
  orderId = '',
  trackingNumber = '',
  productTitle = '',
  shippingAddress = null,
}: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Deine Bestellung bei Barbato Electronics ist unterwegs</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Deine Bestellung ist unterwegs{customerName ? `, ${customerName}` : ''}!</Heading>
        <Text style={intro}>
          Gute Neuigkeiten: Wir haben dein Paket soeben an DHL übergeben.
          Du kannst die Lieferung jederzeit über den Link unten verfolgen.
        </Text>

        {productTitle ? (
          <>
            <Text style={sectionTitle}>Versendetes Produkt</Text>
            <Section style={box}>
              <Text style={lineText}>{productTitle}</Text>
            </Section>
          </>
        ) : null}

        <Text style={sectionTitle}>Sendungsnummer</Text>
        <Section style={trackingBox}>
          <Text style={trackingNumberStyle}>{trackingNumber}</Text>
        </Section>

        {trackingNumber ? (
          <Section style={{ textAlign: 'center', margin: '20px 0 8px' }}>
            <Button href={trackingUrl(trackingNumber)} style={button}>
              Sendung bei DHL verfolgen
            </Button>
          </Section>
        ) : null}

        {trackingNumber ? (
          <Text style={meta}>
            Direktlink:{' '}
            <Link href={trackingUrl(trackingNumber)} style={link}>
              {trackingUrl(trackingNumber)}
            </Link>
          </Text>
        ) : null}

        {shippingAddress ? (
          <>
            <Text style={sectionTitle}>Lieferadresse</Text>
            <Section style={box}>
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

        {orderId ? <Text style={meta}>Bestellreferenz: {orderId}</Text> : null}

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
  component: ShippingConfirmationEmail,
  subject: (data: Record<string, any>) =>
    `Deine Bestellung bei Barbato Electronics ist unterwegs${data.trackingNumber ? ` – ${data.trackingNumber}` : ''}`,
  displayName: 'Versandbestätigung (Kunde)',
  previewData: {
    customerName: 'Max Mustermann',
    orderId: 'cs_test_demo_123',
    trackingNumber: '00340434161094042557',
    productTitle: 'Formuler Z11 Pro Max 4K UHD Android IPTV Box',
    shippingAddress: {
      name: 'Max Mustermann',
      line1: 'Musterstraße 12',
      postal_code: '10115',
      city: 'Berlin',
      country: 'DE',
    },
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 12px' }
const intro = { fontSize: '14px', color: '#0f172a', lineHeight: '1.6', margin: '0 0 12px' }
const meta = { fontSize: '12px', color: '#6b7280', margin: '0 0 16px', wordBreak: 'break-all' as const }
const sectionTitle = { fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '20px 0 8px', fontWeight: 600 }
const box = { padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }
const trackingBox = { padding: '14px', backgroundColor: '#f1f5f9', borderRadius: '6px', borderLeft: '3px solid #0f172a' }
const trackingNumberStyle = { fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '0.5px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }
const lineText = { fontSize: '14px', color: '#0f172a', margin: 0 }
const addrLine = { fontSize: '14px', color: '#0f172a', margin: '2px 0' }
const button = { backgroundColor: '#0f172a', color: '#ffffff', padding: '12px 22px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }
const link = { color: '#0f172a', textDecoration: 'underline' }
const footer = { fontSize: '12px', color: '#9ca3af', marginTop: '24px', lineHeight: '1.6' }
