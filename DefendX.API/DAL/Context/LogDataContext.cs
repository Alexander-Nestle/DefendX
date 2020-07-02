using DefendX.API.DAL.Context.Configurations;
using DefendX.API.Domain.AggregatesModel.LogAggregate;
using Microsoft.EntityFrameworkCore;

namespace DefendX.API.DAL.Context
{
    public class LogDataContext : DbContext
    {
        public DbSet<LogEntry> LogEntry { get; set;}
        public DbSet<LogEntryType> LogEntryType { get; set; }

        public LogDataContext(DbContextOptions<LogDataContext> options) : base (options) {}

        protected override void OnModelCreating (ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new LogEntryTypeConfig());            
        }
    }
}