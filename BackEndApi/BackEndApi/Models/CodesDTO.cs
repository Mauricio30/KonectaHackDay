namespace BackEndApi.Models
{
    public class CodesDTO
    {
        public string Email { get; set; }
        public string CellPhone { get; set; }

        public string EmailCode { get; set; }
        public string CellphoneCode { get; set; }

        public bool Confirmed { get; set; }
    }
}