using CartService.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<CartDbContext>(options =>
{
    options.UseMySql(
        builder.Configuration.GetConnectionString("CartDb"),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString("CartDb")
        )
    );
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();
app.Run();
