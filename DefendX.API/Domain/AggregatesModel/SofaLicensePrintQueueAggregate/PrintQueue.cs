using System.ComponentModel.DataAnnotations.Schema;
using DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using DefendX.API.Domain.Values;

namespace DefendX.API.Domain.AggregatesModel.SofaLicensePrintQueueAggregate
{
    public class PrintQueue : TEntity, IAggregateRoot
    {
        public int Id { get; private set; }
        public long UserId { get; private set; }
        [ForeignKey ("UserId")]
        public virtual User User { get; private set; }
        public int LicenseId { get; private set; }
        [ForeignKey ("LicenseId")]
        public virtual SofaLicense license { get; set; }

        public PrintQueue() {}
        public PrintQueue(
            long userId,
            int licenseId
        ) {
            UserId = userId;
            LicenseId = licenseId;
        }

        public bool IsValid()
        {
            if (
                UserId >= DOD_ID.MIN && UserId <= DOD_ID.MAX
                && LicenseId > 0
            ){ return true; }
            return false;
        }
    }
}