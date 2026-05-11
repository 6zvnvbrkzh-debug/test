import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SHOP_EMAIL = 'barbato.electronics@gmail.com'

interface ContactMessageProps {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const ContactMessageEmail = ({
  name = '',
  email = '',
  subject = '',
  message = '',
}: ContactMessageProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Neue Kontaktanfrage von {name || email}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>📬 Neue Kontaktanfrage</Heading>
        <Section style={section}>
          <Text style={label}>Name</Text>
          <Text style={value}>{name || '—'}</Text>
          <Text style={label}>E-Mail</Text>
          <Text style={value}>{email || '—'}</Text>
          <Text style={label}>Betreff</Text>
          <Text style={value}>{subject || '—'}</Text>
        </Section>
        <Section style={messageSection}>
          <Text style={label}>Nachricht</Text>
          <Text style={messageText}>{message || '—'}</Text>
        </Section>
        <Text style={footer}>
          Antworte direkt auf diese E-Mail, um dem Kunden zu antworten.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactMessageEmail,
  subject: (data: Record<string, any>) =>
    `[Kontakt] ${data.subject || 'Neue Anfrage'}`,
  to: SHOP_EMAIL,
  displayName: 'Kontaktanfrage',
  previewData: {
    name: 'Max Mustermann',
    email: 'max@example.com',
    subject: 'Frage zum Formuler Z11',
    message: 'Hallo, ist der Formuler Z11 Pro Max noch verfügbar?',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 24px' }
const section = { marginBottom: '24px' }
const messageSection = { borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginTop: '8px' }
const label = { fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '0 0 4px' }
const value = { fontSize: '14px', color: '#0f172a', margin: '0 0 12px', fontWeight: 600 }
const messageText = { fontSize: '14px', color: '#0f172a', lineHeight: '1.6', whiteSpace: 'pre-wrap' as const, margin: 0 }
const footer = { fontSize: '12px', color: '#9ca3af', marginTop: '24px' }
