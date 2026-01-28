namespace CartService.DTOs;

public class CartItemDto
{
    public long PropertyId { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}

public class CartDto
{
    public long UserId { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
}
