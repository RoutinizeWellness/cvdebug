# Deployment Configuration for vly.sh

## Package Manager
This project uses **npm** exclusively. Do NOT use pnpm, yarn, or bun.

## Build Configuration
- **Install Command**: `npm install --legacy-peer-deps`
- **Build Command**: `npm run build` or `./build.sh`
- **Output Directory**: `dist`
- **Node Version**: 20.x

## Environment Variables
The project requires these environment variables (configured in vly.sh dashboard):
- `VITE_CONVEX_URL`
- `CONVEX_SITE_URL`
- `CONVEX_DEPLOYMENT`
- `VITE_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `VITE_VLY_APP_ID`
- `VITE_VLY_MONITORING_URL`

## Important Files
- `.npmrc` - npm configuration with legacy-peer-deps enabled
- `package-lock.json` - npm lockfile (do not delete)
- `build.sh` - custom build script that ensures npm is used
- `.env.production` - production environment variables

## Troubleshooting
If build fails with "cp: cannot stat 'bun.lockb'", the platform is incorrectly trying to use Bun.
This project has NO bun.lockb file and should use package-lock.json for npm.
