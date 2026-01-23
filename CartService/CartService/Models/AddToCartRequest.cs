namespace CartService.Models;

public class AddToCartRequest
{
    public long PropertyId { get; set; }
    public decimal Price { get; set; }
}
