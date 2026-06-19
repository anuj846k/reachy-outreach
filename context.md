# Personalized Outreach Dashboard - Project Context

## Overview
A full stack dashboard that helps users generate hyper-personalized outreach messages for their prospects, manage conversations, and handle replies, all powered by AI.

## Core Flow
1. User signs in
2. Sets up their offering (what they sell/promote)
3. Customizes how they want messages to sound (system prompt)
4. Adds prospect details (URLs, screenshots, etc.)
5. Gets back a personalized outreach message that sounds human-written
6. If prospect replies, user pastes it in and gets a contextual response

## Core Pieces

### 1. Authentication
- Sign up and sign in required
- Each user has their own: offerings, prompts, prospects, message history
- **Better Auth** preferred
- Don't over-invest in auth, get it working and move on

### 2. Offering Setup
Users build their offering in multiple ways:
- Paste a website URL → app scrapes and extracts offering automatically
- Type it out manually in their own words
- Do both (scrape + edit/add context)
- Offering includes: what they do, who they sell to, problem they solve, differentiation, proof points
- Users can create and manage **multiple offerings**
- Each offering fully editable at any time
- **AI inline help**: Explain what an offering is in plain language

### 3. Prompt Customization
- Users fully customize the system prompt driving message generation
- Controls: tone, length, angle, emphasis, avoidance, opening, closing
- Prompt sent directly to AI as system prompt
- Prospect details = context
- Offering = direction
- Fully editable at any time
- **AI inline help**: Explain what a prompt is and how to write a good one

### 4. Prospect Management
- Save prospects and reuse across offerings
- Flexible input - user adds any combination:
  - LinkedIn profile screenshot (image upload)
  - GitHub profile URL
  - Personal website/portfolio URL
  - Company website
  - Any other URL or context
- No fixed format - add whatever they have
- App scrapes/reads URLs and extracts context from screenshots

### 5. Message Generation
- Combine: selected offering + customized prompt + prospect context
- Generate personalized outreach message that sounds human-written
- Every generation saved to prospect's history
- Features:
  - Rate messages
  - Mark favourites
  - Copy with one click
  - Delete unwanted
  - Regenerate with different tone/angle without re-entering prospect details

### 6. Reply Handling
- User pastes prospect reply into platform
- App generates contextual response that continues conversation naturally
- Keeps tone and full context of original message + prospect details
- Conversation thread visible for full picture

### 7. Basic Analytics
Simple dashboard showing:
- Total messages generated
- Which offerings used most
- Number of prospects saved
- Number of conversations with replies
- Nothing complex - just enough to show data thinking

## Real Example
**User**: Ayush
**Offering**: Reachy (example - app scrapes and saves)
**Prompt**: Conversational tone, under 100 words, lead with relevant observation about prospect before mentioning Reachy, never salesy, end with soft question
**Prospect**: Sarah
- GitHub profile
- Portfolio URL
- Company website
- LinkedIn screenshot
**App understands**: Sarah is sales engineer at B2B SaaS, technical background, recently posted about outreach volume struggles, company sells to mid-market teams
**Generated Message**: "Hey Sarah, saw your post about the outreach volume problem last week. Funny timing, I have been building something that a few sales engineers have been using to handle exactly that. Reachy runs the full LinkedIn conversation for you, qualification and all. Worth a quick look?"
**Sarah replies**: "Interesting, how does it actually work? Does it need access to my LinkedIn account?"
**App generates**: Natural follow-up addressing her question directly, same tone, keeps conversation moving

## What They Care About (Grading Criteria)
1. **Message quality actually matters** - they will read every generated output and judge whether it's good
2. **Prompt and offering customization should meaningfully change output** - they will test it
3. **Prospect input should be flexible** - they will try different URL/screenshot combinations
4. **Reply handling should feel like natural continuation** - not a fresh generation
5. **Analytics should be accurate and useful** - not complex but correct
6. **App should be deployed and accessible** - they will use it end to end
7. **Code should be readable, clean, structured for growth**

## Preferred Tech Stack
- Next.js (already set up)
- TypeScript (already set up)
- Postgres with Drizzle ORM (already set up)
- Node.js
- Better Auth (already set up)
- Inngest for background AI processing (already set up)
- Google Generative AI (already set up with Gemini)
- Any scraping library or API
- Deployed on Railway, Vercel, or any platform

## Current Project State
- Next.js 16.2.6 with App Router
- Better Auth configured
- Drizzle ORM with Postgres (Neon)
- Inngest set up for background jobs
- AI SDK Google configured (Gemini 2.5 Flash)
- Test button working on homepage (calls Server Action → Inngest → Gemini)
- Basic project structure in place

## What to Submit
1. Public GitHub repo with clean README (local setup, architecture, env vars, tradeoffs, future improvements)
2. Live deployed link that works
3. Video walkthrough (sign in → offering → prompt → prospect → message → reply → analytics)
4. Real examples in README showing actual inputs and generated messages

## What Separates Good from Great
- **Good**: Works end to end, clean code, all core pieces present
- **Great**: Genuinely impressive messages/replies, customization clearly affects output quality, handles multiple prospect inputs gracefully, looks good, README and video show real product thinking about what was built and what comes next
