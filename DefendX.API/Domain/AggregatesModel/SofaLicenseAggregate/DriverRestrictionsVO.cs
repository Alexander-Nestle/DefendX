using System.Collections.Generic;

namespace DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate {
    public class DriverRestrictionsVO : TValueObject {
        public bool Glasses { get; private set; }
        public bool Tdy { get; private set; }
        public bool OnBaseOnly { get; private set; }
        public bool AutoJeep { get; private set; }
        public bool MotorCycle { get; private set; }
        public bool Motor { get; private set; }
        public bool Other { get; private set; }

        public DriverRestrictionsVO () { }
        public DriverRestrictionsVO (
            bool glasses,
            bool tdy,
            bool onBaseOnly,
            bool autoJeep,
            bool motorCycle,
            bool motor,
            bool other) 
        {
            this.Glasses = glasses;
            this.Tdy = tdy;
            this.OnBaseOnly = onBaseOnly;
            this.AutoJeep = autoJeep;
            this.MotorCycle = motorCycle;
            this.Motor = motor;
            this.Other = other;
        }

        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return Glasses;
            yield return Tdy;
            yield return OnBaseOnly;
            yield return AutoJeep;
            yield return MotorCycle;
            yield return Motor;
            yield return Other;
        }
    }
}