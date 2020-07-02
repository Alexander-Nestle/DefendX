export class RegexPattern {
    public static readonly PHONE_NUMBER_ZIP_OPTIONAL = '([(]([0-9]{3})[)]|([0-9]{3}))?[0-9]{3}-?[0-9]{4}';
    public static readonly PHONE_NUMBER_US_JAP = '(([(]([0-9]{3})[)])|([0-9]{3}))?[0-9]{3,4}-?[0-9]{4}';
    public static readonly EMAIL = '^[a-zA-Z0-9_.]+@[a-zA-Z0-9]+.[a-zA-Z0-9-.]+$';
}
