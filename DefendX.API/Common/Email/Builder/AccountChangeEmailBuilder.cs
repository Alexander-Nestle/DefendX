using System;
using System.IO;
using DefendX.API.Common.Email.Model;
using Microsoft.AspNetCore.Http;

namespace DefendX.API.Common.Email.Builder
{
    public class AccountChangeEmailBuilder : TEmailBuilder
    {
        public AccountChangeEmailBuilder(
            EmailRequest emailRequest,
            string toEmailAddress,
            string senderName, 
            long senderId, 
            string senderEmail, 
            string subject, 
            string bodyContent, 
            IFormFile attachment
        ) : base(
                emailRequest,
                toEmailAddress,
                senderName, 
                senderId, 
                senderEmail, 
                subject, 
                bodyContent, 
                attachment
            ) {}

        public override void BuildToAddress()
        {
            this._emailRequest.ToAddress = this._toEmailAddress;
        }

        public override void BuildAttachment()
        {
            this._emailRequest.Attachment = this._attachment;
        }

        public override void BuildLinkedImage()
        {
            this._emailRequest.LinkedImage = this._linkedImage;
        }

        public override void BuildBody()
        {

            
            var body = string.Format(
                
                @"<!DOCTYPE html>

                <html lang=""en"">
                    <head>
                        <meta charset=""utf-8"" />
                        <title>The HTML5 Herald</title>
                        <meta name=""description"" content=""The HTML5 Herald"" />
                        <meta name=""author"" content=""SitePoint"" />
                    </head>

                    <body>
                        <div style=""background-color: #e6e6e6; max-width: 600px;"">
                            <h3>Account Update Request</h3>
                            <div style""background-color: #fafafa; width: 100%;"">
                                <p>A DefendX user has submitted an account type change request. The change request is detailed below and their appointment letter or MFR has been attached to this email.  Please address the request as soon as possible.</p>
                                <p>---------------------------------------------------------</p>
                                <p>
                                    Username: {0}<br/>
                                    Dod ID: {1}<br/>
                                    User Email: {2}<br/>
                                    Requested Account Type: {3}<br/>
                                    Justification: {4}
                                </p>
                                <p>------------------------------------------------------------</p>
                                <p>If you have any questions regarding the request, please contact the user.</p>
                                <p>
                                    ---<br/>
                                    Software Development Team<br/>
                                    18 CS/SCXD<br/>
                                </p>
                            </div>
                        </div>
                    </body>
                </html>",
                this._senderName,
                this._senderId,
                this._senderEmail,
                this._subject,
                this._bodyContent,
                this._linkedImage);

            this._emailRequest.Body = body;
        }

        public override void BuildSubject()
        {
            this._emailRequest.Subject = string.Format("DefendX Account Change Request: {0}", this._senderName);
        }

    }
}