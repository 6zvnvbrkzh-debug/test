import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  code?: string
  amount?: string
  validUntil?: string | null
  shopUrl?: string
}

const GiftVoucherCodeEmail = ({
  code = '',
  amount = '0,00',
  validUntil = null,
  shopUrl = 'https://b-electronics.shop',
}: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Dein Barbato Electronics Geschenkgutschein über {amount}&nbsp;€</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Dein Geschenkgutschein ist da! 🎁</Heading>
        <Text style={intro}>
          Vielen Dank für deinen Kauf bei Barbato Electronics.
          Dein Gutschein im Wert von <strong>{amount}&nbsp;€</strong> ist sofort einsatzbereit.
        </Text>

        <Section style={codeBox}>
          <Text style={codeLabel}>Dein Gutschein-Code</Text>
          <Text style={codeValue}>{code}</Text>
          <Text style={codeAmount}>Guthaben: {amount}&nbsp;€</Text>
        </Section>

        <Text style={sectionTitle}>So funktioniert's</Text>
        <Text style={paragraph}>
          1. Produkte in den Warenkorb legen.<br />
          2. Im Warenkorb den Code oben eingeben und „Einlösen" klicken.<br />
          3. Den Rabatt nutzen oder Restguthaben für die nächste Bestellung im Konto sichern.
        </Text>

        <Section style={tipBox}>
          <Text style={tipText}>
            💡 <strong>Du möchtest den Gutschein verschenken?</strong> Leite diese E-Mail
            einfach weiter oder gib den Code persönlich an die beschenkte Person weiter –
            der Code ist frei übertragbar, bis er erstmals eingelöst wird.
          </Text>
        </Section>

        <Section style={tipBoxAlt}>
          <Text style={tipText}>
            🔒 <strong>Tipp für Restguthaben:</strong> Wenn du dich vor dem Einlösen
            mit einem Konto anmeldest, wird der Gutschein deinem Konto zugeordnet.
            Restguthaben bleibt dauerhaft erhalten und ist jederzeit unter
            „Mein Konto → Meine Gutscheine" abrufbar.
          </Text>
        </Section>

        {validUntil ? (
          <Text style={meta}>Gültig bis: <strong>{validUntil}</strong></Text>
        ) : (
          <Text style={meta}>Ohne Ablaufdatum – unbegrenzt einlösbar.</Text>
        )}

        <Text style={footer}>
          Bei Fragen erreichst du uns unter barbato.electronics@gmail.com.
          <br />
          Viel Freude beim Einkaufen — Barbato Electronics
          <br />
          <a href={shopUrl} style={link}>{shopUrl.replace(/^https?:\/\//, '')}</a>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: GiftVoucherCodeEmail,
  subject: (data: Record<string, any>) =>
    `🎁 Dein Barbato Electronics Geschenkgutschein über ${data.amount || '0,00'} €`,
  displayName: 'Geschenkgutschein-Code (Käufer)',
  previewData: {
    code: 'GIFT-A4K9P-X2RT7',
    amount: '50,00',
    validUntil: null,
    shopUrl: 'https://b-electronics.shop',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const intro = { fontSize: '15px', color: '#0f172a', lineHeight: '1.6', margin: '0 0 20px' }
const paragraph = { fontSize: '14px', color: '#0f172a', lineHeight: '1.7', margin: '0 0 16px' }
const meta = { fontSize: '13px', color: '#6b7280', margin: '20px 0 0', textAlign: 'center' as const }

const codeBox = {
  padding: '24px',
  backgroundColor: '#1e3a8a',
  borderRadius: '10px',
  textAlign: 'center' as const,
  margin: '24px 0',
}
const codeLabel = {
  fontSize: '11px',
  color: '#bfdbfe',
  textTransform: 'uppercase' as const,
  letterSpacing: '1.5px',
  margin: '0 0 8px',
  fontWeight: 600,
}
const codeValue = {
  fontSize: '26px',
  color: '#ffffff',
  fontWeight: 700,
  letterSpacing: '2px',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  margin: '0 0 8px',
}
const codeAmount = {
  fontSize: '14px',
  color: '#dbeafe',
  margin: 0,
  fontWeight: 500,
}

const sectionTitle = { fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '24px 0 10px', fontWeight: 600 }

const tipBox = { padding: '14px 16px', backgroundColor: '#f0f9ff', borderLeft: '3px solid #3b82f6', borderRadius: '4px', margin: '14px 0' }
const tipBoxAlt = { padding: '14px 16px', backgroundColor: '#f9fafb', borderLeft: '3px solid #94a3b8', borderRadius: '4px', margin: '14px 0' }
const tipText = { fontSize: '13px', color: '#0f172a', lineHeight: '1.6', margin: 0 }

const footer = { fontSize: '12px', color: '#9ca3af', marginTop: '28px', lineHeight: '1.7', textAlign: 'center' as const }
const link = { color: '#3b82f6', textDecoration: 'none' }
