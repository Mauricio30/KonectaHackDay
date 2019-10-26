using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace BackEndApi.Services
{

    public interface ISMSSender
    {
        Task<bool> SendSMSAsync(string number, string messageBody);
    }

    public class SMSSender : ISMSSender
    {
        private IConfigurationRoot _configurationRoot;

        public SMSSender(
            IConfigurationRoot configurationRoot
        )
        {
            _configurationRoot = configurationRoot;
        }

        public async Task<bool> SendSMSAsync(string number, string messageBody)
        {
            try
            {
                var cliente = _configurationRoot["HablameSMS:cliente"];
                var api = _configurationRoot["HablameSMS:api"];
                var basePath = _configurationRoot["HablameSMS:basePath"];
                string fecha = "";
                string referencia = "";

                // Using httpClient 
                HttpClient httpClient = new HttpClient
                {
                    BaseAddress = new Uri(basePath)
                };

                // Se crea el contenido para adicionar el encabezado de Content-type
                var content = new StreamContent(System.IO.Stream.Null);
                content.Headers.Add("Content-Type", "application/x-www-form-urlencoded");

                // Recurso a solicitar
                string requestUri = "?cliente=" + cliente
                                   + "&api=" + api
                                   + "&numero=" + "57" + number
                                   + "&sms=" + messageBody
                                   + "&fecha=" + fecha
                                   + "&referencia=" + referencia;

                // Se crea la solicitud
                var request = new HttpRequestMessage(HttpMethod.Get, requestUri)
                {
                    Content = content
                };

                // Se envía la solicitud
                HttpResponseMessage response = await httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    // Se obtiene y lee respuesta
                    var stringResponse = await response.Content.ReadAsStringAsync();
                    // Parse Json string into Json Object
                    JObject jObjectResponse = JObject.Parse(stringResponse);
                    // Valida que el tag de ressultado venga en la respuesta
                    var resultado = jObjectResponse["resultado"];
                    if (resultado != null)
                    {
                        if (resultado.Value<int>() == 0)
                        {
                            await Task.CompletedTask;

                            return true;
                        }
                    }
                }

                await Task.CompletedTask;

                return false;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
