using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DefendX.API.Domain.AggregatesModel.UserAggregate
{
    public class ContactInfoVO : TValueObject
    {
        [MaxLength(25)]
        public string DsnPhone { get; private set; }
        [MaxLength(25)]
        public string CommPhone { get; private set; }
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; private set; }

        public ContactInfoVO() {}

        public ContactInfoVO(
                    string dsnPhone = null,
                    string commPhone = null, 
                    string email = null
        ){
            this.DsnPhone = dsnPhone;
            this.CommPhone = commPhone;
            this.Email = email;
        }

        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return DsnPhone;
            yield return CommPhone;
            yield return Email;
        }
    }
}