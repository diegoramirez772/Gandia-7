# GANDIA 7

**Sistema Integral de Trazabilidad Ganadera**

![Arquitectura GANDIA](docs/images/portada.png)

> Infraestructura Digital Institucional para la Trazabilidad Ganadera Binacional México-USA

---

## Descripción

GANDIA 7 es un sistema de trazabilidad ganadera institucional que integra identidad biométrica, inteligencia artificial determinística y certificación blockchain para modernizar el comercio pecuario nacional e internacional.

**Contexto Institucional:**
- Universidad Tecnológica de Durango (UTD)
- Equipo Búfalos - GALARDÓN DuranIA
- Durango, México | Enero 2026

## Problema que Resuelve

### Pérdidas Cuantificadas
- USD $65,000M anuales por enfermedades en ganado lechero
- 41% caída en exportaciones mexicanas por suspensiones sanitarias
- 2-4 semanas de tiempo promedio para certificación de exportación
- 42% de productores pierde documentación crítica en 5 años

### Brechas Tecnológicas
- Interfaces inaccesibles para productores rurales
- Dependencia de aretes físicos removibles (10-20% pérdida)
- Sin operación offline (60% UPPs sin conectividad)
- Falta de integración entre sistemas legales y operativos

## Arquitectura

### Stack Tecnológico

**Frontend**
- React Native + Expo SDK
- TypeScript
- Tailwind CSS

**Backend**
- NestJS (Node.js)
- PostgreSQL 15 + PostGIS
- Supabase (MVP)

**Infraestructura**
- Polygon Proof-of-Stake
- Docker + Kubernetes
- GitHub Actions (CI/CD)

## Características Principales

### Identidad Animal Multicapa
- Biometría de morro (huella nasal)
- Identificadores oficiales (SINIIGA, RFID 840)
- Evidencia contextual (IoT, GPS, timestamps)

### Dualidad Digital
- **Pasaporte Ganadero**: Documento legal estático e inmutable
- **Gemelo Digital**: Registro cronológico de eventos sanitarios y operativos

### Operación Offline-First
- Captura biométrica sin conectividad
- Base de datos local SQLite cifrada
- Sincronización diferida con resolución de conflictos

### Certificación Blockchain
- Anclaje selectivo de eventos críticos
- Costo: $0.001-0.01 USD por transacción
- Huella de carbono: 41.6 kg CO₂/100K transacciones

### Interfaz Chat-Native
- Procesamiento de lenguaje natural
- Accesible para productores con educación básica
- Registro de animal en <120 segundos

## Estructura del Proyecto

```
gandia/
├── mobile/          # App React Native
├── web/             # Dashboard Web 
└── api/             # Backend NestJS (entrega 2)
├── packages/
│   ├── database/        # Schemas y migraciones (entrega 2)
│   ├── shared/          # Tipos y utilidades compartidas (enrega 2)
│   └── acipe/           # Motor IA institucional (entrega 2)
├── docs/
│   ├── architecture/    # Diagramas y especificaciones (entrega 2)
│   ├── technical/       # Informe técnico completo
│   └── research/        # Documento de investigación
└── infrastructure/
    ├── docker/          # Configuraciones Docker (entrega 3)
    └── terraform/       # IaC para despliegue (entrega 3)
```

## Modelo de Datos (Capas)

1. **Base Institucional**: Entidades, usuarios, roles
2. **Base de Estados**: Estados actuales (FSM)
3. **Base de Eventos**: Historial inmutable (append-only)
4. **Base de Evidencia**: Fotografías, documentos, certificados
5. **Caché Offline**: Sincronización diferida

## Seguridad

- Autenticación Multifactor (MFA)
- Row Level Security (RLS) en PostgreSQL
- Cifrado AES-256 en reposo
- TLS 1.3 en tránsito
- Audit Trail inmutable
- Anclaje blockchain para eventos críticos

## Modelo Económico

**Concepto**: Cobro por certeza verificable, no por uso operativo

- Tier gratuito: hasta 20 animales
- Eventos certificables: creación pasaportes, certificaciones, habilitaciones
- Licencias institucionales para Uniones y Autoridades
- Break-even proyectado: mes 28

## Roadmap

### Fase 1: MVP Institucional (6 meses)
- Autenticación institucional
- Pasaportes digitales con biometría
- Gemelo digital básico
- Chat IA conversacional
- Blockchain selectivo

### Fase 2: Consolidación Regional (12 meses)
- Expansión Chihuahua, Coahuila, Zacatecas
- Módulo exportación USA
- Integración IoT básica
- Dashboard Unión Ganadera

### Fase 3: Escalamiento Nacional (18+ meses)
- Nodos federados estatales
- Reconocimiento biométrico automático
- Integración SINIIGA bilateral
- Expansión multi-especie

## Criterios de Éxito (MVP)

- NPS ≥ 40
- Retención D30 ≥ 60%
- ≥70% usuarios completando registro sin soporte
- Churn mensual < 5%

## Equipo

**Equipo Búfalos**
- Universidad Tecnológica de Durango
- División de Tecnologías de la Información
- Proyecto GALARDÓN DuranIA

## Licencia

© 2026 Equipo Búfalos - UTD. Todos los derechos reservados.

Este proyecto contiene propiedad intelectual protegida. Ver [LICENSE](LICENSE) para más detalles.

---

## Contacto

- **Institución**: Universidad Tecnológica de Durango
- **Proyecto**: GALARDÓN DuranIA
- **Ubicación**: Durango, México

---

**GANDIA 7** - Infraestructura Digital de Certeza Ganadera