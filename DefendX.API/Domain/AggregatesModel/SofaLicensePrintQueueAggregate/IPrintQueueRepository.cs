using System.Collections.Generic;
using System.Threading.Tasks;

namespace DefendX.API.Domain.AggregatesModel.SofaLicensePrintQueueAggregate
{
    public interface IPrintQueueRepository : IGenericRepository<PrintQueue>
    {
        Task<IEnumerable<PrintQueue>> GetPrintQueue(long userId);
        Task<int> GetPrintQueueCount(long userId);
        void Delete(int licenseId, long userId);
        void Delete(long userId);
    }
}