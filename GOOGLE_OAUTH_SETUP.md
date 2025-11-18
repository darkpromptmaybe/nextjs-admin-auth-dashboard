# Google OAuth Setup Instructions

To enable Google Sign-In, you need to set up Google OAuth credentials. Follow these steps:

## 1. Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

## 2. Create or Select a Project
1. If you don't have a project, click "New Project" and create one
2. If you have a project, select it from the dropdown

## 3. Enable Google+ API (or Google Identity)
1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on it and press "Enable"

## 4. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" for testing
   - Fill in required fields (App name, User support email, etc.)
   - Add your email to test users

## 5. Configure OAuth Client ID
1. Choose "Web application" as application type
2. Give it a name (e.g., "NextJS Admin Dashboard")
3. Under "Authorized redirect URIs", add:
   ```
   http://localhost:5001/api/auth/callback/google
   ```
4. Click "Create"

## 6. Copy Your Credentials
1. Copy the "Client ID" and "Client secret"
2. Update your `.env.local` file:
   ```env
   GOOGLE_CLIENT_ID="your-actual-client-id-here"
   GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
   ```

## 7. Test the Integration
1. Restart your development server
2. Go to http://localhost:5001/login
3. Click "Sign in with Google"
4. You should be redirected to Google's login page

## Important Notes
- Keep your client secret secure and never commit it to version control
- For production, add your production domain to authorized redirect URIs
- Make sure NEXTAUTH_URL in .env.local matches your current domain/port

## Troubleshooting
- If you get "redirect_uri_mismatch", check your redirect URI in Google Console
- If you get "access_denied", make sure you're added as a test user in OAuth consent screen
- If the button doesn't appear, check the console for any JavaScript errors

## Current Status
Your app is configured to automatically detect when Google OAuth is properly set up. If credentials are not configured or are placeholder values, the Google sign-in button will not appear on the login page.