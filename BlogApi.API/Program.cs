using BlogApi.Application.Interfaces;
using BlogApi.Infrastructure.Data;
using BlogApi.Infrastructure.Helpers;
using BlogApi.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddAuthorization();
builder.Services.AddSwaggerGen(options =>
{
    
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "BlogApi",
        Version = "v1"
    });

    // Swagger'a JWT Bearer şeması tanıtılıyor
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT token'ı buraya gir. Örnek: Bearer eyJhbGciOiJIUzI1Ni..."
    });

    // Bu security scheme'in endpointlerde kullanılabileceğini söylüyoruz
    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecuritySchemeReference("Bearer", document, null),
            new List<string>()
        }
    });


});




// Burada appsettings.json içindeki DefaultConnection okunur
// UseSqlServer ile EF Core'a MSSQL kullanacağını söylüyoruz
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<JwtTokenGenerator>();

// JWT authentication ayarları
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // appsettings.json içindeki Jwt:Key değerini alıyoruz
        var key = builder.Configuration["Jwt:Key"];

        options.TokenValidationParameters = new TokenValidationParameters
        {
            // imza doğru mu 
            ValidateIssuerSigningKey = true,

            // Secret key ile doğrulama yap
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!)),

            //token'ı kim üretti
            ValidateIssuer = true,

            // kabul edilen issuer(benim ürettiğim token)
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            // token kimin için
            ValidateAudience = true,

            // kabul edilen audience ne 
            ValidAudience = builder.Configuration["Jwt:Audience"],

            // Süresi dolmuş token geçersiz olsun
            ValidateLifetime = true,

            // süre bittiyse direkt  reddet
            ClockSkew = TimeSpan.Zero
        };
    }); 

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Şimdilik HTTPS yönlendirmesini bırakıyoruz
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Controller route'larını aktif hale getiriyoruz
app.MapControllers();

app.Run();