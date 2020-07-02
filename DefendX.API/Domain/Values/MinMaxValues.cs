namespace DefendX.API.Domain.Values
{
    public static class DOD_ID 
    {
        public const long MIN = 1000000000;
        public const long MAX = 9999999999;
    }

    public static class SERVICE 
    {
        public const int MIN_ID = 1;
        public const int MAX_ID = 5;
    }

    public static class RANK 
    {
        public const int MIN_ID = 1;
        public const int MAX_ID = 89;
    }

    public static class UNITS
    {
        public const int MIN_ID = 1;
        public const int MAX_ID = 375;
    }

    public static class ACCOUNT_TYPES
    {
        public const int MIN_ID = 1;
        public const int MAX_ID = 3;
    }
}