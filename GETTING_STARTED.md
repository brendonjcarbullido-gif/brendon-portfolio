# Get the portfolio running — step by step

Do these steps **manually on your computer** (a normal PowerShell/Terminal window works best). Cursor’s built-in terminal may not see Node if it was installed while Cursor was open—use a **new** external terminal after installing Node.

---

## Step 1 — Check if Node is installed

Open a **new** terminal **outside** of Cursor:

- **Windows:** Windows key → type `PowerShell` → open **Windows PowerShell**
- **Mac:** Cmd+Space → type `Terminal` → Enter

Run:

```bash
node -v
```

- **A)** You see a version like `v20.11.0` → Node is installed → go to **Step 3**
- **B)** Error like “not recognized” → Node is not installed → do **Step 2**

---

## Step 2 — Install Node.js (only if Step 1 failed)

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** build
3. Run the installer — Next through defaults
4. **Important:** Close the terminal when done and open a **brand new** window
5. Run `node -v` and `npm -v` — both should print versions

---

## Step 3 — Go to the project folder

**Windows:**

```powershell
cd "d:\Proj\ArtWorks\portfolio"
```

**Mac** (adjust to your path):

```bash
cd ~/path/to/portfolio
```

Confirm you see `package.json`, `app/`, `components/`, etc.:

- Windows: `dir` (or `ls`)
- Mac/Linux: `ls`

---

## Step 4 — Install dependencies

```bash
npm install
```

Takes 1–3 minutes. **Red** errors: stop and copy the full output for help. **Yellow** warnings are usually fine.

---

## Step 5 — Production build

```bash
npm run build
```

Takes 1–2 minutes.

- **Success:** Output includes route table and “Compiled successfully” → **Step 6**
- **Failure:** Copy **all** red error text (especially the first error) before continuing

---

## Windows: Turbopack / junction point errors

If you see `TurbopackInternalError` / “failed to create junction point” / “Incorrect function (os error 1)”, this project’s **`package.json` scripts already use Webpack** instead of Turbopack (`next dev --webpack` and `next build --webpack`). Delete `.next` and run `npm run build` again.

> Next.js 16 uses Turbopack by default; the supported way to opt out is the **`--webpack`** flag (not `--no-turbo`).

---

## Step 6 — Dev server

Only after Step 5 succeeds:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Stop the server: **Ctrl+C** in the terminal.

---

## Step 7 — Contact form (Resend)

1. [https://resend.com](https://resend.com) → free account  
2. Dashboard → **API Keys** → create key (starts with `re_`)  
3. Edit **`.env.local`** in the project root:
   - `RESEND_API_KEY=your_resend_api_key_here` → paste your real key  
4. Save, restart dev server (`Ctrl+C`, then `npm run dev` again)

Emails go to **brendonjcarbullido@gmail.com** (see `app/api/contact/route.ts`).

---

## Step 8 — Images & resume

Use these **exact paths** (JPG/PDF):

**Work (e.g. 1200×900 JPG):**

- `public/images/work/teeccino-rebrand.jpg`
- `public/images/work/anne-klein-campaign.jpg`
- `public/images/work/lotto-us-launch.jpg`
- `public/images/work/joseph-abboud.jpg`
- `public/images/work/kandeyce-jorden.jpg`
- `public/images/work/teeccino-packaging.jpg`

**Portrait (e.g. 800×1066 JPG):**

- `public/images/about/brendon-portrait.jpg`

**Resume (PDF):**

- `public/resume/Brendon_Carbullido_Resume.pdf`

---

## Step 9 — Social links

File: **`app/contact/page.tsx`**

Search for `href="#"` on LinkedIn / Instagram and replace with your real URLs.

---

## If something breaks

1. Copy the **full** error message  
2. Note which **step** you were on  
3. Share that with your AI assistant in Cursor  

The most useful log is usually from **`npm run build`**.
