using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.Enums
{
    public enum CategoryActionResult
    {
        Success,
        NotFound,
        Conflict // işlem çakıştı 
    }
}
//conflict aynı isimde kategori zaten varsa veya
//kategoriye bağlı postlar varken silmeye çalışırsan
