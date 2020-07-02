using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.ServiceAggregate;
using DefendX.API.Domain.AggregatesModel.UnitsAggregate;

namespace DefendX.API.AppLayer.DTOs
{
    public class UserDTO : TDTO
    {
        public long DodId { get; set; }
        public int AccountId { get; set; }
        public AccountDTO Account { get; set; }
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
        public string SignatureData { get; set; }
    }
}