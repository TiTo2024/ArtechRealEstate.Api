using Microsoft.EntityFrameworkCore;
using ArtechRealEstate.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// إضافة PostgreSQL DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// تفعيل الـ CORS عشان الـ React App (تم إضافة البورت الحالي 5174)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

// يجب أن يتم وضع UseCors هنا قبل UseAuthorization و MapControllers
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();