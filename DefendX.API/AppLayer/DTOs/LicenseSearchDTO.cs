using DefendX.API.Domain.AggregatesModel.ServiceAggregate;

namespace DefendX.API.AppLayer.DTOs
{
    public class LicenseSearchDTO : TDTO
    {
        public int Id { get; set; }        
        public string FirstName { get; set; }
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }
        public long DodId { get; set; }
        public string PermitNumber { get; set; }
        public string IsAuthenticated { get; set; }
        public Service Service { get; set; }
    }
}