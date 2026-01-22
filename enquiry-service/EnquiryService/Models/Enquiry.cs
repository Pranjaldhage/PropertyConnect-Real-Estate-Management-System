using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EnquiryService.Models
{
    [Table("enquiries")]
    public class Enquiry
    {
        [Key]
        public long Id { get; set; }

        [Column("property_id")]
        public long PropertyId { get; set; }

        [Column("customer_id")]
        public long CustomerId { get; set; }

        [Column("owner_id")]
        public long OwnerId { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = "NEW";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}