using System.Threading.Tasks;

namespace DefendX.API.Domain.AggregatesModel.LogAggregate
{
    public interface ILogRepository
    {
        Task LogAsync(LogTypes t, LogEntry e);
        Task SaveAsync();
    }
}