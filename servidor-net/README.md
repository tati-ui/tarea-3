# Laboratorio EF Core + SQL Server
Ejemplo de API mínima en .NET 8. Requiere instalar SDK .NET 8 y una instancia SQL Server; cambiar la cadena de conexión en `appsettings.json`.

```bash
dotnet restore
dotnet tool install --global dotnet-ef
dotnet ef migrations add Inicial
dotnet ef database update
dotnet run
```
GET /api/series y GET /api/series/{id}. No se incluye la carpeta de migraciones generadas, porque depende del entorno; se generan con el comando indicado.
