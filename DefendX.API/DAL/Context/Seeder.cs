using System.Collections.Generic;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.LogAggregate;
using DefendX.API.Domain.AggregatesModel.ServiceAggregate;
using DefendX.API.Domain.AggregatesModel.UnitsAggregate;
using Newtonsoft.Json;

namespace DefendX.API.DAL.Context {
    public class Seeder {
        private readonly DataContext _context;
        private readonly LogDataContext _logContext;

        public Seeder (DataContext context, LogDataContext logContext) {
            this._context = context;
            this._logContext = logContext;
        }

        public void SeedAccountTypes () {
            var accountTypeData = System.IO.File.ReadAllText ("DAL/Context/SeedData/AccountTypeSeedData.json");
            var accountTypes = JsonConvert.DeserializeObject<List<AccountType>> (accountTypeData);
            foreach (var accountType in accountTypes) {
                _context.AccountType.Add (accountType);
            }
            _context.SaveChanges ();
        }

        public void SeedRank () {
            var rankData = System.IO.File.ReadAllText ("DAL/Context/SeedData/RankSeedData.json");
            var ranks = JsonConvert.DeserializeObject<List<Rank>> (rankData);
            foreach (var rank in ranks) {
                _context.Rank.Add (rank);

            }
            _context.SaveChanges ();
        }

        public void SeedService () {
            var serviceData = System.IO.File.ReadAllText ("DAL/Context/SeedData/ServiceSeedData.json");
            var services = JsonConvert.DeserializeObject<List<Service>> (serviceData);
            foreach (var service in services) {
                _context.Service.Add (service);
            }
            _context.SaveChanges ();
        }

        public void SeedUnits () {
            var unitData = System.IO.File.ReadAllText ("DAL/Context/SeedData/UnitSeedData.json");
            var units = JsonConvert.DeserializeObject<List<Unit>> (unitData);
            foreach (var unit in units) {
                _context.Unit.Add (unit);
                _context.SaveChanges ();
            }
        }

        public void SeedLogEntryTypes () {
            var logEntryTypeData = System.IO.File.ReadAllText ("DAL/Context/SeedData/LogEntryTypeSeedData.json");
            var logEntryTypes = JsonConvert.DeserializeObject<List<LogEntryType>> (logEntryTypeData);
            foreach (var logEntryType in logEntryTypes) {
                _logContext.LogEntryType.Add (logEntryType);
                _logContext.SaveChanges ();
            }
        }
    }
}