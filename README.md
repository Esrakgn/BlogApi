# BlogApi

Katmanlı mimari ile geliştirilmiş bir ASP.NET Core Web API projesi.  
Proje; kimlik doğrulama, rol bazlı yetkilendirme, post/category/comment yönetimi, filtreleme, pagination ve sorting içerir.

## Teknolojiler

- .NET 8 (ASP.NET Core Web API)
- Entity Framework Core
- SQL Server
- JWT Authentication
- FluentValidation
- Swagger / OpenAPI

## Mimari

- `BlogApi.API`  
  Controller'lar, HTTP katmanı
- `BlogApi.Application`  
  DTO'lar, interface'ler, validator'lar, action result enum'ları
- `BlogApi.Domain`  
  Entity modelleri
- `BlogApi.Infrastructure`  
  DbContext, migration'lar, service implementasyonları, JWT işlemleri

## Özellikler

- Auth
  - Register
  - Login
  - Profile (token test)
- Role sistemi
  - `Admin`
  - `User`
- Post yönetimi
  - CRUD
  - Owner-based authorization (sadece sahibi update/delete)
- Category yönetimi
  - CRUD
  - Create/Update/Delete sadece Admin
- Comment yönetimi
  - Post altı yorum listeleme
  - Yorum ekleme
  - Owner-based update/delete
- Arama / filtreleme
  - `search` (title + content)
  - `categoryId`
- Pagination + metadata
  - `pageNumber`
  - `pageSize`
  - `totalCount`
  - `totalPages`
- Sorting
  - `sortBy=newest`
  - `sortBy=oldest`
- FluentValidation
  - Auth, Post, Category, Comment, Query param validation

## Kurulum

### 1. Bağımlılıkları ve çözümü aç
Visual Studio veya VSCode ile solution'ı aç.

### 2. Connection string ayarla
`BlogApi.API/appsettings.json` içinde SQL Server bağlantısını düzenle.

### 3. Migration uygula
Package Manager Console:

```powershell
Update-Database -Project BlogApi.Infrastructure -StartupProject BlogApi.API
