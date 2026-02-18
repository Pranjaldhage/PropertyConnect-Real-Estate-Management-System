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
// CORS (Gateway usually handles, but safe for dev)
// ----------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowGateway", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:8086");
    });
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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowGateway");

// global exception mapping
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Unauthorized");
    });
});

app.MapControllers();

app.Run();
