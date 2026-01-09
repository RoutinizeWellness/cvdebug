# CVDebug - Guía de Branding

## 📝 Nombre de la Marca

### ✅ CORRECTO - CVDebug (D mayúscula)
Usar en:
- **Logos y branding visual**
- **Títulos y headers** (H1, H2, etc.)
- **Comunicaciones oficiales** (emails, documentos)
- **UI y componentes** (botones, labels, etc.)
- **Marketing materials**
- **Meta tags y SEO**

Ejemplos:
```
"Welcome to CVDebug!"
"CVDebug - ATS Resume Optimizer"
<Logo>CVDebug</Logo>
```

### ✅ TAMBIÉN CORRECTO - cvdebug (todo minúscula)
Usar SOLO en:
- **URLs y dominios**: `cvdebug.com`, `https://cvdebug.com`
- **Emails**: `cvdebug@cvdebug.com`, `enterprise@cvdebug.com`
- **Comandos de terminal**: `root@cvdebug:~$`
- **Rutas de sistema**: `/var/log/cvdebug/`
- **Variables de código** (si es necesario): `cvdebug_api_key`

### ❌ INCORRECTO
- CVdebug (d minúscula mezclada) - ❌ Inconsistente
- CV Debug (con espacio) - ❌ Separado
- cv-debug (con guión) - ❌ No es nuestra marca

## 🎨 Logo

### URL del Logo
```
https://harmless-tapir-303.convex.cloud/api/storage/5768dbac-7c15-4d7f-bf24-73eff8671dc0
```

### Uso del Logo
El componente `<Logo />` se encuentra en `/src/components/Logo.tsx`

**Propiedades:**
```typescript
<Logo
  showText={true}           // Muestra/oculta el texto "CVDebug"
  variant="default"         // "default" | "light"
  className=""              // Clases adicionales
  iconClassName=""          // Clases para el ícono
  textClassName=""          // Clases para el texto
/>
```

### Variantes del Logo

#### 1. Logo Completo (Icono + Texto)
```tsx
<Logo showText={true} />
```
**Uso:** Navbar, Footer, Landing pages

#### 2. Solo Icono
```tsx
<Logo showText={false} />
```
**Uso:** Mobile navbar colapsado, favicon, app icon

## 🎨 Colores de Marca

### Paleta Principal
```css
--primary: #3B82F6      /* Electric Blue */
--secondary: #8B5CF6    /* Vibrant Violet */
--midnight: #0F172A     /* Background Dark */
--slate-deep: #1E293B   /* Secondary Background */
```

### Gradientes
```css
/* Logo Gradient (default) */
background: linear-gradient(to right, var(--foreground), var(--primary), var(--foreground));

/* Logo Gradient (light variant) */
background: linear-gradient(to right, white, var(--primary), white);

/* Premium Gradient */
background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
```

## ✍️ Tipografía

### Logo
- **Font Family:** 'Space Grotesk', 'Inter', sans-serif
- **Weight:** 800 (Black)
- **Size:** text-xl (1.25rem / 20px)
- **Tracking:** tracking-tight
- **Gradient:** bg-gradient-to-r bg-clip-text

### Body Text
- **Font Family:** 'Inter', sans-serif
- **Weights disponibles:** 400, 500, 600, 700, 800

## 🔤 Capitalización

### En código/UI:
- **Marca completa:** "CVDebug"
- **Taglines:** Title Case
  - ✅ "Debug Your Resume. Compile Your Career."
  - ❌ "debug your resume. compile your career."

### En metadata:
```html
<title>CVDebug - ATS Resume Optimizer</title>
<meta name="description" content="CVDebug helps you optimize your resume for ATS systems" />
```

## 📍 Ubicaciones del Logo en el Código

### Componentes Principales
1. `/src/components/Logo.tsx` - Componente principal
2. `/src/components/LogoDropdown.tsx` - Logo con dropdown
3. `/src/components/landing/NewNavbar.tsx` - Navbar landing
4. `/src/components/dashboard/mission-control/Sidebar.tsx` - Dashboard sidebar

### Páginas que usan el logo
- Landing page
- Dashboard
- Auth page
- Admin panel
- Preview scan
- Todas las industry-specific pages

## 🎯 Uso Correcto en Diferentes Contextos

### 1. Headers & Navigation
```tsx
<Logo showText={true} variant="default" />
```

### 2. Footer
```tsx
<Logo showText={true} variant="light" />
<p>© 2024 CVDebug Inc. All rights reserved.</p>
```

### 3. Emails
```
Subject: Welcome to CVDebug!
Body: Thanks for joining CVDebug...
```

### 4. Social Media
- **Twitter/X:** @CVDebug
- **LinkedIn:** CVDebug
- **Hashtags:** #CVDebug #ATSOptimizer

## 🚫 Errores Comunes a Evitar

1. ❌ Escribir "CVdebug" con d minúscula
2. ❌ Separar con espacio "CV Debug"
3. ❌ Usar diferentes fuentes para el logo
4. ❌ Cambiar los colores del gradiente
5. ❌ Estirar o distorsionar el logo
6. ❌ Usar versiones antiguas del logo

## ✅ Checklist de Implementación

Al agregar el logo a un nuevo componente:
- [ ] Importar el componente `Logo` desde `@/components/Logo`
- [ ] Usar la prop `showText` según el contexto
- [ ] Verificar que dice "CVDebug" (con D mayúscula)
- [ ] Aplicar variante correcta (default/light)
- [ ] Comprobar responsive design
- [ ] Verificar hover states y animaciones

## 📚 Recursos

### Fonts
- **Google Fonts:** Inter - https://fonts.google.com/specimen/Inter
- **Google Fonts:** Space Grotesk - https://fonts.google.com/specimen/Space+Grotesk

### Icons
- **Material Symbols:** https://fonts.google.com/icons

### Documentación Tailwind
- **Colors:** https://tailwindcss.com/docs/customizing-colors
- **Typography:** https://tailwindcss.com/docs/font-family

---

**Última actualización:** 2024-01-09
**Versión:** 1.0.0
