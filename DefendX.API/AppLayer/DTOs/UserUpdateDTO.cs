using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.ServiceAggregate;
using DefendX.API.Domain.AggregatesModel.UnitsAggregate;

namespace DefendX.API.AppLayer.DTOs
{
    /// <summary>
    /// This class is used for receive user account update information performed by an admin
    /// </summary>
    /// <remarks>
    /// The difference between this class and UserDTO is that only admin accounts have the ability to update
    /// account types and units
    /// </remarks>
    public class UserUpdateDTO : TDTO
    {
        public long DodId { get; set; }
        public int? AccountId { get; set; }
        public int? AccountTypeId { get; set; }
        public int? UnitId { get; set; }
        public int? ServiceId { get; set; }
        public int? RankId { get; set; }
        public string DsnPhone { get; set; }
        public string CommPhone { get; set; }
        public string Email { get; set; }
        public string SignatureData { get; set; }
    }
}