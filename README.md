# Aftermath

Withdrawing from college mid-semester triggers a wave of scattered, 
high-stakes consequences: tuition refunds, financial aid repayment, 
transcript impact, health insurance, and scholarship eligibility, 
spread across five different university offices. Aftermath brings it 
all together in one place.

Built for the Stellic Pathfinders Challenge, using George Mason 
University's real, published Fall 2026 policies.

## What it does

Answer a few questions about your situation, and instantly see:

- **Tuition refund** — your exact percentage, based on GMU's real 
  sliding-scale schedule
- **Financial aid impact** — whether you owe money back under the 
  federal Title IV (R2T4) repayment rule
- **Transcript impact** — what shows up on your record, and by when 
  you need to act
- **Future aid eligibility** — how this affects Satisfactory Academic 
  Progress
- **Scholarship impact** — what to check with your scholarship provider
- **Health insurance impact** — how withdrawal timing affects your 
  coverage
- **Who reviews this** — every office involved, with ready-to-send 
  emails, direct phone numbers, and links to real GMU portals
- **Your Next Steps** — a personalized, printable checklist covering 
  everything from your withdrawal application to your parking permit

Alongside your results, Aftermath also shows alternatives many students 
don't know exist: a Leave of Absence, Selective Withdrawal, or Medical 
Incomplete.

## Try it

Live app: [aftermath-seven.vercel.app](https://aftermath-seven.vercel.app)

Click "Try an example scenario" to see a real sample case, or fill in 
your own details.

## Tech stack

- React + Vite
- Tailwind CSS (v4, theme tokens)
- Deployed on Vercel

## Local development

npm install
npm run dev

## Data sources

All policy figures are drawn from George Mason University's published 
Registrar, Financial Aid, Housing, and OIPS (International Programs & 
Services) pages, plus the Federal Student Aid Handbook, current as of 
Fall 2026. Every major result card cites its real source and a 
"policy checked" date. The rules engine is built so any university's 
policies can be substituted in.

## Built with

Claude Code, Codex, and Claude (Anthropic) for research, rules-engine 
design, and copy.

## Team

- Sai Toshit Raj Repala
- Rithvik Malay
