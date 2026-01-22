using EnquiryService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EnquiryService.Controllers
{
    [ApiController]
    [Route("api/enquiries")]
    public class EnquiryController : ControllerBase
    {
        private readonly EnquiryDbContext _context;

        public EnquiryController(EnquiryDbContext context)
        {
            _context = context;
        }

        // POST: api/enquiries
        [HttpPost]
        public async Task<IActionResult> CreateEnquiry([FromBody] Enquiry enquiry)
        {
            enquiry.Status = "NEW";
            enquiry.CreatedAt = DateTime.UtcNow;
            enquiry.UpdatedAt = DateTime.UtcNow;

            _context.Enquiries.Add(enquiry);
            await _context.SaveChangesAsync();

            return Ok(enquiry);
        }

        // GET: api/enquiries/owner/{ownerId}
        [HttpGet("owner/{ownerId}")]
        public async Task<IActionResult> GetEnquiriesForOwner(long ownerId)
        {
            var enquiries = await _context.Enquiries
                .Where(e => e.OwnerId == ownerId)
                .ToListAsync();

            return Ok(enquiries);
        }

        // GET: api/enquiries/customer/{customerId}
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetEnquiriesForCustomer(long customerId)
        {
            var enquiries = await _context.Enquiries
                .Where(e => e.CustomerId == customerId)
                .ToListAsync();

            return Ok(enquiries);
        }

        // PUT: api/enquiries/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateEnquiryStatus(
            long id,
            [FromBody] UpdateStatusRequest request)
        {
            var enquiry = await _context.Enquiries.FindAsync(id);
            if (enquiry == null)
                return NotFound();

            if (request.Status != "NEW" &&
                request.Status != "RESPONDED" &&
                request.Status != "CLOSED")
            {
                return BadRequest("Invalid status value");
            }

            enquiry.Status = request.Status;
            enquiry.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(enquiry);
        }
    }

    // DTO for status update
    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}