using DefendX.API.DAL.Context.Configurations;
using DefendX.API.Domain.AggregatesModel;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.LogAggregate;
using DefendX.API.Domain.AggregatesModel.ServiceAggregate;
using DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate;
using DefendX.API.Domain.AggregatesModel.SofaLicensePrintQueueAggregate;
using DefendX.API.Domain.AggregatesModel.UnitsAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using Microsoft.EntityFrameworkCore;

namespace DefendX.API.DAL.Context
{
    public class DataContext : DbContext 
    {
        public DbSet<Account> Account { get; set; }
        public DbSet<AccountType> AccountType { get; set; } 
        public DbSet<Faq> Faq { get; set; }
        public DbSet<Rank> Rank { get; set; }
        public DbSet<Service> Service { get; set; }
        public DbSet<SofaLicense> SofaLicense { get; set; }
        public DbSet<SofaLicenseIssue> SofaLicenseIssue { get; set; }
        public DbSet<Unit> Unit { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<PrintQueue> PrintQueue { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base (options) {}

        protected override void OnModelCreating (ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new AccountTypeConfig());
            modelBuilder.ApplyConfiguration(new ServiceConfig());
            modelBuilder.ApplyConfiguration(new SofaLicenseConfig());
            modelBuilder.ApplyConfiguration(new UnitConfig());
            modelBuilder.ApplyConfiguration(new UserConfig());
        }
    }
}