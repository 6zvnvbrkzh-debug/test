import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  customerName?: string
  orderId?: string
  trackingNumber?: string
  productTitle?: string
}

const TrackingCreatedEmail = ({
  customerName = '',
  orderId = '',
  trackingNumber = '',
  productTitle = '',
}: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Versandetikett für deine Bestellung wurde erstellt</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          Versandetikett erstellt{customerName ? `, ${customerName}` : ''}!
        </Heading>
        <Text style={intro}>
          Wir haben das Versandetikett für deine Bestellung erstellt und deine
          Sendungsnummer ist jetzt verfügbar. Dein Paket wird in Kürze an
          DHL übergeben – sobald es tatsächlich auf den Weg geht,
          erhältst du eine separate Versandbestätigung von uns.
        </Text>

        {productTitle ? (
          <>
            <Text style={sectionTitle}>Bestellte Produkte</Text>
            <Section style={box}>
              <Text style={lineText}>{productTitle}</Text>
            </Section>
          </>
        ) : null}

        <Text style={sectionTitle}>Deine Sendungsnummer</Text>
        <Section style={trackingBox}>
          <Text style={trackingNumberStyle}>{trackingNumber}</Text>
        </Section>

        <Text style={hint}>
          Bitte beachte: Die Sendungsverfolgung bei DHL ist erst aktiv,
          sobald das Paket im Versandzentrum eingescannt wurde. Das kann
          ein paar Stunden dauern.
        </Text>

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
  component: TrackingCreatedEmail,
  subject: (data: Record<string, any>) =>
    `Versandetikett erstellt${data.trackingNumber ? ` – ${data.trackingNumber}` : ''}`,
  displayName: 'Versandetikett erstellt (Kunde)',
  previewData: {
    customerName: 'Max Mustermann',
    orderId: 'cs_test_demo_123',
    trackingNumber: '00340434161094042557',
    productTitle: 'Formuler Z11 Pro Max 4K UHD Android IPTV Box',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 12px' }
const intro = { fontSize: '14px', color: '#0f172a', lineHeight: '1.6', margin: '0 0 12px' }
const hint = { fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: '12px 0 16px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }
const meta = { fontSize: '12px', color: '#6b7280', margin: '0 0 16px', wordBreak: 'break-all' as const }
const sectionTitle = { fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '20px 0 8px', fontWeight: 600 }
const box = { padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }
const trackingBox = { padding: '14px', backgroundColor: '#f1f5f9', borderRadius: '6px', borderLeft: '3px solid #0f172a' }
const trackingNumberStyle = { fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '0.5px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }
const lineText = { fontSize: '14px', color: '#0f172a', margin: 0 }
const footer = { fontSize: '12px', color: '#9ca3af', marginTop: '24px', lineHeight: '1.6' }
