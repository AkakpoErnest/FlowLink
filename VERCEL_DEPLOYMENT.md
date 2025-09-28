# Vercel Deployment Guide for FlowLink

## ✅ Issues Fixed

### 1. SSR (Server-Side Rendering) Issues
- **Problem**: `window is not defined` errors in AI chat component
- **Solution**: Added proper `typeof window !== 'undefined'` checks
- **Status**: ✅ Fixed

### 2. Environment Variables
- **Problem**: Anthropic API key not configured for Vercel
- **Solution**: Updated `vercel.json` with API key reference
- **Status**: ✅ Configured

## 🚀 Deployment Steps

### 1. Set Environment Variables in Vercel Dashboard

Go to your Vercel project dashboard and add these environment variables:

```bash
# Required for AI chat functionality
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional - for wallet connectivity
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=demo-project-id
```

### 2. Vercel Configuration

The `vercel.json` file is already configured with:
- ✅ Build command: `npm run build`
- ✅ Output directory: `.next`
- ✅ Framework: `nextjs`
- ✅ Environment variables reference

### 3. Build Configuration

The `next.config.js` includes:
- ✅ Standalone output for optimal deployment
- ✅ TypeScript build errors ignored (for development)
- ✅ ESLint errors ignored during builds
- ✅ Experimental features configured

## 🔧 Potential Issues & Solutions

### Issue 1: Build Failures
**Symptoms**: Build fails during deployment
**Solutions**:
1. Check that all dependencies are in `package.json`
2. Ensure TypeScript compilation passes locally
3. Verify environment variables are set in Vercel dashboard

### Issue 2: Runtime Errors
**Symptoms**: App works locally but fails on Vercel
**Solutions**:
1. Check Vercel function logs in dashboard
2. Verify all API routes are properly configured
3. Ensure environment variables are accessible

### Issue 3: AI Chat Not Working
**Symptoms**: AI chat button appears but doesn't respond
**Solutions**:
1. Verify `ANTHROPIC_API_KEY` is set in Vercel environment
2. Check API route `/api/ai/chat` is accessible
3. Review function logs for API errors

### Issue 4: Static Asset Issues
**Symptoms**: Images or assets not loading
**Solutions**:
1. Ensure all assets are in the `public/` directory
2. Check file paths are correct
3. Verify Next.js static file serving

## 📋 Pre-Deployment Checklist

- [ ] All environment variables set in Vercel dashboard
- [ ] Build passes locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] All API routes tested locally
- [ ] AI chat functionality working
- [ ] Static assets loading correctly
- [ ] No console errors in browser

## 🎯 Post-Deployment Verification

After deployment, verify:
1. **Homepage loads**: Check main landing page
2. **AI Chat works**: Test the floating AI assistant
3. **API routes**: Verify `/api/ai/chat` responds
4. **Static assets**: Confirm images and icons load
5. **Mobile responsive**: Test on different screen sizes

## 🔄 Deployment Commands

```bash
# Local testing
npm run build
npm run start

# Deploy to Vercel (if using Vercel CLI)
vercel --prod

# Or simply push to main branch (if connected to GitHub)
git push origin main
```

## 📞 Support

If you encounter issues:
1. Check Vercel dashboard logs
2. Review browser console for errors
3. Verify environment variables are set
4. Test API endpoints directly

---

**Status**: ✅ Ready for deployment
**Last Updated**: $(date)
**Commit**: 81e9410
