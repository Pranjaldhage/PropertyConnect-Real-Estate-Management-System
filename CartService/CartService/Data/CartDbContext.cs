using Microsoft.EntityFrameworkCore;
using CartService.Models;

namespace CartService.Data;

public class CartDbContext : DbContext
{
    public CartDbContext(DbContextOptions<CartDbContext> options)
        : base(options) { }

    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ---------------------------
        // Cart → CartItems (1:N)
        // ---------------------------
        modelBuilder.Entity<Cart>()
            .HasMany(c => c.Items)
            .WithOne(i => i.Cart)
            .HasForeignKey(i => i.CartId)
            .OnDelete(DeleteBehavior.Cascade);

        // ---------------------------
        // Unique cart per user
        // ---------------------------
        modelBuilder.Entity<Cart>()
            .HasIndex(c => c.UserId)
            .IsUnique();

        // ---------------------------
        // Price precision
        // ---------------------------
        modelBuilder.Entity<CartItem>()
            .Property(i => i.Price)
            .HasPrecision(18, 2);
    }
}
