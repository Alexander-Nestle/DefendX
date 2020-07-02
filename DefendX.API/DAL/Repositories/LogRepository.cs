using System.Threading.Tasks;
using DefendX.API.DAL.Context;
using DefendX.API.Domain.AggregatesModel.LogAggregate;

namespace DefendX.API.DAL.Repositories {
    public class LogRepository : ILogRepository {
        internal LogDataContext _context;

        public LogRepository (LogDataContext context) {
            this._context = context;
        }

        public async Task LogAsync(LogTypes t, LogEntry e) 
        {
            var type = await _context.LogEntryType.FindAsync((int)t);
            type.AddLogEntry(e);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}