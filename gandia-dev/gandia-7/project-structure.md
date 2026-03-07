# 📁 Estructura del Proyecto — gandia-7

> Generado: 28/2/2026, 3:42:39 p.m.
> Versión: `0.0.0` · Framework: `Vite + React`

## 📊 Resumen

| Métrica | Valor |
|---|---|
| Total archivos | 124 |
| Componentes (.tsx/.jsx) | 16 |
| Páginas | 45 |
| Dependencias | 7 |
| Dev dependencies | 17 |

## 🔑 Dependencias principales

- `@supabase/supabase-js` ^2.96.0
- `lucide-react` ^0.563.0
- `mongodb` ^7.1.0
- `react` ^19.2.0
- `react-dom` ^19.2.0
- `react-router-dom` ^7.13.0
- `resend` ^6.9.2

## 🛠️ Scripts disponibles

- `npm run dev` → `vite`
- `npm run build` → `tsc -b && vite build`
- `npm run lint` → `eslint .`
- `npm run preview` → `vite preview`

## 🗂️ Árbol de archivos

```
gandia-7/
├── 📁 **docs/**
│   └── 📝 TEAM_GUIDE.md _(8.8KB)_
├── 📁 **gandia-cms/**
│   ├── 📁 **media/**
│   │   └── 📄 photo-1500595046743-cd271d694d30q=80&w=874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA== _(76.8KB)_
│   ├── 📁 **src/**
│   │   ├── 📁 **app/**
│   │   │   ├── 📁 **(frontend)/**
│   │   │   │   ├── ⚛️  layout.tsx _(400B)_
│   │   │   │   ├── ⚛️  page.tsx _(1.8KB)_
│   │   │   │   └── 🎨 styles.css _(2.3KB)_
│   │   │   ├── 📁 **(payload)/**
│   │   │   │   ├── 📁 **admin/**
│   │   │   │   │   ├── 📁 **[[...segments]]/**
│   │   │   │   │   │   ├── ⚛️  not-found.tsx _(731B)_
│   │   │   │   │   │   └── ⚛️  page.tsx _(715B)_
│   │   │   │   │   └── 🟨 importMap.js _(6.0KB)_
│   │   │   │   ├── 📁 **api/**
│   │   │   │   │   ├── 📁 **[...slug]/**
│   │   │   │   │   │   └── 🔷 route.ts _(550B)_
│   │   │   │   │   ├── 📁 **graphql/**
│   │   │   │   │   │   └── 🔷 route.ts _(315B)_
│   │   │   │   │   └── 📁 **graphql-playground/**
│   │   │   │   │       └── 🔷 route.ts _(305B)_
│   │   │   │   ├── 🎨 custom.scss _(0B)_
│   │   │   │   └── ⚛️  layout.tsx _(810B)_
│   │   │   └── 📁 **my-route/**
│   │   │       └── 🔷 route.ts _(287B)_
│   │   ├── 📁 **collections/**
│   │   │   ├── 🔷 Authors.ts _(692B)_
│   │   │   ├── 🔷 Categories.ts _(1.1KB)_
│   │   │   ├── 🔷 Media.ts _(255B)_
│   │   │   ├── 🔷 Posts.ts _(2.6KB)_
│   │   │   └── 🔷 Users.ts _(244B)_
│   │   ├── 🔷 payload-types.ts _(10.3KB)_
│   │   └── 🔷 payload.config.ts _(1.3KB)_
│   ├── 📁 **tests/**
│   │   ├── 📁 **e2e/**
│   │   │   ├── 🔷 admin.e2e.spec.ts _(1.4KB)_
│   │   │   └── 🔷 frontend.e2e.spec.ts _(531B)_
│   │   ├── 📁 **helpers/**
│   │   │   ├── 🔷 login.ts _(750B)_
│   │   │   └── 🔷 seedUser.ts _(876B)_
│   │   └── 📁 **int/**
│   │       └── 🔷 api.int.spec.ts _(467B)_
│   ├── 📝 AGENTS.md _(25.6KB)_
│   ├── 📄 docker-compose.yml _(915B)_
│   ├── 📄 Dockerfile _(2.4KB)_
│   ├── 📄 eslint.config.mjs _(959B)_
│   ├── 🔷 next-env.d.ts _(216B)_
│   ├── 📄 next.config.mjs _(453B)_
│   ├── 📋 package-lock.json _(**465KB**)_
│   ├── 📋 package.json _(2.0KB)_
│   ├── 🔷 playwright.config.ts _(1.2KB)_
│   ├── 📝 README.md _(3.2KB)_
│   ├── 🔐 test.env _(62B)_
│   ├── 📋 tsconfig.json _(762B)_
│   ├── 📄 vitest.config.mts _(332B)_
│   └── 🔷 vitest.setup.ts _(87B)_
├── 📁 **public/**
│   ├── 🖼️  ternero404.png _(**2115KB**)_
│   └── 🖼️  vite.svg _(1.5KB)_
├── 📁 **src/**
│   ├── 📁 **app/**
│   │   ├── ⚛️  App.tsx _(4.0KB)_
│   │   └── ⚛️  Router.tsx _(8.4KB)_
│   ├── 📁 **artifacts/**
│   │   ├── 📁 **passport/**
│   │   │   ├── 🔷 mockData.ts _(2.9KB)_
│   │   │   ├── ⚛️  PassportArtifact.tsx _(41.6KB)_
│   │   │   └── ⚛️  PassportCard.tsx _(7.5KB)_
│   │   └── ⚛️  ArtifactShell.tsx _(2.0KB)_
│   ├── 📁 **assets/**
│   ├── 📁 **components/**
│   │   └── 📁 **ui/**
│   │       ├── ⚛️  Footer.tsx _(24.3KB)_
│   │       ├── ⚛️  Header.tsx _(9.6KB)_
│   │       └── ⚛️  ProfileBanner.tsx _(4.9KB)_
│   ├── 📁 **context/**
│   │   ├── ⚛️  NotificationsContext.tsx _(6.8KB)_
│   │   └── ⚛️  UserContext.tsx _(5.2KB)_
│   ├── 📁 **layout/**
│   │   ├── ⚛️  AppLayout.tsx _(38.2KB)_
│   │   └── ⚛️  PublicLayout.tsx _(1.2KB)_
│   ├── 📁 **lib/**
│   │   ├── 🔷 authService.ts _(17.7KB)_
│   │   ├── 🔷 chatService.ts _(17.1KB)_
│   │   ├── 🔷 supabaseClient.ts _(530B)_
│   │   └── 🔷 tramitesService.ts _(16.0KB)_
│   ├── 📁 **pages/**
│   │   ├── 📁 **Admin/**
│   │   │   └── ⚛️  AdminPanel.tsx _(55.5KB)_
│   │   ├── 📁 **Blog/**
│   │   │   ├── ⚛️  BlogPage.tsx _(60.7KB)_
│   │   │   └── ⚛️  BlogPostPage.tsx _(48.3KB)_
│   │   ├── 📁 **Chat/**
│   │   │   └── ⚛️  Chat.tsx _(84.7KB)_
│   │   ├── 📁 **Compliance/**
│   │   │   └── ⚛️  CompliancePage.tsx _(32.5KB)_
│   │   ├── 📁 **Configuraciones/**
│   │   │   └── ⚛️  Configuraciones.tsx _(52.5KB)_
│   │   ├── 📁 **Contacto/**
│   │   │   └── ⚛️  ContactoPage.tsx _(40.3KB)_
│   │   ├── 📁 **help/**
│   │   │   └── ⚛️  help.tsx _(17.4KB)_
│   │   ├── 📁 **Historial/**
│   │   │   └── ⚛️  Historial.tsx _(39.0KB)_
│   │   ├── 📁 **Home/**
│   │   │   └── ⚛️  Home.tsx _(96.9KB)_
│   │   ├── 📁 **Legal/**
│   │   │   └── ⚛️  LegalPage.tsx _(36.2KB)_
│   │   ├── 📁 **Login/**
│   │   │   └── ⚛️  Login.tsx _(36.3KB)_
│   │   ├── 📁 **ModeloOperativo/**
│   │   │   └── ⚛️  ModeloOperativoPage.tsx _(63.9KB)_
│   │   ├── 📁 **NotFound/**
│   │   │   └── ⚛️  NotFound.tsx _(3.9KB)_
│   │   ├── 📁 **Noticias/**
│   │   │   ├── ⚛️  NoticiaDetallePage.tsx _(30.1KB)_
│   │   │   └── ⚛️  NoticiasPage.tsx _(31.4KB)_
│   │   ├── 📁 **Notificaciones/**
│   │   │   ├── ⚛️  Notificaciones.tsx _(14.1KB)_
│   │   │   └── ⚛️  NotificacionesPage.tsx _(18.0KB)_
│   │   ├── 📁 **Onboarding/**
│   │   │   ├── ⚛️  OnboardingPage.tsx _(32.6KB)_
│   │   │   └── ⚛️  TourPage.tsx _(33.3KB)_
│   │   ├── 📁 **PerfilAuditor/**
│   │   │   ├── ⚛️  PerfilAuditor.tsx _(34.1KB)_
│   │   │   ├── 🔷 perfilAuditorCache.ts _(2.1KB)_
│   │   │   └── ⚛️  PerfilAuditorEdit.tsx _(48.1KB)_
│   │   ├── 📁 **PerfilExportador/**
│   │   │   ├── ⚛️  PerfilExportador.tsx _(35.1KB)_
│   │   │   ├── 🔷 perfilExportadorCache.ts _(2.2KB)_
│   │   │   └── ⚛️  PerfilExportadorEdit.tsx _(48.2KB)_
│   │   ├── 📁 **PerfilMVZ/**
│   │   │   ├── ⚛️  PerfilMVZ.tsx _(40.0KB)_
│   │   │   ├── 🔷 perfilMVZCache.ts _(2.1KB)_
│   │   │   └── ⚛️  PerfilMVZEdit.tsx _(53.5KB)_
│   │   ├── 📁 **PerfilRancho/**
│   │   │   ├── ⚛️  PerfilRancho.tsx _(43.5KB)_
│   │   │   ├── 🔷 perfilRanchoCache.ts _(1.5KB)_
│   │   │   ├── ⚛️  PerfilRanchoEdit.tsx _(50.5KB)_
│   │   │   └── ⚛️  PerfilRouter.tsx _(4.7KB)_
│   │   ├── 📁 **PerfilUG/**
│   │   │   ├── ⚛️  PerfilUG.tsx _(44.0KB)_
│   │   │   ├── 🔷 perfilUGCache.ts _(1.8KB)_
│   │   │   └── ⚛️  PerfilUGEdit.tsx _(48.7KB)_
│   │   ├── 📁 **Plan/**
│   │   │   ├── ⚛️  AgregarTarjeta.tsx _(17.0KB)_
│   │   │   ├── ⚛️  AmpliarCapacidad.tsx _(40.3KB)_
│   │   │   └── ⚛️  Plan.tsx _(35.8KB)_
│   │   ├── 📁 **Recursos/**
│   │   │   └── ⚛️  RecursosPage.tsx _(52.7KB)_
│   │   ├── 📁 **SignUp/**
│   │   │   ├── ⚛️  SignUpAuth.tsx _(58.5KB)_
│   │   │   ├── ⚛️  SignUpConfirmation.tsx _(39.7KB)_
│   │   │   ├── ⚛️  SignUpInstitutional.tsx _(30.4KB)_
│   │   │   └── ⚛️  SignUpPersonal.tsx _(46.2KB)_
│   │   ├── 📁 **Splash/**
│   │   │   └── ⚛️  Splash.tsx _(8.9KB)_
│   │   ├── 📁 **tramites/**
│   │   │   ├── ⚛️  tramites.tsx _(1.2KB)_
│   │   │   └── ⚛️  tramitesPanel.tsx _(67.9KB)_
│   │   └── 📁 **Voz/**
│   │       └── ⚛️  Voz.tsx _(25.9KB)_
│   ├── 📁 **services/**
│   │   └── 🔷 payloadApi.ts _(6.6KB)_
│   ├── 📁 **styles/**
│   │   └── 🎨 globals.css _(0B)_
│   ├── 🎨 index.css _(22B)_
│   └── ⚛️  main.tsx _(291B)_
├── 📁 **supabase/**
│   └── 📁 **functions/**
│       ├── 📁 **analizar-noticia/**
│       │   └── 🔷 index.ts _(12.9KB)_
│       ├── 📁 **newsletter-subscribe/**
│       │   └── 🔷 index.ts _(9.0KB)_
│       └── 📋 deno.json _(78B)_
├── 🟨 eslint.config.js _(616B)_
├── 📄 generate-structure.cjs _(4.5KB)_
├── 📄 index.html _(1.8KB)_
├── 📋 package-lock.json _(**152KB**)_
├── 📋 package.json _(1.0KB)_
├── 📝 README.md _(2.5KB)_
├── 📋 tsconfig.app.json _(732B)_
├── 📋 tsconfig.json _(119B)_
├── 📋 tsconfig.node.json _(653B)_
└── 🔷 vite.config.ts _(205B)_
```

---
_Generado por generate-structure.js_
