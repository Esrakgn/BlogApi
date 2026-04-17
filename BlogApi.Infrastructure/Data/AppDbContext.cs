using System;
using System.Collections.Generic;
using System.Text;
using BlogApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) 
            : base(options) 
        { 
        }

        public DbSet<AppUser> Users { get; set; }
        public DbSet<Post> Posts { get; set; }

        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Post>()
                .HasOne(p => p.Author)           // Post'un bir Author'ı var
                .WithMany(u => u.Posts)          // AppUser'ın birçok Post'u var
                .HasForeignKey(p => p.AuthorId)  // Foreign key: AuthorId
                .OnDelete(DeleteBehavior.Cascade); // User silinirse postları da silinsin

            // Email alanı için unique index ekliyoruz
            // Aynı email ile iki kullanıcı oluşmasın diye bunu şimdiden ekliyoruz
            modelBuilder.Entity<AppUser>()
                .HasIndex(u => u.Email)
                .IsUnique();


            modelBuilder.Entity<Post>()
              .HasOne(p => p.Category)
              .WithMany(c => c.Posts)
              .HasForeignKey(p => p.CategoryId)
              .OnDelete(DeleteBehavior.Restrict);

        }



    }
}
