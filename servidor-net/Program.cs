
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configuración de Entity Framework Core con SQL Server.
builder.Services.AddDbContext<SeriesDb>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("Default")
    )
);

var app = builder.Build();

// Consultar todas las series.
app.MapGet("/api/series", async (SeriesDb db) =>
    await db.Series
        .AsNoTracking()
        .OrderBy(s => s.Id)
        .ToListAsync()
);

// Consultar una serie por ID.
app.MapGet("/api/series/{id:int}", async (int id, SeriesDb db) =>
{
    var serie = await db.Series
        .AsNoTracking()
        .FirstOrDefaultAsync(s => s.Id == id);

    return serie is not null
        ? Results.Ok(serie)
        : Results.NotFound();
});

// Consultar todos los miembros.
app.MapGet("/api/miembros", async (SeriesDb db) =>
    await db.Miembros
        .AsNoTracking()
        .OrderBy(m => m.Id)
        .ToListAsync()
);

app.Run();

// Modelo de series.
public class Serie
{
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
    public string Estado { get; set; } = "pendiente";
}

// Modelo de miembros.
public class Miembro
{
    public int Id { get; set; }
    public string Nombre { get; set; } = "";
    public string Correo { get; set; } = "";
}

// Contexto de la base de datos.
public class SeriesDb(DbContextOptions<SeriesDb> options)
    : DbContext(options)
{
    public DbSet<Serie> Series => Set<Serie>();
    public DbSet<Miembro> Miembros => Set<Miembro>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Serie>()
            .Property(s => s.Titulo)
            .HasMaxLength(120)
            .IsRequired();

        builder.Entity<Miembro>()
            .Property(m => m.Nombre)
            .HasMaxLength(120)
            .IsRequired();

        builder.Entity<Miembro>()
            .Property(m => m.Correo)
            .HasMaxLength(200)
            .IsRequired();
    }
}
