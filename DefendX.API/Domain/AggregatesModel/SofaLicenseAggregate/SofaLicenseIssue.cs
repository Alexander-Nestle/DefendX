using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DefendX.API.Domain.AggregatesModel.UserAggregate;

namespace DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate
{
    public class SofaLicenseIssue : TEntity 
    {
        [Key]
        public int Id { get; private set; }

        [ForeignKey("UserId")]
        public virtual User User { get; private set; }
        public long UserId { get; private set; }

        public DateTime IssueDate { get; private set; }

        public SofaLicenseIssue(
            long userId
        ){
            this.UserId = userId;
            this.IssueDate = DateTime.Now;
        }
    }
}