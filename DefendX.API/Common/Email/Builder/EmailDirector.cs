using DefendX.API.Common.Email.Model;

namespace DefendX.API.Common.Email.Builder
{
    public class EmailDirector : IEmailDirector
    {
        private TEmailBuilder _builder;
        public EmailDirector(TEmailBuilder builder)
        {
            this._builder = builder;
        }

        public EmailRequest GetEmailRequest()
        {
            return this._builder.GetEmailRequest();
        }

        public void BuildEmailRequest()
        {
            this._builder.BuildToAddress();
            this._builder.BuildSubject();
            this._builder.BuildBody();
            this._builder.BuildAttachment();
            this._builder.BuildLinkedImage();
        }
    }
}