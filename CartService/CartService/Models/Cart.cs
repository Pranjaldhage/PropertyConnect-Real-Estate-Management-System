using System.ComponentModel.DataAnnotations;

namespace CartService.Models;

public class Cart
{
    [Key]
    public int Id { get; set; }

    public long UserId { get; set; }

    // ✅ KEEP this — EF loads items, controller maps to DTO
    public List<CartItem> Items { get; set; } = new();
}
