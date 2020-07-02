using DefendX.API.Domain.AggregatesModel.UserAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DefendX.API.DAL.Context.Configurations
{
    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(b => b.SignatureData).IsUnicode(false);
            builder.OwnsOne(u => u.Name);
            builder.OwnsOne(u => u.ContactInfo);

            builder
                .Property(u => u.RowVersion)
                .IsConcurrencyToken()
                .ValueGeneratedOnAddOrUpdate();
        }
    }
}