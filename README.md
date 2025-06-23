# 🔒 Secure Secret Sharing Platform

![Secure Secret Sharing Banner](![alt text](image.png))

## 🚀 Project Overview

**Secure Secret Sharing Platform** empowers users to share confidential information safely and temporarily. With end-to-end encryption, one-time access, auto-expiring secrets, and optional password protection, your sensitive data is always under your control. Built with Next.js, TypeScript, tRPC, Supabase (PostgreSQL), and a modern UI, this platform is fast, intuitive, and privacy-first.

---

## ✨ Features

- **End-to-End Encryption**: Secrets are encrypted in the browser before leaving your device.
- **One-Time Access**: Enable secrets to self-destruct after a single view.
- **Auto-Expiring Secrets**: Set expiration (1 hour, 24 hours, 7 days, or custom).
- **Password Protection**: Optionally require a password to view a secret.
- **Unique Secret URLs**: Each secret generates a unique, shareable link.
- **User Authentication**: Secure sign-up/sign-in for managing your secrets.
- **Personal Dashboard**: View, search, update, and delete your secrets. Monitor status (active, viewed, expired).
- **Search & Filter**: Quickly find secrets by ID or status.
- **Rate Limiting**: Prevents abuse and brute-force attacks.
- **Modern UI**: Responsive, accessible, and visually appealing.


---

## 🛠️ Installation & Usage

### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/secure-secrets.git
cd secure-secrets/project
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Configure Environment Variables**

Create a `.env.local` file in the `project/` directory:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ENCRYPTION_KEY=your_server_encryption_key
```

### 4. **Run the Development Server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

### 5. **Build for Production**

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
project/
├── app/                # Next.js app directory (pages, layouts, routes)
│   ├── page.tsx        # Home page (create secret)
│   ├── dashboard/      # User dashboard
│   ├── auth/           # Authentication pages
│   └── secret/[id]/    # Secret viewing page
├── components/         # UI and layout components
├── lib/                # Supabase, tRPC, utilities
├── server/             # tRPC routers, rate limiting
├── scripts/            # Maintenance scripts
├── public/             # (Add your images/screenshots here)
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

---

## 🔑 SEO Keywords

- secure secret sharing
- one-time secret
- encrypted message
- temporary secret link
- confidential sharing app
- Next.js secret sharing
- privacy-first messaging
- ephemeral secrets
- password-protected secret
- end-to-end encryption

---

## 📖 Detailed Documentation

### Secret Creation

- Enter your secret in the form.
- (Optional) Set a password for extra protection.
- Choose expiration: 1 hour, 24 hours, 7 days, or custom date/time.
- Enable "One-Time Access" to make the secret self-destruct after first view.
- Click "Create Secret Link" to generate a unique URL.

### Secret Viewing

- Open the unique URL to view the secret.
- If password-protected, enter the password to reveal.
- If one-time access, the secret is destroyed after viewing.
- Expired or already-viewed secrets show a clear message.

### User Dashboard

- Sign up or sign in to manage your secrets.
- View all your secrets, their status, and expiration.
- Edit or delete secrets as needed.
- Use the search bar to filter by ID or status.

### Security & Privacy

- All secrets are encrypted in the browser before upload.
- Passwords are hashed and never stored in plain text.
- Rate limiting prevents brute-force and spam.
- Expired and viewed secrets are deleted automatically.

### Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, Radix UI
- **Backend:** tRPC, Supabase (PostgreSQL), Node.js
- **Security:** AES-GCM encryption, bcrypt password hashing
- **State/Data:** React Query, tRPC

---

## 💡 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [tRPC](https://trpc.io/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)

---

> Made with ❤️ for privacy and security enthusiasts.
