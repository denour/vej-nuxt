# Vida En el Jardin.com - Technical Agent Configuration

## Site Information
- Site Name: Vida En el Jardin.com
- Framework: Nuxt.js 4.2.1
- Vue Version: 3.5.25
- Primary Language: Spanish

## Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## SEO Optimization
- Implementar rutas amigables para SEO
- Usar meta tags dinámicos por página
- Implementar sitemap.xml
- Configurar robots.txt

## Performance Optimization
- Lazy loading de imágenes
- Componentes asíncronos
- Minificación de assets
- Compresión Gzip/Brotli


## Progressive Web App (PWA)
- Configuración offline-first
- Cache estratégico
- Notificaciones push (opcional)

## Internacionalización
- Idioma principal: Español
- Preparado para futura expansión multilingüe

## Analytics & Monitoring
- Configuración de Google Analytics 4
- Error tracking
- Performance monitoring

## Development Guidelines
- Usar Composition API
- Implementar TypeScript para mejor mantenibilidad
- Seguir Vue Style Guide (Priority A Rules)
- Utilizar componentes atómicos
- Implementar pruebas unitarias

## Build & Deployment
- Ambiente de desarrollo local
- Staging environment
- Production environment
- CI/CD pipeline

## Performance Targets
- Lighthouse Score objetivos:
    - Performance: > 90
    - Accessibility

Para agregar el contenido al archivo `agent.md` existente, aquí está la configuración:

```markdown
# Vida En el Jardin.com - Technical Agent Configuration

## Site Information
- Site Name: Vida En el Jardin.com
- Framework: Nuxt.js 4.2.1
- Vue Version: 3.5.25
- Primary Language: Spanish

## Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Meta Configuration
```
javascript
export default defineNuxtConfig({
app: {
head: {
title: 'Vida En el Jardin.com',
meta: [
{ charset: 'utf-8' },
{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
{
name: 'description',
content: 'Descubre el arte de la jardinería y encuentra consejos expertos para crear tu propio paraíso verde.'
},
{
name: 'keywords',
content: 'jardinería, plantas, jardín, cultivo, flores, huerto, paisajismo'
}
],
link: [
{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
]
}
}
})
```
## SEO Optimization
- Implementar rutas amigables para SEO
- Usar meta tags dinámicos por página
- Implementar sitemap.xml
- Configurar robots.txt

## Performance Optimization
- Lazy loading de imágenes
- Componentes asíncronos
- Minificación de assets
- Compresión Gzip/Brotli

## Security Headers
```
javascript
export default defineNuxtConfig({
nitro: {
routeRules: {
'/**': {
headers: {
'X-Frame-Options': 'SAMEORIGIN',
'X-XSS-Protection': '1; mode=block',
'X-Content-Type-Options': 'nosniff',
'Referrer-Policy': 'strict-origin-when-cross-origin'
}
}
}
}
})
```
## Progressive Web App (PWA)
- Configuración offline-first
- Cache estratégico
- Notificaciones push (opcional)

## Internacionalización
- Idioma principal: Español
- Preparado para futura expansión multilingüe

## Analytics & Monitoring
- Configuración de Google Analytics 4
- Error tracking
- Performance monitoring

## Development Guidelines
- Usar Composition API
- Implementar TypeScript para mejor mantenibilidad
- Seguir Vue Style Guide (Priority A Rules)
- Utilizar componentes atómicos
- Implementar pruebas unitarias

## Build & Deployment
- Ambiente de desarrollo local
- Staging environment
- Production environment
- CI/CD pipeline

## Performance Targets
- Lighthouse Score objetivos:
  - Performance: > 90
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 90

## API Integration
- RESTful API endpoints
- API rate limiting
- Error handling middleware
- Request/Response interceptors

## State Management
- Pinia para state management
- Persistent storage cuando sea necesario
- SSR compatible

## Asset Management
- Optimización de imágenes
- CDN para assets estáticos
- Lazy loading de recursos

## Accessibility
- WCAG 2.1 compliance
- Soporte para lectores de pantalla
- Navegación por teclado
- Contraste de colores adecuado

## Testing Strategy
- Jest para pruebas unitarias
- Cypress para E2E testing
- Pruebas de integración
- Pruebas de rendimiento

## Error Handling
- Error boundaries
- Logging service
- Fallback UI
- Offline handling

## Mobile Strategy
- Mobile-first design
- Touch-friendly interfaces
- Responsive breakpoints
