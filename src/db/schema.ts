import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const offeringSourceTypeEnum = pgEnum('offering_source_type', [
  'manual',
  'website',
  'linkedin',
  'company',
  'mixed',
]);

export const extractionStatusEnum = pgEnum('extraction_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

export const outreachStatusEnum = pgEnum('outreach_status', [
  'draft',
  'sent',
  'archived',
]);
export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant']);

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

export const offerings = pgTable('offerings', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),

  offeringSummary: text('offering_summary'),
  idealCustomerProfile: text('ideal_customer_profile'),
  customerProblems: text('customer_problems'),
  keyDifferentiators: text('key_differentiators'),
  proofPoints: text('proof_points'),

  rawExtractedData: text('raw_extracted_data'),

  sourceType: offeringSourceTypeEnum('source_type').notNull().default('manual'),
  sourceUrl: text('source_url'),

  extractionStatus: extractionStatusEnum('extraction_status')
    .notNull()
    .default('pending'),

  metadata: jsonb('metadata').default({}).$type<{
    pageTitle?: string | null;
    pageDescription?: string | null;
    faviconUrl?: string | null;
    ogImageUrl?: string | null;
  }>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const prospects = pgTable('prospects', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),
  jobTitle: text('job_title'),
  company: text('company'),
  companyDescription: text('company_description'),
  bio: text('bio'),
  painPoints: text('pain_points'),
  skills: text('skills'),

  sourceType: offeringSourceTypeEnum('source_type').notNull().default('manual'),
  sourceUrl: text('source_url'),

  extractionStatus: extractionStatusEnum('extraction_status')
    .notNull()
    .default('pending'),

  rawExtractedData: text('raw_extracted_data'),

  metadata: jsonb('metadata').default({}).$type<{
    profileImageUrl?: string | null;
    location?: string | null;
  }>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const offeringRelations = relations(offerings, ({ one }) => ({
  user: one(user, {
    fields: [offerings.userId],
    references: [user.id],
  }),
}));

export const prospectRelations = relations(prospects, ({ one }) => ({
  user: one(user, {
    fields: [prospects.userId],
    references: [user.id],
  }),
}));

export const outreachMessages = pgTable('outreach_messages', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  offeringId: uuid('offering_id').references(() => offerings.id),
  prospectId: uuid('prospect_id').references(() => prospects.id),

  subjectLine: text('subject_line'),
  content: text('content').notNull(),
  tone: text('tone').default('professional'),
  customContext: text('custom_context'),

  status: outreachStatusEnum('status').notNull().default('draft'),
  rollingSummary: text('rolling_summary'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const conversationMessages = pgTable('conversation_messages', {
  id: uuid('id').defaultRandom().primaryKey(),

  outreachMessageId: uuid('outreach_message_id')
    .notNull()
    .references(() => outreachMessages.id, { onDelete: 'cascade' }),

  role: messageRoleEnum('role').notNull(),
  content: text('content').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const outreachMessageRelations = relations(
  outreachMessages,
  ({ one, many }) => ({
    user: one(user, {
      fields: [outreachMessages.userId],
      references: [user.id],
    }),
    offering: one(offerings, {
      fields: [outreachMessages.offeringId],
      references: [offerings.id],
    }),
    prospect: one(prospects, {
      fields: [outreachMessages.prospectId],
      references: [prospects.id],
    }),
    conversationMessages: many(conversationMessages),
  }),
);

export const conversationMessageRelations = relations(
  conversationMessages,
  ({ one }) => ({
    outreachMessage: one(outreachMessages, {
      fields: [conversationMessages.outreachMessageId],
      references: [outreachMessages.id],
    }),
  }),
);
