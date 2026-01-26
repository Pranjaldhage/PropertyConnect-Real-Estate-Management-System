using System.ComponentModel.DataAnnotations;

namespace CartService.Models;

public class Cart
{
    [Key]
    public int Id { get; set; }

    public long UserId { get; set; }   // comes from JWT (X-User-Id)

    public List<CartItem> Items { get; set; } = new();
}
