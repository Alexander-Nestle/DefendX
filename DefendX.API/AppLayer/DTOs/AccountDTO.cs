using System;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;

namespace DefendX.API.AppLayer.DTOs
{
    public class AccountDTO : TDTO
    {
        public int Id { get; set; }
        public int AccountTypeId { get; set; }
        public virtual AccountType AccountType { get; set; }
        public DateTime LastLoginDate { get; set; }
        public DateTime DateCreated { get; set; }
    }
}