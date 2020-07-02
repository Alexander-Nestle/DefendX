using DefendX.API.Domain.AggregatesModel.ServiceAggregate;
using DefendX.API.Domain.AggregatesModel.UnitsAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;

namespace DefendX.API.AppLayer.DTOs
{
    //Class does not include Sigdata as it is just for viewing
    public class ViewUserDTO : TDTO
    {
        public long DodId { get; set; }
        public int AccountId { get; set; }
        public Account Account { get; set; }
        public int? UnitId { get; set; }
        public Unit Unit { get; set; }
        public int? ServiceId { get; set; }
        public Service Service { get; set; }
        public int? RankId { get; set; }
        public Rank Rank { get; set; }
        public string FirstName { get; set; }
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }
        public string DsnPhone { get; set; }
        public string CommPhone { get; set; }
        public string Email { get; set; }
    }
}