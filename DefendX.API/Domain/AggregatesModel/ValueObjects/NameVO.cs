using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DefendX.API.Domain.AggregatesModel.ValueObjects {
    public class NameVO : TValueObject {
        [MaxLength (50)]
        [Required]
        public string FirstName { get; set; }

        [MaxLength (1)]
        public string MiddleInitial { get; set; }

        [MaxLength (50)]
        [Required]
        public string LastName { get; set; }

        public NameVO () { }

        public NameVO (string firstName,
                    string lastName,
                    string middleInitial = null) { 
            this.FirstName = firstName;
            this.LastName = lastName;
            this.MiddleInitial = middleInitial;
        }

        public bool IsValid()
        {
            if (
                !String.IsNullOrEmpty(FirstName)
                && !String.IsNullOrEmpty(LastName)
            ) {
                return true;
            }
            return false;
        }

        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return FirstName;
            yield return MiddleInitial;
            yield return LastName;
        }
        
    }
}