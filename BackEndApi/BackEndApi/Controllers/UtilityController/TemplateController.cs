using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEndApi.Services.Templates;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackEndApi.Controllers.UtilityController
{
    [Produces("application/json")]
    [Route("template")]
    public class TemplateController : Controller
    {
        private IHtmlToPdfService _htmlToPdfService;
        private ITemplateService _templateService;

        public TemplateController(
           IHtmlToPdfService htmlToPdfService,
           ITemplateService templateService)
        {
            _htmlToPdfService = htmlToPdfService;
            _templateService = templateService;

        }

        [AllowAnonymous]
        [HttpGet("pdf")]
        public async Task<IActionResult> Get(string templateName, string key = "")
        {
            bool showHeader = templateName == "PaymentReceipt" ? false : true;

            object model = GetTmplTestModel(templateName, key);

            string documentContent = await _templateService.RenderTemplateAsync("/Templates/" + templateName + "_EmailTemplate.cshtml", model);

            byte[] pdf = _htmlToPdfService.GetPdfFromHtlm(documentContent, showHeader);

            return new FileContentResult(pdf, "application/pdf");
        }


        [AllowAnonymous]
        [HttpGet("html")]
        public IActionResult GetHtml(string templateName, bool partialView = false, string key = "")
        {
            object model = GetTmplTestModel(templateName, key);

            IActionResult view;
            ViewBag.PartialView = partialView;

            if (partialView)
            {
                view = PartialView("/Templates/" + templateName + "_EmailTemplate.cshtml");
            }
            else
            {
                view = View("/Templates/" + templateName + "_EmailTemplate.cshtml", model);
            }

            return view;
        }

        private object GetTmplTestModel(string templateName, string key)
        {
            return Ok();
        }
    
     }
}