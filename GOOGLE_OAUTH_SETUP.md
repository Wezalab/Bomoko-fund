# Google OAuth Setup - Fixing Redirect URI Mismatch

## Error Description
You're encountering the error: **"redirect_uri_mismatch"** when trying to sign in with Google OAuth. This happens when the redirect URI in your Google Cloud Console doesn't match the one being used by your React application.

## Solution

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** → **Credentials**

### Step 2: Configure OAuth 2.0 Client ID
1. Find your OAuth 2.0 Client ID: `***`
2. Click on it to edit the configuration

### Step 3: Add Authorized Redirect URIs
Add these URIs to your **Authorized redirect URIs** list:

**For Local Development:**
```
http://localhost:5172
http://localhost:5173
http://localhost:5175
http://localhost:5176
http://localhost:5177
http://127.0.0.1:5172
http://127.0.0.1:5173
http://127.0.0.1:5175
http://127.0.0.1:5176
http://127.0.0.1:5177
```

**For Production ([bomoko.fund](https://bomoko.fund/)):**
```
https://bomoko.fund
https://www.bomoko.fund
```

### Step 4: Add Authorized Origins
Add these to your **Authorized JavaScript origins**:

**For Local Development:**
```
http://localhost:5172
http://localhost:5173
http://localhost:5175
http://localhost:5176
http://localhost:5177
http://127.0.0.1:5172
http://127.0.0.1:5173
http://127.0.0.1:5175
http://127.0.0.1:5176
http://127.0.0.1:5177
```

**For Production ([bomoko.fund](https://bomoko.fund/)):**
```
https://bomoko.fund
https://www.bomoko.fund
```

### Step 5: Save Changes
Click **Save** to apply the changes.

### Step 6: Restart Your Development Server
After saving the changes:
1. Stop your development server (`Ctrl+C`)
2. Start it again: `npm run dev` or `yarn dev`

## Additional Configuration

### Environment Variables
Make sure your `.env` file contains:
```env
VITE_GOOGLE_CLIENT_ID=***
VITE_GOOGLE_CLIENT_SECRET=***
```

### Common Issues and Solutions

1. **Still getting errors after configuration?**
   - Wait a few minutes for Google's changes to propagate
   - Clear your browser cache and cookies
   - Try incognito/private browsing mode

2. **Different port than the ones listed?**
   - Check your `vite.config.ts` for custom port configuration
   - Add any additional ports (5172, 5173, 5175, 5176, 5177) to your OAuth configuration

3. **Production deployment issues?**
   - Make sure https://bomoko.fund is added to the authorized origins
   - Verify that both https://bomoko.fund and https://www.bomoko.fund are configured

## Current Application Configuration

Your VentureWizard component is configured to use the `@react-oauth/google` library with:
- **Client ID**: `***`
- **Scope**: Basic profile information (email, name, picture)
- **Flow**: Authorization code flow with popup

## Testing
After configuration, test the Google OAuth by:
1. Go to the VentureWizard component
2. Navigate to the authentication step
3. Click "Sign in with Google"
4. Verify the popup opens without errors
5. Complete the authentication flow

If you continue to have issues, please share any new error messages you encounter. 