using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace DefendX.API.Domain.AggregatesModel.ServiceAggregate
{
    public class Rank : TEntity
    {
        public int Id { get; private set; }
        public int ServiceId { get; private set; }
        [ForeignKey("ServiceId")]
        public virtual Service Service { get; private set; }

        [MaxLength(15)]
        [Required]
        public string Name { get; private set; }
        [MaxLength(10)]
        [Required]
        public string Tier { get; private set; }
        public int Grade { get; private set; }

        public Rank() {}
        
        [JsonConstructor]
        public Rank(int serviceId, string name, string tier, int grade)
        {
            this.ServiceId = serviceId;
            this.Name = name;
            this.Tier = tier;
            this.Grade = grade;
        }
    }
}