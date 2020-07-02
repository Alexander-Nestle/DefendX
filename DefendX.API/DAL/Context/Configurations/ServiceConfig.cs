using DefendX.API.Domain.AggregatesModel.ServiceAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DefendX.API.DAL.Context.Configurations
{
    public class ServiceConfig : IEntityTypeConfiguration<Service>
    {
        public void Configure(EntityTypeBuilder<Service> builder)
        {
            // builder.Metadata
            //     .FindNavigation(nameof(Service.Ranks))
            //     .SetPropertyAccessMode(PropertyAccessMode.Field);
            builder.HasMany (s => s.Ranks).WithOne (r => r.Service);

    //             modelBuilder.Entity<Blog>() TODO
    // .Property(b => b.Url)
    // .HasField("_validatedUrl")
    // .UsePropertyAccessMode(PropertyAccessMode.Field);
        }
    }
}