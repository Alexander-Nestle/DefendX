using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace DefendX.API.Domain.AggregatesModel.ServiceAggregate
{
    public class Service : TEntity, IAggregateRoot
    {
        //TODO add different serives including contractor, NAF, GS, Dependent
        public int Id { get; private set; }
        [MaxLength(25)]
        [Required]
        public string Name { get; private set; }
        public virtual List<Rank> Ranks { get; private set; }

        public Service() {}

        [JsonConstructor]
        public Service(string name) 
        {
            this.Name = name;
        }

    }
}