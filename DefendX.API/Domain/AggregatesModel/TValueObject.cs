using System.Collections.Generic;
using System.Linq;

namespace DefendX.API.Domain.AggregatesModel {
    public abstract class TValueObject {
        protected static bool EqualOperator (TValueObject left, TValueObject right) {
            if (ReferenceEquals (left, null) ^ ReferenceEquals (right, null)) {
                return false;
            }
            return ReferenceEquals (left, null) || left.Equals (right);
        }

        protected static bool NotEqualOperator (TValueObject left, TValueObject right) {
            return !(EqualOperator (left, right));
        }

        protected abstract IEnumerable<object> GetAtomicValues ();

        public override bool Equals (object obj) {
            if (obj == null || obj.GetType () != GetType ()) {
                return false;
            }

            TValueObject other = (TValueObject) obj;
            IEnumerator<object> thisValues = GetAtomicValues ().GetEnumerator ();
            IEnumerator<object> otherValues = other.GetAtomicValues ().GetEnumerator ();
            while (thisValues.MoveNext () && otherValues.MoveNext ()) {
                if (ReferenceEquals (thisValues.Current, null) ^
                    ReferenceEquals (otherValues.Current, null)) {
                    return false;
                }

                if (thisValues.Current != null &&
                    !thisValues.Current.Equals (otherValues.Current)) {
                    return false;
                }
            }
            return !thisValues.MoveNext () && !otherValues.MoveNext ();
        }

        public override int GetHashCode () {
            return GetAtomicValues ()
                .Select (x => x != null ? x.GetHashCode () : 0)
                .Aggregate ((x, y) => x ^ y);
        }
    }
}