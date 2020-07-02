using DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DefendX.API.DAL.Context.Configurations
{
    public class SofaLicenseConfig : IEntityTypeConfiguration<SofaLicense>
    {
        public void Configure(EntityTypeBuilder<SofaLicense> builder)
        {
            builder.Property(b => b.SignatureData).IsUnicode(false);
            
            builder.HasMany (s => s.Dependents).WithOne (d => d.Sponsor);
            // builder.HasMany (s => s.Issues).WithOne (i => i.SofaLicense);
            builder.OwnsOne(s => s.Name);
            builder.OwnsOne(s =>s.DriverRestrictions);
            builder.OwnsOne(s => s.PersonalInfo);           
        }
    }
}