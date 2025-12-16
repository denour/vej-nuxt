<nuxt-frontend-guidelines>

=== foundation rules ===

# Nuxt Frontend Guidelines – Vida En El Jardín

These guidelines define how the Nuxt frontend application must be built, structured, and extended.
They are designed to align strictly with the Laravel backend and to ensure consistency, scalability,
and correct reasoning by AI assistants (Junie).

---

## Foundational Context

This application is a **Nuxt 3** frontend that consumes an external Laravel REST API.

### Core Stack
- Nuxt.js – v3
- Vue – v3
- TypeScript – enabled
- Composition API with `<script setup>`
- Nitro / `$fetch`
- Pinia (if state is required)
- SSR enabled

This project **does not implement backend logic**.
All business rules live in Laravel.

---

## Architectural Principles

- The frontend **never talks directly to the API** from pages or components.
- All API access is centralized.
- Pages consume **services**, not raw HTTP calls.
- API contracts are treated as immutable unless backend changes.

---

## API Integration Rules

### API Base URL
- Defined via runtime config
- Never hardcoded

runtimeConfig.public.apiBase


# Vida En El Jardín – API Contract

Base URL:
- Development: http://localhost

## Auth
GET /api/user
Returns the authenticated user.

---

## Posts
GET /api/v1/posts  
Returns a list of posts.

GET /api/v1/posts/{slug}  
Returns a single post.

---

## FAQs
GET /api/v1/faqs  
GET /api/v1/faqs/{id}

---

## Products
GET /api/v1/products  
GET /api/v1/products/{slug}

---

## Species
GET /api/v1/species  
GET /api/v1/species/{slug}

---

## Newsletter
POST /api/v1/newsletter/subscribe  
Body:
{ "email": "string" }
```ts
</nuxt-frontend-guidelines>
