using System.Text;
using DefendX.API.Common.Email.Model;
using Microsoft.AspNetCore.Http;

namespace DefendX.API.Common.Email.Builder
{
    public abstract class TEmailBuilder
    {
        protected EmailRequest _emailRequest { get; }
        protected string _toEmailAddress;
        protected string _senderName;
        protected long _senderId;
        protected string _senderEmail;
        protected string _subject;
        protected string _bodyContent;
        protected IFormFile _attachment;
        protected string _linkedImage;

        public TEmailBuilder(
            EmailRequest emailRequest,
            string toEmailAddress, 
            string senderName, 
            long senderId, 
            string senderEmail, 
            string subject, 
            string bodyContent, 
            IFormFile attachment = null,
            string linkedImage = null)
        {
            this._emailRequest = emailRequest;
            this._toEmailAddress = toEmailAddress;
            this._senderName = senderName;
            this._senderId = senderId;
            this._senderEmail = senderEmail;
            this._subject = subject;
            this._bodyContent = bodyContent;
            this._attachment = attachment;
            this._linkedImage = linkedImage;
        }

        public abstract void BuildToAddress();
        public abstract void BuildSubject();
        public abstract void BuildBody();
        public abstract void BuildAttachment();
        public abstract void BuildLinkedImage();

        public EmailRequest GetEmailRequest()
        {
            return this._emailRequest;
        }
    }
}