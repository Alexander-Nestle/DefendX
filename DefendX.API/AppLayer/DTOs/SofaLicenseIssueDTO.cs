using System;

namespace DefendX.API.AppLayer.DTOs
{
    public class SofaLicenseIssueDTO : TDTO
    {
        public int Id { get; set; }
        public virtual UserSearchDTO User { get; set; }
        public DateTime IssueDate { get; set; }
    }
}