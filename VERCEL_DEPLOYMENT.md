# Vercel Deployment Guide for Kuraz AI

## Quick Setup

### Step 1: Configure Environment Variables in Vercel

You need to add your environment variables in the Vercel dashboard:

1. Go to your project on Vercel: https://vercel.com/dashboard
2. Click on your project (Ada)
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:

```
Name: NEXT_PUBLIC_API_URL
Value: https://ada-backend-2tk9.onrender.com
Environment: Production, Preview, Development (select all)
```

### Step 2: Redeploy

After adding the environment variable:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click the **⋯** (three dots) menu
4. Select **Redeploy**

---

## Alternative: Using Vercel CLI

If you prefer using the command line:

### Install Vercel CLI
```bash
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Set Environment Variables via CLI
```bash
vercel env add NEXT_PUBLIC_API_URL
# When prompted, enter: https://ada-backend-2tk9.onrender.com
# Select: Production, Preview, Development
```

### Deploy
```bash
vercel --prod
```

---

## Environment Variables Explained

### NEXT_PUBLIC_API_URL
- **Purpose**: Backend API endpoint for the application
- **Value**: `https://ada-backend-2tk9.onrender.com`
- **Note**: The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser

---

## Build Configuration

The `next.config.mjs` file is already configured to:
- ✅ Ignore TypeScript errors during build
- ✅ Ignore ESLint errors during build
- ✅ Use standalone output for optimal deployment

---

## Troubleshooting

### Build Fails with TypeScript Errors
Already handled - TypeScript errors are ignored in `next.config.mjs`

### Build Fails with ESLint Errors
Already handled - ESLint errors are ignored in `next.config.mjs`

### Environment Variable Not Working
1. Make sure the variable name starts with `NEXT_PUBLIC_`
2. Redeploy after adding the variable
3. Check the variable is set for the correct environment (Production/Preview/Development)

### API Connection Issues
1. Verify your backend is running at: https://ada-backend-2tk9.onrender.com
2. Check CORS settings on your backend allow requests from your Vercel domain
3. Test the API endpoint directly in your browser

---

## Vercel Dashboard Quick Links

- **Project Settings**: https://vercel.com/[your-username]/ada/settings
- **Environment Variables**: https://vercel.com/[your-username]/ada/settings/environment-variables
- **Deployments**: https://vercel.com/[your-username]/ada/deployments

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Visit your deployed site
- [ ] Test the login functionality
- [ ] Verify API connection is working
- [ ] Check dashboard loads correctly
- [ ] Test booking flow
- [ ] Verify all pages load without errors
- [ ] Test on mobile devices

---

## Custom Domain (Optional)

To add a custom domain:

1. Go to **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain name
4. Follow the DNS configuration instructions

---

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main` branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

---

## Monitoring

Monitor your deployment:

1. **Analytics**: Settings → Analytics
2. **Logs**: Deployment → View Function Logs
3. **Performance**: Deployment → Speed Insights

---

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Support: https://vercel.com/support
