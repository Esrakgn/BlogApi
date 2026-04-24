using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Common
{
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }

    }
}
//sadece veri listesi değil pagination bilgileri de dönecek 
//generic yaptim çünkü sadece post değil kategori veya comment için de kullanılabilir diye 