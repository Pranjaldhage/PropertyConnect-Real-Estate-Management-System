using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CartService.Models;

public class CartItem
{
    [Key]
    public int Id { get; set; }

    public int CartId { get; set; }

    public long PropertyId { get; set; }

    public int Quantity { get; set; } = 1;

    public decimal Price { get; set; }

    [ForeignKey("CartId")]
    public Cart Cart { get; set; }
}
