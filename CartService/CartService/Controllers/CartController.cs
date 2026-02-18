using CartService.Data;
using CartService.Models;
using CartService.DTOs;
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

    /* ============================
       ADD TO CART
    ============================ */

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart(
        [FromHeader(Name = "X-USER-ID")] long? userId,
        [FromHeader(Name = "X-USER-ROLE")] string? role,
        [FromBody] AddToCartRequest request)
    {
        ValidateGatewayHeaders(userId, role);

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId!.Value,
                Items = new List<CartItem>()
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        var existingItem = cart.Items
            .FirstOrDefault(i =>
                i.PropertyId == request.PropertyId);

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

        return Ok(new { message = "Item added to cart" });
    }

    /* ============================
       VIEW CART
    ============================ */

    [HttpGet]
    public async Task<IActionResult> GetCart(
        [FromHeader(Name = "X-USER-ID")] long? userId,
        [FromHeader(Name = "X-USER-ROLE")] string? role)
    {
        ValidateGatewayHeaders(userId, role);

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(
                c => c.UserId == userId);

        if (cart == null)
        {
            return Ok(new CartDto
            {
                UserId = userId!.Value,
                Items = new List<CartItemDto>()
            });
        }

        var dto = new CartDto
        {
            UserId = cart.UserId,
            Items = cart.Items.Select(i =>
                new CartItemDto
                {
                    PropertyId = i.PropertyId,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList()
        };

        return Ok(dto);
    }

    /* ============================
       REMOVE ITEM
    ============================ */

    [HttpDelete("remove/{propertyId}")]
    public async Task<IActionResult> RemoveItem(
        [FromHeader(Name = "X-USER-ID")] long? userId,
        [FromHeader(Name = "X-USER-ROLE")] string? role,
        [FromRoute] long propertyId)
    {
        ValidateGatewayHeaders(userId, role);

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(
                c => c.UserId == userId);

        if (cart == null)
            return NotFound("Cart not found");

        var item = cart.Items
            .FirstOrDefault(
                i => i.PropertyId == propertyId);

        if (item == null)
            return NotFound("Item not found");

        cart.Items.Remove(item);

        await _context.SaveChangesAsync();

        return Ok("Item removed");
    }

    /* ============================
       SECURITY
    ============================ */

    private static void ValidateGatewayHeaders(
        long? userId,
        string? role)
    {
        if (!userId.HasValue || string.IsNullOrEmpty(role))
        {
            throw new UnauthorizedAccessException(
                "Missing gateway authentication headers");
        }

        if (role != "CUSTOMER" && role != "ADMIN")
        {
            throw new UnauthorizedAccessException(
                "Invalid role");
        }
    }
}
