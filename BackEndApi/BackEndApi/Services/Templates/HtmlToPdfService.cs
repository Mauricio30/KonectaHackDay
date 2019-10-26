using DinkToPdf;
using DinkToPdf.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Loader;
using System.Threading.Tasks;

namespace BackEndApi.Services.Templates
{
    public interface IHtmlToPdfService
    {
        /// <summary>
        /// Convert the string content in byte array object
        /// </summary>
        /// <param name="htmlDocumentContent"></param>
        /// <param name="showHeader"></param>
        /// <returns></returns>
        byte[] GetPdfFromHtlm(string htmlDocumentContent, bool showHeader = true);
    }
    public class HtmlToPdfService : IHtmlToPdfService
    {
        #region DependencyInjectionConstructor
        private IConverter _converter;
        private ITemplateService _templateService;

        public HtmlToPdfService(
            IConverter converter,
            ITemplateService templateService)
        {
            _converter = converter;
            _templateService = templateService;
        }
        #endregion

        #region GetPdfFromHtlmMethod
        /// <summary>
        /// Method that receives a html document and 
        /// converts it in a bytes array document
        /// </summary>
        /// <param name="htmlDocumentContent">Document content in HTML format</param>
        /// <param name="showHeader"></param>
        /// <returns>Document converted into PDF in the form of a bytes array</returns>
        public byte[] GetPdfFromHtlm(string htmlDocumentContent, bool showHeader = true)
        {
            var doc = new HtmlToPdfDocument()
            {
                GlobalSettings = {
                    PaperSize = PaperKind.Letter,
                    Orientation = Orientation.Portrait,
                    Margins = showHeader ? new MarginSettings(20, 20, 20, 10) : new MarginSettings(10, 10, 10, 10) ,
                },

                Objects = {
                    new ObjectSettings()
                    {
                        HtmlContent = htmlDocumentContent,
                        HeaderSettings = showHeader ? (new HeaderSettings(){
                            FontSize = 9,
                            //Right = "Page [page] of [toPage]",
                            Line = false,
                            Spacing = 2.812,
                            HtmUrl = "https://api.micredi.com.co/html/pdfDocumentHeader.html",
                            FontName = "Muli"
                        }) : null,

                    }
                }
            };

            CustomAssemblyLoadContext context = new CustomAssemblyLoadContext();
            context.LoadUnmanagedLibrary(System.IO.Directory.GetCurrentDirectory() + "\\libwkhtmltox.dll");

            var converter = new SynchronizedConverter(new PdfTools());

            return _converter.Convert(doc);
        }
        #endregion

        #region supportClassForLoadingDLL
        internal class CustomAssemblyLoadContext : AssemblyLoadContext
        {
            public IntPtr LoadUnmanagedLibrary(string absolutePath)
            {
                return LoadUnmanagedDll(absolutePath);
            }
            protected override IntPtr LoadUnmanagedDll(String unmanagedDllName)
            {
                return LoadUnmanagedDllFromPath(unmanagedDllName);
            }

            protected override System.Reflection.Assembly Load(System.Reflection.AssemblyName assemblyName)
            {
                throw new NotImplementedException();
            }
        }
        #endregion
    }
}
