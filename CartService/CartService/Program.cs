using CartService.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// ----------------------------
// DB CONTEXT
// ----------------------------
builder.Services.AddDbContext<CartDbContext>(options =>
{
    options.UseMySql(
        builder.Configuration.GetConnectionString("CartDb"),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString("CartDb")
        )
    );
});

// ----------------------------
// CONTROLLERS + JSON
// ----------------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ----------------------------
// MIDDLEWARE PIPELINE
// ----------------------------
app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();
