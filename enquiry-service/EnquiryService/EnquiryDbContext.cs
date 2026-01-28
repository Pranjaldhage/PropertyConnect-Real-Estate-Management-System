using EnquiryService.Models;
using Microsoft.EntityFrameworkCore;

public class EnquiryDbContext : DbContext
{
    public EnquiryDbContext(DbContextOptions<EnquiryDbContext> options)
        : base(options)
    {
    }

    public DbSet<Enquiry> Enquiries => Set<Enquiry>();


    // 👇 ADD THIS PART
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Enquiry>()
            .Property(e => e.Status)
            .HasConversion<string>();
    }
}
