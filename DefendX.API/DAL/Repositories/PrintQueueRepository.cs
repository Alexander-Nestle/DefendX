using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DefendX.API.DAL.Context;
using DefendX.API.Domain.AggregatesModel.SofaLicensePrintQueueAggregate;
using Microsoft.EntityFrameworkCore;

namespace DefendX.API.DAL.Repositories
{
    public class PrintQueueRepository : GenericRepository<PrintQueue>, IPrintQueueRepository
    {
        public PrintQueueRepository(DataContext context) : base(context) { }
        public async Task<IEnumerable<PrintQueue>> GetPrintQueue(long userId)
        {
            var printQueue = _context.PrintQueue.AsQueryable();
            return await printQueue.Where(q => q.UserId == userId).ToListAsync();
        }

        public async Task<int> GetPrintQueueCount(long userId) 
        {
            return await _context.PrintQueue.CountAsync(q => q.UserId == userId);
        }

        public override async Task Insert(PrintQueue queueEntry)
        {
            if( (await _context.PrintQueue.CountAsync(q => q.UserId == queueEntry.UserId && q.LicenseId == queueEntry.LicenseId)) > 0 )
                throw new Exception("Entity already added to print queue");

            await _context.PrintQueue.AddAsync(queueEntry);
        }

        public void Delete(int licenseId, long userId)
        {
            var queueEntry =  _context.PrintQueue.Where(q => q.UserId == userId && q.LicenseId == licenseId).FirstOrDefault();
            Delete(queueEntry);
        }

        public void Delete(long userId)
        {
            _context.PrintQueue.RemoveRange(_context.PrintQueue.Where(q => q.UserId == userId));
        } 
    }   
}
