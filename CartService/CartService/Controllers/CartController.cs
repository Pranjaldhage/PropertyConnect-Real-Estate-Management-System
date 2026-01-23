using CartService.Data;
using CartService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CartService.Controllers;

[ApiController]
[Route("cart")]
public class CartController : ControllerBase
{
    private readonly CartDbContext _context;

    public CartController(CartDbContext context)
    {
        _context = context;
    }

    // ✅ ADD TO CART
    [HttpPost("add")]
    public async Task<IActionResult> AddToCart(
        [FromHeader(Name = "X-User-Id")] long userId,
        [FromBody] AddToCartRequest request)
    {
        if (userId == 0)
            return Unauthorized("User not authenticated");

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        var existingItem = cart.Items
            .FirstOrDefault(i => i.PropertyId == request.PropertyId);

        if (existingItem != null)
        {
            existingItem.Quantity += 1;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                PropertyId = request.PropertyId,
                Price = request.Price,
                Quantity = 1
            });
        }

        await _context.SaveChangesAsync();
        return Ok("Item added to cart");
    }

    // ✅ VIEW CART
    [HttpGet]
    public async Task<IActionResult> GetCart(
        [FromHeader(Name = "X-User-Id")] long userId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return Ok(new { Items = new List<CartItem>() });

        return Ok(cart);
    }

    // ✅ REMOVE ITEM
    [HttpDelete("remove/{propertyId}")]
    public async Task<IActionResult> RemoveItem(
        [FromHeader(Name = "X-User-Id")] long userId,
        long propertyId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return NotFound("Cart not found");

        var item = cart.Items
            .FirstOrDefault(i => i.PropertyId == propertyId);

        if (item == null)
            return NotFound("Item not found");

        cart.Items.Remove(item);
        await _context.SaveChangesAsync();

        return Ok("Item removed");
    }
}
