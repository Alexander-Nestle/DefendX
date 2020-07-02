using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate
{
    public class PersonalInformationVO : TValueObject
    {
        [MaxLength (25)]
        [Required]
        public string Gender { get; private set; }
        public DateTime DoB { get; private set; }
        public int Height { get; private set; }
        public int Weight { get; private set; }

        [MaxLength (15)]
        [Required]
        public string HairColor { get; private set; }

        [MaxLength (15)]
        [Required]
        public string EyeColor { get; private set; }
        public PersonalInformationVO() {}

        public PersonalInformationVO(string gender,
                        DateTime dob,
                        int height,
                        int weight,
                        string hairColor,
                        string eyeColor) {
            this.Gender = gender;
            this.DoB = dob;
            this.Height = height;
            this.Weight = weight;
            this.HairColor = hairColor;
            this.EyeColor = eyeColor;
        }

        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return Gender;
            yield return DoB;
            yield return Height;
            yield return Weight;
            yield return HairColor;
            yield return EyeColor;
        }
    }
}