using EnquiryService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EnquiryService.Controllers
{
    [ApiController]
    [Route("enquiries")]
    public class EnquiryController : ControllerBase
    {
        private readonly EnquiryDbContext _context;

        public EnquiryController(EnquiryDbContext context)
        {
            _context = context;
        }

        /* ============================
           CREATE ENQUIRY (CUSTOMER)
        ============================ */

        [HttpPost]
        public async Task<IActionResult> CreateEnquiry(
            [FromHeader(Name = "X-USER-ID")] long? userId,
            [FromHeader(Name = "X-USER-ROLE")] string? role,
            [FromBody] Enquiry enquiry)
        {
            ValidateGatewayHeaders(userId, role);

            if (role != "CUSTOMER")
                return Forbid();

            enquiry.CustomerId = userId!.Value;
            enquiry.Status = EnquiryStatus.NEW;
            enquiry.CreatedAt = DateTime.UtcNow;
            enquiry.UpdatedAt = DateTime.UtcNow;

            _context.Enquiries.Add(enquiry);
            await _context.SaveChangesAsync();

            return Ok(enquiry);
        }

        /* ============================
           ADMIN VIEW ALL
        ============================ */

        [HttpGet("admin")]
        public async Task<IActionResult> GetAllEnquiriesForAdmin(
            [FromHeader(Name = "X-USER-ID")] long? userId,
            [FromHeader(Name = "X-USER-ROLE")] string? role)
        {
            ValidateGatewayHeaders(userId, role);

            if (role != "ADMIN")
                return Forbid();

            var enquiries = await _context.Enquiries
                .ToListAsync();

            return Ok(enquiries);
        }

        /* ============================
           CUSTOMER VIEW OWN
        ============================ */

        [HttpGet("customer")]
        public async Task<IActionResult> GetEnquiriesForCustomer(
            [FromHeader(Name = "X-USER-ID")] long? userId,
            [FromHeader(Name = "X-USER-ROLE")] string? role)
        {
            ValidateGatewayHeaders(userId, role);

            if (role != "CUSTOMER")
                return Forbid();

            var enquiries = await _context.Enquiries
                .Where(e => e.CustomerId == userId)
                .ToListAsync();

            return Ok(enquiries);
        }

        /* ============================
           UPDATE STATUS (ADMIN)
        ============================ */

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateEnquiryStatus(
            [FromHeader(Name = "X-USER-ID")] long? userId,
            [FromHeader(Name = "X-USER-ROLE")] string? role,
            long id,
            [FromBody] UpdateStatusRequest request)
        {
            ValidateGatewayHeaders(userId, role);

            if (role != "ADMIN")
                return Forbid();

            var enquiry = await _context.Enquiries
                .FirstOrDefaultAsync(e => e.Id == id);

            if (enquiry == null)
                return NotFound();

            if (!Enum.TryParse<EnquiryStatus>(
                    request.Status,
                    true,
                    out var status))
            {
                return BadRequest("Invalid status value");
            }

            enquiry.Status = status;
            enquiry.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(enquiry);
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
        }
    }

    // DTO
    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}
