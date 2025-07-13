using Newtonsoft.Json;
using System.Text;

namespace BIP_Tenant_Portal
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public ApiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _baseUrl = configuration.GetValue<string>("BaseURL:WebApiURL") ?? string.Empty;
        }

        public async Task<T> GetAsync<T>(string apiEndpoint)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}{apiEndpoint}");
            return await HandleResponse<T>(response);
        }

        public async Task<HttpResponseMessage> PostAsync<T>(string apiEndpoint, T data)
        {
            var content = SerializeContent(data);
            var response = await _httpClient.PostAsync($"{_baseUrl}{apiEndpoint}", content);
            return response;
        }

        public async Task<HttpResponseMessage> PutAsync<T>(string apiEndpoint, T data)
        {
            var content = SerializeContent(data);
            var response = await _httpClient.PutAsync($"{_baseUrl}{apiEndpoint}", content);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteAsync(string apiEndpoint)
        {
            var response = await _httpClient.DeleteAsync($"{_baseUrl}{apiEndpoint}");
            return response;
        }

        private static StringContent SerializeContent<T>(T data)
        {
            var json = JsonConvert.SerializeObject(data);
            return new StringContent(json, Encoding.UTF8, "application/json");
        }

        private static async Task<T> HandleResponse<T>(HttpResponseMessage response)
        {
            var content = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                return JsonConvert.DeserializeObject<T>(content)!;
            }
            else
            {
                throw new HttpRequestException($"API request failed with status code: {response.StatusCode}, Response: {content}");
            }
        }
    }
}
