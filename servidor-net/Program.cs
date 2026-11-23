using Microsoft.EntityFrameworkCore;
var builder=WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<SeriesDb>(o=>o.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
var app=builder.Build();
app.MapGet("/api/series",async(SeriesDb db)=>await db.Series.AsNoTracking().OrderBy(x=>x.Id).ToListAsync());
app.MapGet("/api/series/{id:int}",async(int id,SeriesDb db)=>await db.Series.AsNoTracking().FirstOrDefaultAsync(x=>x.Id==id) is { } s?Results.Ok(s):Results.NotFound());
app.Run();
public class Serie {public int Id{get;set;} public string Titulo{get;set;}=""; public string Estado{get;set;}="pendiente";}
public class SeriesDb(DbContextOptions<SeriesDb> options):DbContext(options){public DbSet<Serie> Series=>Set<Serie>();protected override void OnModelCreating(ModelBuilder b){b.Entity<Serie>().Property(x=>x.Titulo).HasMaxLength(120).IsRequired();}}
