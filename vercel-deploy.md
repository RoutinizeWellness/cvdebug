# Deploy a Vercel

## Pasos:

1. Ve a https://vercel.com
2. Conecta tu repositorio GitHub: RoutinizeWellness/cvdebug-app
3. Configura el proyecto:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`

4. Variables de entorno (agregar en Vercel dashboard):
   ```
   VITE_CONVEX_URL=https://next-cod-660.convex.cloud
   CONVEX_SITE_URL=[tu-url-de-vercel].vercel.app
   CONVEX_DEPLOYMENT=dev:next-cod-660
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_aG9wZWZ1bC1kb2UtNTYuY2xlcmsuYWNjb3VudHMuZGV2JA
   CLERK_SECRET_KEY=sk_test_1G5YqDc3bUAhRl3XAPjZXbwvm0NcPmendZ5VQTCyQT
   VITE_VLY_APP_ID=lazy-badgers-roll
   VITE_VLY_MONITORING_URL=https://runtime-monitoring.vly.ai/runtime-error
   ```

5. Click "Deploy"

Tu app estará funcionando en 2-3 minutos.
