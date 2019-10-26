using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BackEndApi.Services.Templates
{
    public interface ITemplateService
    {
        /// <summary>
        /// Renders a template given the provided view model
        /// </summary>
        /// <typeparam name="TViewModel"></typeparam>
        /// <param name="filename">Filename of the template to render</param>
        /// <param name="viewModel">View model to use for rendering the template</param>
        /// <returns>Returns the rendered template content</returns>
        Task<string> RenderTemplateAsync<TViewModel>(string filename, TViewModel viewModel);

    }
    public class TemplateService : ITemplateService
    {
        private IRazorViewEngine _viewEngine;
        private readonly IServiceProvider _serviceProvider;
        private readonly ITempDataProvider _tempDataProvider;

        /// <summary>
        /// Constructior con Inyección de dependencias
        /// </summary>
        /// <param name="viewEngine"></param>
        /// <param name="serviceProvider"></param>
        /// <param name="tempDataProvider"></param>
        public TemplateService(IRazorViewEngine viewEngine, IServiceProvider serviceProvider, ITempDataProvider tempDataProvider)
        {
            _viewEngine = viewEngine;
            _serviceProvider = serviceProvider;
            _tempDataProvider = tempDataProvider;
        }

        /// <summary>
        /// Genera template genérico basado en nombre de archivo de vista
        /// </summary>
        /// <typeparam name="TViewModel"></typeparam>
        /// <param name="filename"></param>
        /// <param name="viewModel"></param>
        /// <returns></returns>
        public async Task<string> RenderTemplateAsync<TViewModel>(string filename, TViewModel viewModel)
        {
            var httpContext = new DefaultHttpContext
            {
                RequestServices = _serviceProvider
            };


            var actionContext = new ActionContext(httpContext, new RouteData(), new ActionDescriptor());

            using (var outputWriter = new StringWriter())
            {
                //var viewResult = _viewEngine.FindView(actionContext, filename, false);
                var viewResult = _viewEngine.GetView(filename, filename, false);
                var viewDictionary = new ViewDataDictionary<TViewModel>(new EmptyModelMetadataProvider(), new ModelStateDictionary())
                {
                    Model = viewModel
                };
                viewDictionary.Model = viewModel;

                var tempDataDictionary = new TempDataDictionary(httpContext, _tempDataProvider);

                if (!viewResult.Success)
                {
                    throw new TemplateServiceException($"Failed to render template {filename} because it was not found.");
                }

                try
                {
                    var viewContext = new ViewContext(actionContext, viewResult.View, viewDictionary,
                        tempDataDictionary, outputWriter, new HtmlHelperOptions());

                    await viewResult.View.RenderAsync(viewContext);
                }
                catch (Exception ex)
                {
                    throw new TemplateServiceException("Failed to render template due to a razor engine failure", ex);
                }

                return outputWriter.ToString();
            }
        }
    }
    /// <summary>
    /// Excepción de plantilla
    /// </summary>
    public class TemplateServiceException : Exception
    {
        /// <summary>
        /// Initializes a new instance of <see cref="TemplateServiceException"/>
        /// </summary>
        /// <param name="message"></param>
        public TemplateServiceException(string message) : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of <see cref="TemplateServiceException"/>
        /// </summary>
        /// <param name="message"></param>
        /// <param name="innerException"></param>
        public TemplateServiceException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
