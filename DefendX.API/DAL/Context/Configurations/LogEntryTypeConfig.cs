using DefendX.API.Domain.AggregatesModel.LogAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DefendX.API.DAL.Context.Configurations
{
    public class LogEntryTypeConfig : IEntityTypeConfiguration<LogEntryType>
    {
        public void Configure(EntityTypeBuilder<LogEntryType> builder)
        {
            builder.HasMany( t => t.LogEntries).WithOne( e => e.LogEntryType );
            // builder.Metadata
            //     .FindNavigation(nameof(LogEntryType.LogEntries))
            //     .SetPropertyAccessMode(PropertyAccessMode.Field); 
        }
    }
}