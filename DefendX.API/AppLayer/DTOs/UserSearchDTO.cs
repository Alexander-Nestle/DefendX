using System;

namespace DefendX.API.AppLayer.DTOs
{
    public class UserSearchDTO : TDTO
    {
        public long DodId { get; set; }
        public string FirstName { get; set; }
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }
        public DateTime LastLoginDate { get; set; }
        public string AccountTypeName { get; set; }
    }
}