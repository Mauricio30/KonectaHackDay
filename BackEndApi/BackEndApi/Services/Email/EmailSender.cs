using BackEndApi.Utility;
using Microsoft.Extensions.Configuration;
using System;
using MimeKit;
using MailKit.Net.Smtp;
using System.Threading.Tasks;
using BackEndApi.Services.Email;
using System.Collections.Generic;

namespace BackEndApi.Services
{
    public interface IEmailSender
    {
        Task<bool> SendEmailAsync(string email, string subject, string message, List<AttachmentFile> attachments);
    }

    public class EmailSender : IEmailSender
    {
        #region DependencyInjection
        private IConfigurationRoot _configurationRoot;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="configurationRoot"></param>
        public EmailSender(
            IConfigurationRoot configurationRoot
        )
        {
            _configurationRoot = configurationRoot;
        }
        #endregion

        /// <summary>
        /// Envia el correo electrónico
        /// </summary>
        /// <param name="email"></param>
        /// <param name="subject"></param>
        /// <param name="message"></param>
        /// <param name="attachments"></param>
        /// <param name="name"></param>
        public async Task<bool> SendEmailAsync(string email, string subject, string message, List<AttachmentFile> attachments)
        {
            try
            {
                var username = _configurationRoot["EmailSettings:Username"];
                var password = _configurationRoot["EmailSettings:Password"];
                var fromEmail = _configurationRoot["EmailSettings:FromEmail"];
                var encriptionKey = _configurationRoot["EncriptionKey"];
                        
                // Decript variables
                username = Encrypt.Decrypted(username, encriptionKey);
                password = Encrypt.Decrypted(password, encriptionKey);

                var mymessage = new MimeMessage();
                mymessage.From.Add(new MailboxAddress("Konecta", fromEmail));
                mymessage.To.Add(new MailboxAddress(email));
                //mymessage.Bcc.Add(new MailboxAddress(fromEmail));
                mymessage.Subject = subject;

                var builder = new BodyBuilder();

                // Set the html-text version of the message text
                builder.HtmlBody = message;

                if (attachments != null)
                {
                    foreach (AttachmentFile attachment in attachments)
                    {
                        builder.Attachments.Add(attachment.Name, attachment.Data);
                    }
                }

                // Set the message body
                mymessage.Body = builder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    client.SslProtocols = System.Security.Authentication.SslProtocols.Tls12;
                    client.Connect(_configurationRoot["EmailSettings:SmtpServer"], 587);
                    client.Authenticate(username, password);

                    client.Send(mymessage);
                    client.Disconnect(true);
                }

                await Task.CompletedTask;
                return true;
            }
            catch (Exception e)
            {
                throw e;
            }

        }
        
    }
}
