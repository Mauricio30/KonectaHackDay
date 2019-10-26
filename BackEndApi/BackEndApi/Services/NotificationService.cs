using BackEndApi.Models;
using BackEndApi.Services.Email;
using BackEndApi.Services.Templates;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEndApi.Services
{
    public interface INotificationService
    {
        System.Threading.Tasks.Task<bool> SendNotificationAsync(string notificationCode, CodesDTO codesDTO);
    }

    public class NotificationService : INotificationService
    {
        private readonly IEmailSender _emailSender;
        private readonly ISMSSender _smsSender;
        private readonly IHtmlToPdfService _htmlToPdfService;
        private readonly ITemplateService _templateService;
        private readonly IConfigurationRoot _configurationRoot;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="emailSender"></param>
        /// <param name="smsSender"></param>
        /// <param name="htmlToPdfService"></param>
        /// <param name="templateService"></param>
        /// <param name="configurationRoot"></param>
        /// <param name="context"></param>
        public NotificationService(
            IEmailSender emailSender,
            ISMSSender smsSender,
            IHtmlToPdfService htmlToPdfService,
            ITemplateService templateService,
            IConfigurationRoot configurationRoot)
        {
            _emailSender = emailSender;
            _smsSender = smsSender;
            _htmlToPdfService = htmlToPdfService;
            _templateService = templateService;
            _configurationRoot = configurationRoot;
            
        }

        public async System.Threading.Tasks.Task<bool> SendNotificationAsync(string notificationCode, CodesDTO codesDTO)
        {
            // Get notification setup from DB 
            try
            {
                if (notificationCode == "CODES_GENERATED")
                {
                    // Generates the body content in html format
                    //string message = await _templateService.RenderTemplateAsync("/Templates/" + notification.TemplateName + "_EmailTemplate.cshtml", model);
                    string message = "Este es el código para firmar tu contrato: " + codesDTO.EmailCode;
                    
                    List<Email.AttachmentFile> attachments = await GetAttachementsAsync(codesDTO);

                    await _emailSender.SendEmailAsync(codesDTO.Email, "Firma tu contrato", message, attachments);

                    // Get message from repository
                    //string smsMessage = await _templateService.RenderTemplateAsync("/Templates/" + notification.TemplateName + "_SMSTemplate.cshtml", model);
                    string smsMessage = "Este es el codigo para firmar tu contrato: " + codesDTO.CellphoneCode;

                    // Send message
                    await _smsSender.SendSMSAsync(codesDTO.CellPhone, smsMessage);
                }
                else if (notificationCode == "CONFIRM_CODES")
                {
                    // Generates the body content in html format
                    //string message = await _templateService.RenderTemplateAsync("/Templates/" + notification.TemplateName + "_EmailTemplate.cshtml", model);
                    string message = "Adjunto encontrarás tu contrato firmado. ";
                    List<Email.AttachmentFile> attachments = await GetAttachementsAsync(codesDTO);

                    await _emailSender.SendEmailAsync(codesDTO.Email, "Felicidades, has firmado", message, attachments);

                }


                return true;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        internal async Task<List<AttachmentFile>> GetAttachementsAsync(CodesDTO codesDTO)
        {
            var templateNames = new List<(string TemplateName, string FileName)>();
            List<AttachmentFile> attachmentFiles = new List<AttachmentFile>();
            
            // Generates the document in string format
            string documentString = await _templateService.RenderTemplateAsync("/Templates/ContractTemplate.cshtml", codesDTO);
            // Creates the PDF file based in string document
            byte[] file = _htmlToPdfService.GetPdfFromHtlm(documentString);
            // Add the file to the output
            attachmentFiles.Add(new AttachmentFile() { Data = file, Name = "Contrato.pdf" });

            return attachmentFiles;
        }
    }
}
