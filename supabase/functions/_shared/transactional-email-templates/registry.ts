/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as contactMessage } from './contact-message.tsx'
import { template as orderNotification } from './order-notification.tsx'
import { template as orderConfirmationCustomer } from './order-confirmation-customer.tsx'
import { template as shippingConfirmation } from './shipping-confirmation.tsx'
import { template as trackingCreated } from './tracking-created.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-message': contactMessage,
  'order-notification': orderNotification,
  'order-confirmation-customer': orderConfirmationCustomer,
  'shipping-confirmation': shippingConfirmation,
  'tracking-created': trackingCreated,
}
