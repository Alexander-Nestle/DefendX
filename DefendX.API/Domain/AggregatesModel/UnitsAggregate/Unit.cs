using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace DefendX.API.Domain.AggregatesModel.UnitsAggregate
{
    public class Unit : TEntity, IAggregateRoot
    {
        [Key]
        public int Id { get; private set; }
        public int? ParentId { get; private set; }
        // [ForeignKey("ParentId")]
        // public virtual Unit ParentUnit { get; private set; }
        [MaxLength(100)]
        [Required]
        public string Name { get; private set; }
        [MaxLength(25)]
        public string UnitAbbreviation { get; private set; }

        // private HashSet<Unit> _childUnits;

        // public virtual IEnumerable<Unit> ChildUnits => _childUnits;

        public Unit() {}

        [JsonConstructor]
        public Unit(string name, string unitAbbreviation, int? parentId = null) 
        {
            this.Name = name;
            this.UnitAbbreviation = unitAbbreviation;
            this.ParentId = parentId;
        }
    }
}